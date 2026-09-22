import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, HelpCircle, PawPrint, Repeat, Tent } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getLearnerProfile, type LearnerProfileRow } from "@/lib/api/learner";
import { firstNameOf } from "@/lib/utils";
import { readLocalLearner, writeLocalLearner } from "@/lib/storage/local-profile";
import { WolfMark } from "@/components/wolf-mark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({ component: ChildHome });

const ACTIONS = [
  { to: "/app/wilk", title: "Zapytaj Wilka", hint: "Pogadajmy o szkole i nie tylko.", icon: PawPrint, tone: "forest" },
  { to: "/app/szkola", title: "Nie zrozumiałem w szkole", hint: "Opowiedz, co było na lekcji.", icon: HelpCircle, tone: "honey" },
  { to: "/app/powtorka", title: "Powtórzmy coś", hint: "Krótko, bez sprawdzianu.", icon: Repeat, tone: "mist" },
  { to: "/app/lizaki", title: "Moje Lizaki", hint: "Nagrody za prawdziwe zrozumienie.", icon: BookOpen, tone: "paper" },
  { to: "/app/nora", title: "Moja Nora", hint: "Twoje miejsce w lesie.", icon: Tent, tone: "den" },
] as const;

function ChildHome() {
  const local = useMemo(() => readLocalLearner(), []);
  const [profile, setProfile] = useState<LearnerProfileRow | null>(null);

  useEffect(() => {
    getLearnerProfile()
      .then((row) => {
        setProfile(row);
        writeLocalLearner({
          displayName: row.displayName,
          age: row.age,
          schoolClass: row.schoolClass,
          preferredStyle: row.preferredStyle,
          lastSchoolTopics: row.lastSchoolTopics,
          lastSubject: row.lastSubject,
        });
      })
      .catch(() => undefined);
  }, []);

  const name = firstNameOf(profile?.displayName || local.displayName) || "młody wilku";
  const last = (profile?.lastSchoolTopics ?? local.lastSchoolTopics)[0];

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <section className="rounded-[32px] bg-white/70 p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/5">
        <p className="text-sm font-bold text-moss">Dobrze, że jesteś</p>
        <h1 className="font-display mt-1 text-4xl font-semibold text-forest">Cześć {name}</h1>
        <div className="mt-5 flex gap-3">
          <WolfMark size={72} />
          <div className="rounded-[24px] bg-mist px-4 py-3 text-left">
            <p className="text-sm font-extrabold text-forest">Młody Wilk</p>
            <p className="mt-1 text-base leading-snug text-ink">Co dziś było w szkole?</p>
          </div>
        </div>
        {last ? (
          <p className="mt-5 rounded-2xl bg-paper px-4 py-3 text-sm text-ink-soft">
            Ostatnio ćwiczyliśmy: <span className="font-bold text-ink">{last}</span>
          </p>
        ) : (
          <p className="mt-5 text-sm text-ink-soft">Tu pojawi się to, nad czym ostatnio pracowaliśmy — bez ocen i procentów.</p>
        )}
      </section>

      <div className="mt-5 grid gap-3">
        {ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "lift-card flex min-h-[4.5rem] items-center gap-4 rounded-[28px] px-5 py-4",
                item.tone === "honey" && "bg-honey text-ink",
                item.tone === "forest" && "bg-forest text-paper",
                item.tone === "mist" && "bg-mist text-ink",
                item.tone === "paper" && "bg-white/80 text-ink ring-1 ring-ink/10",
                item.tone === "den" && "bg-den text-paper",
              )}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-black/10">
                <Icon className="size-6" strokeWidth={2.2} />
              </span>
              <span className="text-left">
                <span className="block text-lg font-extrabold">{item.title}</span>
                <span className="block text-sm opacity-80">{item.hint}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
