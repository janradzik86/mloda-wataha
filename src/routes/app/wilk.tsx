import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, Volume2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaField } from "@/components/ui/field";
import { WolfMark } from "@/components/wolf-mark";
import { askYoungWolf } from "@/lib/api/young-wolf";
import { detectVoice, listenPolishOnce, OFFLINE_STT_MESSAGE, speakPolish } from "@/lib/voice/web-voice";

export const Route = createFileRoute("/app/wilk")({ component: WilkPage });

function WilkPage() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("Cześć. Jestem Młody Wilk. Co dziś było w szkole?");
  const [busy, setBusy] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const voice = detectVoice();

  async function send(next = text) {
    setBusy(true);
    try {
      const res = await askYoungWolf({ data: { text: next, mode: "chat" } });
      setReply(res.reply.reply.text);
    } catch {
      setReply("Nie mogę teraz odpowiedzieć. Spróbuj jeszcze raz albo napisz do mnie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Młody Wilk</h1>
      <p className="mt-1 text-sm text-ink-soft">Osobisty tutor. Nie ocenia. Szuka sposobu, który zadziała.</p>

      <div className="mt-5 flex gap-3 rounded-[28px] bg-white/80 p-4 ring-1 ring-ink/5">
        <WolfMark size={56} />
        <p className="text-base leading-relaxed text-ink">{reply}</p>
      </div>

      <div className="mt-4">
        <AreaField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napisz do Młodego Wilka…"
        />
      </div>

      {voiceNote ? <p className="mt-2 text-sm text-ink-soft">{voiceNote}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => send()} disabled={busy}>
          {busy ? "Wilk myśli…" : "Wyślij"}
        </Button>
        <Button
          variant="paper"
          onClick={async () => {
            if (!voice.stt) {
              setVoiceNote(OFFLINE_STT_MESSAGE);
              return;
            }
            setVoiceNote("Słucham…");
            const heard = await listenPolishOnce();
            if (!heard.ok) {
              setVoiceNote(OFFLINE_STT_MESSAGE);
              return;
            }
            setText(heard.text);
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
            if (!voice.tts) {
              setVoiceNote("Odczyt głosu nie jest dostępny na tym urządzeniu.");
              return;
            }
            void speakPolish(reply);
          }}
        >
          <Volume2 className="size-4" />
          Odczytaj
        </Button>
      </div>

      <Link
        to="/app/szkola"
        className="mt-6 flex min-h-16 items-center rounded-[24px] bg-honey px-5 py-4 text-left font-extrabold text-ink"
      >
        Nie zrozumiałem w szkole →
      </Link>
    </div>
  );
}
