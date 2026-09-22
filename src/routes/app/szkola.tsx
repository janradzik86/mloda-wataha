import { createFileRoute } from "@tanstack/react-router";
import { Camera, Mic, RefreshCw, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaField } from "@/components/ui/field";
import { WolfMark } from "@/components/wolf-mark";
import { SUBJECTS } from "@/lib/subjects";
import { askYoungWolf, explainDifferently } from "@/lib/api/young-wolf";
import { readLocalLearner, readSchoolHelpDraft, writeLocalLearner, writeSchoolHelpDraft, type LocalChatTurn } from "@/lib/storage/local-profile";
import { detectVoice, listenPolishOnce, OFFLINE_STT_MESSAGE, speakPolish } from "@/lib/voice/web-voice";
import { cn } from "@/lib/utils";
import type { SchoolSubject } from "@/lib/young-wilk/contract";

export const Route = createFileRoute("/app/szkola")({ component: SchoolHelpPage });

function SchoolHelpPage() {
  const [subject, setSubject] = useState<SchoolSubject | undefined>();
  const [text, setText] = useState("");
  const [turns, setTurns] = useState<LocalChatTurn[]>([]);
  const [busy, setBusy] = useState(false);
  const [cameraNote, setCameraNote] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const voice = detectVoice();

  useEffect(() => {
    const saved = readSchoolHelpDraft();
    if (saved.length) setTurns(saved);
    else {
      setTurns([
        {
          id: "hi",
          role: "wolf",
          at: Date.now(),
          text: "Opowiedz zwyczajnie: co było na lekcji i czego nie złapałeś. Nie musisz znać nazwy tematu.",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (turns.length) writeSchoolHelpDraft(turns);
  }, [turns]);

  async function send(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const childTurn: LocalChatTurn = { id: `c_${Date.now()}`, role: "child", text: trimmed, at: Date.now() };
    setTurns((t) => [...t, childTurn]);
    setText("");
    setBusy(true);
    try {
      const res = await askYoungWolf({
        data: { text: trimmed, mode: "school-help", subject },
      });
      const extra = res.kind === "school-help" ? (res.reply.clarificationPrompt ?? "") : "";
      const wolf: LocalChatTurn = {
        id: `w_${Date.now()}`,
        role: "wolf",
        text: res.reply.reply.text + (extra ? " " + extra : ""),
        at: Date.now(),
      };
      setTurns((t) => [...t, wolf]);
      const local = readLocalLearner();
      writeLocalLearner({
        lastSchoolTopics: [trimmed.slice(0, 80), ...local.lastSchoolTopics.filter((x) => x !== trimmed)].slice(0, 8),
        lastSubject: subject ?? local.lastSubject,
      });
    } catch {
      setTurns((t) => [
        ...t,
        { id: `e_${Date.now()}`, role: "wolf", text: "Chwilowo nie mogę połączyć się z Norą. Twoje słowa są zapisane tutaj, na urządzeniu.", at: Date.now() },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Nie zrozumiałem w szkole</h1>
      <p className="mt-1 text-sm text-ink-soft">Bez ocen. Szukamy sposobu tłumaczenia, który zadziała.</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSubject(s.id === subject ? undefined : (s.id as SchoolSubject))}
            className={cn(
              "shrink-0 rounded-full px-3 py-2 text-xs font-extrabold",
              subject === s.id ? "bg-forest text-paper" : "bg-white/70 text-ink-soft ring-1 ring-ink/10",
            )}
          >
            {s.namePl}
          </button>
        ))}
      </div>

      <ol className="mt-4 space-y-3">
        {turns.map((turn) => (
          <li key={turn.id} className={cn("flex gap-2", turn.role === "child" && "justify-end")}>
            {turn.role === "wolf" ? <WolfMark size={40} /> : null}
            <p
              className={cn(
                "max-w-[85%] rounded-[22px] px-4 py-3 text-sm leading-relaxed",
                turn.role === "wolf" ? "bg-white/80 text-ink" : "bg-forest text-paper",
              )}
            >
              {turn.text}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <AreaField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Np. Dzisiaj mieliśmy ułamki i nie zrozumiałam."
        />
      </div>
      {voiceNote ? <p className="mt-2 text-sm text-ink-soft">{voiceNote}</p> : null}
      {cameraNote ? <p className="mt-2 text-sm text-ink-soft">{cameraNote}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => send(text)} disabled={busy}>
          {busy ? "Słucham…" : "Powiedz Wilkowi"}
        </Button>
        <Button
          variant="paper"
          onClick={async () => {
            const res = await explainDifferently();
            setTurns((t) => [...t, { id: `d_${Date.now()}`, role: "wolf", text: res.reply.text, at: Date.now() }]);
          }}
        >
          <RefreshCw className="size-4" />
          Wytłumacz inaczej
        </Button>
        <Button
          variant="paper"
          onClick={async () => {
            if (!voice.stt) {
              setVoiceNote(OFFLINE_STT_MESSAGE);
              return;
            }
            const heard = await listenPolishOnce();
            if (!heard.ok) {
              setVoiceNote(OFFLINE_STT_MESSAGE);
              return;
            }
            setVoiceNote(null);
            await send(heard.text);
          }}
        >
          <Mic className="size-4" />
          Mów
        </Button>
        <Button
          variant="paper"
          onClick={() => {
            const last = [...turns].reverse().find((t) => t.role === "wolf");
            if (last) void speakPolish(last.text);
          }}
        >
          <Volume2 className="size-4" />
          Odczytaj
        </Button>
        <Button
          variant="paper"
          onClick={() =>
            setCameraNote("Zdjęcie zadania podłączymy, gdy będzie prawdziwe rozpoznawanie obrazu. Na razie wpisz zadanie albo zdanie z zeszytu.")
          }
        >
          <Camera className="size-4" />
          Zdjęcie zadania
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setCameraNote("Zdjęcie strony zeszytu — wkrótce. Nie udajemy OCR, dopóki nie jest podłączone.")
          }
        >
          Zdjęcie zeszytu
        </Button>
      </div>
    </div>
  );
}
