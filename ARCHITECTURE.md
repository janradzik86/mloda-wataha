# Architektura Młodej Watahy

Ostatnia aktualizacja: 2026-09-21.

## 0. Twarde granice

POLSKA WATAHA nie jest MŁODĄ WATAHĄ.

Dwie aplikacje. Jeden ekosystem. Wspólny most backendowy.

1. Nie łącz ich w jedną aplikację.
2. Nie dodawaj Młodej Watahy jako modułu, zakładki ani trybu do Polskiej Watahy.
3. Nie przebudowuj Polskiej Watahy w aplikację dla dzieci.
4. Nie twórz dwóch frontendów w jednym projekcie.
5. Jeśli funkcja nie ma pewnego właściciela — nie implementuj. Najpierw dopisz ją do docs/FEATURE-MAP.md.

Wspólne usługi (auth, Family Bridge, powiadomienia, relacja rodzic-dziecko) nie oznaczają wspólnego UI.

## 1. Trzy interfejsy, jedna warstwa API

```
[MLODA WATAHA]
   USER shell  = dziecko korzysta z Mlodej Watahy
   ADMIN shell = Wojan zarzadza systemem edukacyjnym
        |
        | Family Bridge API
        |
[POLSKA WATAHA]
   dorosly / rodzic / opiekun
        |
        | zatwierdzone zgloszenia
        |
[WOJAN STUDIO]
   tworca: muzyka, live, produkcja utworow
```

| Warstwa | Co to jest | Czego to nie jest |
|---|---|---|
| Mloda Wataha | nowa aplikacja, osobne repo, osobny frontend | zakladka w Polskiej Watasze |
| Polska Wataha | istniejaca aplikacja doroslego | szkola, Nora, quizy dziecka |
| Wojan Studio | panel tworcy | Family Bridge, aplikacja dziecka |
| Family Bridge | backend / API | trzecia aplikacja uzytkownika |

Wojan Studio zostaje osobno. Nie wklejaj narzedzi studia do shella dziecka.
Panel ADMIN Mlodej Watahy dotyczy tresci edukacyjnych, nagrod i Mlodego WILKA — nie playera live.

## 2. Repozytoria

| Aplikacja | Repo | Stan |
|---|---|---|
| Polska Wataha | janradzik86/polska-wataha | istnieje, dorosly produkt |
| Mloda Wataha | janradzik86/mloda-wataha | to repo, na razie architektura |
| Wojan Studio / live | janradzik86/wojan-stream | istnieje, zrodlo live |
| Family Bridge | kontrakt API przy backendzie Mlodej Watahy | nie osobna aplikacja UI |

Mloda Wataha ma wlasny frontend, nawigacje, logowanie USER/ADMIN, system edukacyjny i Mlodego WILKA (osobny silnik niz WILK dorosly).

## 3. Dwa shelle w Mlodej Watasze

Wspolny backend uwierzytelniania. Po zalogowaniu serwer zwraca role. Klient laduje jeden shell.

Ekran startowy:

- glowne: Wejdz do Mlodej Watahy — logowanie USER
- mniejsze, osobne: Panel administratora

Panel administratora nie jest domyslnym ekranem dziecka.

### USER

Haslo produktu: korzystam z Mlodej Watahy.

Widzi tylko swoje funkcje: Mlody WILK, Nauka, lekcje, quizy, powtorki, Nora, Lizaki, nagrody, profil, sparowanego rodzica, swoje zgloszenia, tryb kryzysowy, SOS, swoje materialy.

W shellu USER nie istnieja: panel admina, baza wiedzy, konfiguracja systemu, dane innych osob, kolejki cudzych zgloszen, ustawienia globalne, statystyki admina, narzedzia Wojan Studio, przyciski z klodka ADMIN.

### ADMIN

Haslo produktu: zarzadzam systemem. Konto Wojana. Interfejs dla doroslego.

ADMIN jest zarezerwowany wyłącznie dla zweryfikowanego konta `jan.radzik86@gmail.com`. Autoryzacja jest wymuszana po stronie serwera; sam przycisk, ścieżka `/admin` ani dane przesłane przez klienta nie mogą nadać roli.

Zakres: tresci edukacyjne, etapy, przedmioty, poziomy/klasy, quizy, nagrody, Lizaki, katalog Nory, koszty nagrod, zgloszenia specjalne i piosenek, statusy produkcji (podglad), materialy do rodzica, zatwierdzone zgloszenia Family Bridge, konfiguracja Mlodego WILKA, baza wiedzy, sync, powiadomienia systemowe, ustawienia, uzytkownicy w zakresie admin, podglad systemu.

ADMIN moze wlaczac i wylaczac elementy sterowane z backendu bez nowej wersji aplikacji.

Rola wygrywa z przyciskiem wejscia:

- USER zawsze dostaje shell dziecka; reczne /admin to 403 bez UI admina
- ADMIN zawsze dostaje shell admina, nie UI dziecka

## 4. Co wolno dodac pozniej do Polskiej Watahy

Wylacznie funkcje rodzica/opiekuna, w istniejacym doroslym UI:

- Dodaj Mlodego Wilka
- kod parowania
- lista powiazanych dzieci
- zgody
- zatwierdzanie prosb
- odbior materialow
- zatwierdzanie przekazania nagrody / utworu

Nie dodawac tam lekcji, quizow dziecka, Nory, dzieciecego UI, Mlodego WILKA.

Te rzeczy wchodza do repo polska-wataha dopiero po dzialajacym Family Bridge — nie w tym frontendzie, nie teraz.

## 5. WILK to nie Mlody WILK

| Silnik | Aplikacja | Baza wiedzy |
|---|---|---|
| WILK | Polska Wataha | pakiet dorosly / kryzys / LoRa |
| Mlody WILK | Mloda Wataha | pakiet edukacyjny dziecka |

Nie wspoldziel silnika ani promptow. Zlacze moze byc podobne (ask, feedback, explainDifferently), implementacja osobna.

## 6. Kryzys

- Polska Wataha: panel dorosly (mesh, LoRa, 112, status watahy)
- Mloda Wataha: uproszczony tryb dziecka + powiadomienie sparowanego rodzica przez Family Bridge

Nie kopiuj panelu doroslego do dziecka.

## 7. Kolejnosc budowy

Ten projekt buduje sie poza polska-wataha.

1. Szkielet aplikacji dziecka (osobny frontend)
2. Auth + RBAC ADMIN / USER, bez rejestracji ADMIN
3. Shell USER: start, profil, parowanie z rodzicem
4. Mlody WILK — zlacze + stub, baza wiedzy osobno
5. Nauka / lekcje / quizy / Nora / Lizaki
6. Shell ADMIN
7. Family Bridge API
8. W Polskiej Watasze: cienki modul rodzica (dorosly UI)
9. Wojan Studio przyjmuje tylko zatwierdzone zgloszenia

Nie zaczynaj punktu 8 zanim 7 nie ma kontraktu. Nie zaczynaj punktu 5 jako zakladki w Polskiej Watasze.

Ten commit nie dodaje ekranow.
