import { createFileRoute, Link } from "@tanstack/react-router";
import { SUBJECTS } from "@/lib/subjects";

export const Route = createFileRoute("/app/nauka")({ component: NaukaPage });

function NaukaPage() {
  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Nauka</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Mapa przedmiotów jest gotowa. Pakiety lekcji dołożymy po podłączeniu Młodego Wilka.
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUBJECTS.map((s) => (
          <li key={s.id}>
            <Link
              to="/app/szkola"
              className="lift-card block min-h-24 rounded-[24px] bg-white/80 p-4 ring-1 ring-ink/5"
            >
              <p className="font-extrabold text-forest">{s.namePl}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
