import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { readLocalLearner } from "@/lib/storage/local-profile";

export const Route = createFileRoute("/app/powtorka")({ component: ReviewPage });

function ReviewPage() {
  const local = useMemo(() => readLocalLearner(), []);
  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Powtórka</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Mikro-powtórka to jeden krok, nie cały dział. Bez procentów, bez „nie zdałeś”.
      </p>
      {local.lastSchoolTopics.length === 0 ? (
        <p className="mt-6 rounded-[24px] bg-white/80 p-5 text-ink">
          Jeszcze nic nie odkładaliśmy do powtórki. Jak coś będzie wymagało chwili — Wilk to zapamięta.
        </p>
      ) : (
        <ul className="mt-5 space-y-2">
          {local.lastSchoolTopics.map((t) => (
            <li key={t} className="rounded-2xl bg-mist px-4 py-3 text-sm font-bold text-forest">
              {t}
            </li>
          ))}
        </ul>
      )}
      <Link to="/app/szkola" className="mt-6 inline-flex min-h-12 items-center font-extrabold text-forest">
        Wróć do „Nie zrozumiałem w szkole”
      </Link>
    </div>
  );
}
