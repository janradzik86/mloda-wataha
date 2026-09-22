import { createFileRoute } from "@tanstack/react-router";
import { ForestBackdrop, WolfMark } from "@/components/wolf-mark";

export const Route = createFileRoute("/app/nora")({ component: NoraPage });

function NoraPage() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden pb-10">
      <div className="relative min-h-72 overflow-hidden rounded-[32px] bg-forest">
        <ForestBackdrop />
        <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center">
          <WolfMark size={84} />
          <h1 className="font-display mt-3 text-3xl font-semibold text-paper">Nora Młodego Wilka</h1>
          <p className="mt-2 max-w-sm text-sm text-paper/80">
            Prywatne miejsce. Za lizaki odblokujesz wygląd wilka, tła i historie — nigdy przewagi w nauce.
          </p>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {["Wygląd wilka", "Tło nory", "Emblematy", "Krótka historia"].map((item) => (
          <li key={item} className="rounded-[24px] bg-white/70 px-4 py-5 text-sm font-bold text-ink-soft ring-1 ring-ink/5">
            {item}
            <span className="mt-1 block text-xs font-semibold">wkrótce</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
