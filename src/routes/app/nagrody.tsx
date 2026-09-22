import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldLabel, TextField, AreaField } from "@/components/ui/field";
import { createSongRequest, listMySongRequests } from "@/lib/api/family-bridge";

export const Route = createFileRoute("/app/nagrody")({ component: RewardsPage });

const STATUS_PL: Record<string, string> = {
  WAITING_FOR_PARENT: "Czeka na opiekuna",
  PARENT_APPROVED: "Opiekun zatwierdził",
  PARENT_REJECTED: "Opiekun odrzucił",
  SENT_TO_WOJAN_STUDIO: "Wysłane do studia",
  IN_PRODUCTION: "W produkcji",
  READY_FOR_PARENT: "Gotowe dla opiekuna",
  PARENT_APPROVED_DELIVERY: "Można przekazać",
  DELIVERED_TO_CHILD: "Dostarczone",
};

function RewardsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<{ id: string; title: string; status: string }[]>([]);
  const [note, setNote] = useState<string | null>(null);

  async function refresh() {
    const rows = await listMySongRequests();
    setItems(rows);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Piosenka / dedykacja</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Nie piszesz prosto do Wojan Studio. Prośba idzie najpierw do opiekuna przez Family Bridge.
      </p>
      <form
        className="mt-5 space-y-3 rounded-[24px] bg-white/80 p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createSongRequest({ data: { title, message } });
            setTitle("");
            setMessage("");
            setNote("Prośba czeka na opiekuna.");
            await refresh();
          } catch {
            setNote("Nie udało się wysłać. Spróbuj później.");
          }
        }}
      >
        <div>
          <FieldLabel htmlFor="song">O czym ma być piosenka?</FieldLabel>
          <TextField id="song" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <FieldLabel htmlFor="msg">Wiadomość dla opiekuna</FieldLabel>
          <AreaField id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <Button type="submit">Wyślij do opiekuna</Button>
        {note ? <p className="text-sm text-ink-soft">{note}</p> : null}
      </form>
      <ul className="mt-5 space-y-2">
        {items.map((it) => (
          <li key={it.id} className="rounded-2xl bg-mist px-4 py-3">
            <p className="font-bold text-forest">{it.title}</p>
            <p className="text-xs text-ink-soft">{STATUS_PL[it.status] ?? it.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
