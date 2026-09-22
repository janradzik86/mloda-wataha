import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLearnerProfile } from "@/lib/api/learner";

export const Route = createFileRoute("/app/lizaki")({ component: LizakiPage });

function LizakiPage() {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    getLearnerProfile()
      .then((p) => setBalance(p.lollipopBalance))
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Lizaki Watahy</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Lizak za opanowanie tematu, mikro-powtórkę albo misję. Nie za samo kliknięcie. Bez losowań i kar.
      </p>
      <div className="mt-6 rounded-[32px] bg-honey px-6 py-8 text-center text-ink">
        <p className="text-sm font-bold">Twoje lizaki</p>
        <p className="font-display mt-2 text-6xl font-semibold tabular-nums">{balance}</p>
      </div>
      <p className="mt-4 text-sm text-ink-soft">Sklep Nory i mini-gry odblokujemy w kolejnym etapie.</p>
      <Link to="/app/nora" className="mt-4 inline-flex min-h-12 font-extrabold text-forest">
        Zobacz Norę →
      </Link>
    </div>
  );
}
