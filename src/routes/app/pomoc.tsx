import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/app/pomoc")({ component: HelpPage });

function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Potrzebuję pomocy</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Proste rzeczy, bez map i radia dorosłych. Jeśli jesteś w niebezpieczeństwie — dzwoń.
      </p>
      <div className="mt-5 grid gap-3">
        <a
          href="tel:112"
          className="flex min-h-20 items-center justify-center rounded-[28px] bg-berry text-xl font-extrabold text-paper"
        >
          <Phone className="mr-2 size-6" />
          112
        </a>
        <a
          href="tel:"
          className="flex min-h-16 items-center justify-center rounded-[24px] bg-forest text-lg font-extrabold text-paper"
        >
          Zadzwoń do rodzica
        </a>
        <div className="rounded-[24px] bg-white/80 p-5 ring-1 ring-ink/5">
          <p className="font-extrabold text-forest">Powiadom opiekuna</p>
          <p className="mt-1 text-sm text-ink-soft">
            Family Bridge może wysłać sygnał do sparowanego rodzica. W tym etapie przygotowaliśmy miejsce na to powiadomienie.
          </p>
        </div>
        <div className="rounded-[24px] bg-mist p-5">
          <p className="font-extrabold text-forest">Jestem bezpieczny</p>
          <p className="mt-1 text-sm text-ink-soft">Jeśli już jest dobrze — daj znać opiekunowi, gdy będzie połączenie.</p>
        </div>
        <div className="rounded-[24px] bg-paper p-5 ring-1 ring-ink/10">
          <p className="font-bold">Spokojne kroki</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-soft">
            <li>Znajdź dorosłego, któremu ufasz.</li>
            <li>Jeśli grozi niebezpieczeństwo, zadzwoń na 112.</li>
            <li>Zostań w miejscu, które znasz, jeśli to bezpieczne.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
