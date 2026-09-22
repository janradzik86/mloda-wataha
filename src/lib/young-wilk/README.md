# Miejsce pod Młodego Wilka

Rdzeń silnika żyje w branchu `chatgpt/mlody-wilk-v0.1` (PR #1):

- `young-wilk/types.ts`
- `young-wilk/core.ts`
- `young-wilk/knowledge.ts`
- `young-wilk/diagnostic.ts`
- `young-wilk/school-help.ts`
- `young-wilk/learning-memory.ts`
- `young-wilk/voice.ts`

Ta aplikacja trzyma tylko **kontrakt** i **adapter**.
Nie kopiujemy tu drugiego silnika.

Po merge: podmienić `createYoungWolfEngine()` w `adapter.ts`.
