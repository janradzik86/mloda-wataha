# Młoda Wataha

Osobna aplikacja dla dzieci i młodzieży.

**To nie jest Polska Wataha.**
Nie jest zakładką, trybem ani modułem aplikacji dorosłego.
Nie kopiuj tu interfejsu, nawigacji ani WILKA z Polskiej Watahy.

Stan repozytorium: **ETAP 1 gotowy** (szkielet, auth, RBAC, dwa shelle, profil, Młody Wilk jako kontrakt+stub, Family Bridge API). Nora i sklep — ETAP 3. Silnik Młodego Wilka — branch `chatgpt/mlody-wilk-v0.1` / [PR #1](https://github.com/janradzik86/mloda-wataha/pull/1). Nie kopiujemy drugiego silnika.

## Ekosystem

Cztery elementy. Trzy interfejsy. Jeden most backendowy.

```text
[MŁODA WATAHA]          aplikacja dziecka + panel ADMIN
        |
        |  Family Bridge API
        |
[POLSKA WATAHA]          aplikacja dorosłego / rodzica
        |
        |  zatwierdzone zgłoszenia
        |
[WOJAN STUDIO]           panel twórcy (muzyka, live, produkcja)
```

Family Bridge **nie jest aplikacją użytkownika**. To warstwa API.

| Produkt | Dla kogo | Repo |
|---|---|---|
| Polska Wataha | dorosły, rodzic, sąsiad | [polska-wataha](https://github.com/janradzik86/polska-wataha) |
| Młoda Wataha | dziecko / młodzież + ADMIN | to repo |
| Wojan Studio | twórca / właściciel | [wojan-stream](https://github.com/janradzik86/wojan-stream) |
| Family Bridge | backend | kontrakt w `docs/FAMILY-BRIDGE.md` |

## Dokumenty

- [ARCHITECTURE.md](./ARCHITECTURE.md) — twarde granice, shell USER vs ADMIN, kolejność budowy
- [docs/FEATURE-MAP.md](./docs/FEATURE-MAP.md) — każda funkcja przypisana do jednej aplikacji
- [docs/RBAC.md](./docs/RBAC.md) — role ADMIN / USER i przyszłe role
- [docs/FAMILY-BRIDGE.md](./docs/FAMILY-BRIDGE.md) — parowanie, zgody, zatwierdzenia

## Logowanie (Młoda Wataha)

Dwa osobne wejścia, jeden backend auth.

1. **Wejdź do Młodej Watahy** — logowanie USER. Po roli ładuje się wyłącznie shell dziecka.
2. **Panel administratora** — mniejsze, osobne. Po roli ADMIN ładuje się shell dorosłego-admina.

Panel administratora nie jest ekranem startowym dziecka.
Ukrywanie przycisków nie wystarczy — każdy endpoint ADMIN sprawdza rolę po stronie serwera.
Roli ADMIN nie da się samemu nadać przy rejestracji.

## Czego tu nie będzie

- lekcji w Polskiej Watasze
- Nory Młodego Wilka u dorosłego
- dziecięcego UI w `polska-wataha`
- otwartej rejestracji kont ADMIN
- haseł ADMIN w frontendzie
