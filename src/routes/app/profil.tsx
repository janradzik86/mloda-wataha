import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { Button } from "@/components/ui/button";
import { FieldLabel, TextField } from "@/components/ui/field";
import { getLearnerProfile, patchLearnerProfile } from "@/lib/api/learner";
import { readLocalLearner, writeLocalLearner } from "@/lib/storage/local-profile";
import type { ExplainStyle } from "@/lib/young-wilk/contract";

export const Route = createFileRoute("/app/profil")({ component: ProfilePage });

const STYLES: { id: ExplainStyle; label: string }[] = [
  { id: "simple", label: "Prościej" },
  { id: "step_by_step", label: "Krok po kroku" },
  { id: "example", label: "Na przykładzie" },
  { id: "mission", label: "Mini-misja" },
  { id: "standard", label: "Zwykle" },
];

function ProfilePage() {
  const local = readLocalLearner();
  const [name, setName] = useState(local.displayName);
  const [age, setAge] = useState(local.age?.toString() ?? "");
  const [klass, setKlass] = useState(local.schoolClass?.toString() ?? "");
  const [style, setStyle] = useState<ExplainStyle>(local.preferredStyle);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getLearnerProfile()
      .then((p) => {
        setName(p.displayName || local.displayName);
        setAge(p.age?.toString() ?? "");
        setKlass(p.schoolClass?.toString() ?? "");
        setStyle(p.preferredStyle);
      })
      .catch(() => undefined);
    // local snapshot is a first paint only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest">Profil</h1>
          <p className="mt-1 text-sm text-ink-soft">Wilk zapamiętuje, jak lubisz się uczyć. Nie etykietuje Cię.</p>
        </div>
        <UserButton />
      </div>
      <form
        className="mt-5 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const ageN = age ? Number(age) : null;
          const classN = klass ? Number(klass) : null;
          writeLocalLearner({
            displayName: name,
            age: ageN,
            schoolClass: classN,
            preferredStyle: style,
          });
          await patchLearnerProfile({
            data: {
              displayName: name,
              age: ageN && Number.isFinite(ageN) ? ageN : null,
              schoolClass: classN && Number.isFinite(classN) ? classN : null,
              preferredStyle: style,
            },
          });
          setSaved(true);
        }}
      >
        <div>
          <FieldLabel htmlFor="name">Imię</FieldLabel>
          <TextField id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel htmlFor="age">Wiek</FieldLabel>
            <TextField id="age" type="number" min={6} max={18} value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="klass">Klasa</FieldLabel>
            <TextField id="klass" type="number" min={1} max={8} value={klass} onChange={(e) => setKlass(e.target.value)} />
          </div>
        </div>
        <p className="text-sm font-bold text-ink-soft">Jak mam tłumaczyć?</p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              className={
                style === s.id
                  ? "rounded-full bg-forest px-3 py-2 text-sm font-extrabold text-paper"
                  : "rounded-full bg-white px-3 py-2 text-sm font-bold text-ink-soft ring-1 ring-ink/10"
              }
            >
              {s.label}
            </button>
          ))}
        </div>
        <Button type="submit">Zapisz</Button>
        {saved ? <p className="text-sm text-moss">Zapisane na urządzeniu i w profilu.</p> : null}
      </form>
    </div>
  );
}
