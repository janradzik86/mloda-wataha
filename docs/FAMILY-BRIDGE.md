# Family Bridge — warstwa backendowa

Family Bridge nie jest trzecią aplikacją. Nie ma home screenu.

```
Mloda Wataha  <->  Family Bridge API  <->  Polska Wataha
                                              |
                                    zatwierdzone zgloszenia
                                              |
                                         Wojan Studio
```

## Zasady

- Wspólne: auth, relacja rodzic-dziecko, zgody, kolejki, powiadomienia, backend nagród w zakresie mostu, sync.
- Osobne: wszystkie UI.
- Zgłoszenie dziecka nie idzie do Wojan Studio, dopóki rodzic w Polskiej Watasze go nie zatwierdzi.
- ADMIN Młodej Watahy widzi zatwierdzone zgłoszenia; nie zastępuje zgody rodzica.

## Encje

```
parent_link (
  id, parent_user_id, child_user_id,
  status,          -- pending_code | pending_consent | active | revoked
  pairing_code,    -- krotkozyjacy, hash w bazie
  created_at, activated_at, revoked_at
)

parent_consent (
  id, link_id, kind, granted, granted_at
)

bridge_request (
  id, child_user_id, parent_user_id,
  kind,            -- song | reward | special | material
  payload_json,
  status,          -- draft | pending_parent | parent_denied | parent_approved
                   -- | queued_studio | in_production | delivered | closed
  created_at, updated_at
)

bridge_notification (
  id, audience,    -- parent | child | admin
  user_id, title, body, href, read, created_at
)
```

Kody parowania: hash w bazie, TTL, jednorazowe uzycie, rate-limit.

## Przeplyw parowania

1. Rodzic w Polskiej Watasze: Dodaj Mlodego Wilka -> kod (i ewentualnie QR).
2. Dziecko w Mlodej Watasze wpisuje kod.
3. Bridge tworzy parent_link w pending_consent.
4. Rodzic potwierdza zgode.
5. Status active. Dziecko widzi opiekuna. Rodzic widzi dziecko na liscie.

Obie strony moga odwolac (revoked).

## Przeplyw zgloszenia (np. piosenka)

1. USER (dziecko) tworzy zgloszenie we wlasnym UI.
2. Status pending_parent. Powiadomienie tylko do sparowanego rodzica.
3. Rodzic w Polskiej Watasze zatwierdza albo odrzuca.
4. Po akceptacji: parent_approved. Jesli dotyczy utworu — kolejka do Wojan Studio.
5. Studio nie widzi szkicow dziecka ani odrzuconych prosb.
6. Statusy produkcji wracaja mostem: dziecko i rodzic widza wlasny, ograniczony widok.

## Endpointy (kontrakt)

Wszystkie wymagaja sesji. Zadne nie ufa user_id z body.

| Endpoint | Kto | Uwagi |
|---|---|---|
| POST /bridge/pairing/create | rodzic (Polska Wataha) | zwraca kod, nie loguje dziecka |
| POST /bridge/pairing/claim | USER (dziecko) | nie zwraca danych innych dzieci |
| POST /bridge/pairing/consent | rodzic | tylko wlasne linki |
| GET /bridge/children | rodzic | tylko swoje |
| GET /bridge/parent | USER | tylko swoj link |
| POST /bridge/requests | USER | tylko swoje |
| GET /bridge/requests | rodzic albo USER | scoped |
| POST /bridge/requests/:id/parent-decision | rodzic | |
| GET /bridge/admin/requests | ADMIN | po zgodzie rodzica / ops |
| POST /bridge/studio/queue | system po parent_approved | nie z klienta dziecka |

USER dostaje 403 na /bridge/admin/* i na decyzjach rodzica. Reczny URL tego nie omija.

## Powiadomienia

- dziecko: status wlasnej prosby, wiadomosc od rodzica, alert kryzysowy od opiekuna
- rodzic: nowa prosba, SOS dziecka, material do odbioru
- ADMIN: kolejka zatwierdzonych, bledy sync

Nie mieszaj skrzynek. Rodzic nie dostaje listy wszystkich dzieci w systemie.

## Nagrody (Lizaki)

Saldo i katalog Nory zyja w Mlodej Watasze.
Przekazanie nagrody / utworu na zewnatrz (rodzic, studio) idzie mostem i wymaga zgody rodzica gdy dotyczy swiata poza aplikacja dziecka.


## Alert bezpieczeństwa online

Młody WILK może ocenić sytuację opisaną mu przez dziecko. Nie skanuje potajemnie wszystkich prywatnych rozmów.

Jeśli opis zawiera wysokie ryzyko, np.:
- prośbę o sekret przed rodzicem,
- prywatne zdjęcia,
- adres / szkołę / lokalizację,
- propozycję spotkania,
- hasło lub kod logowania,
- presję, groźby lub treść seksualną,

może utworzyć przez Family Bridge alert do sparowanego rodzica:

kind = online_safety

Powiadomienie rodzica ma zawierać:
- poziom pilności,
- ogólny opis,
- wykryte sygnały ostrzegawcze.

Domyślnie NIE przesyłamy pełnej treści prywatnej rozmowy dziecka. Surowa wiadomość może być udostępniona tylko przez jawne działanie dziecka / opiekuna w osobno zaprojektowanym przepływie.

Dla ryzyka unclear Młody WILK zachęca dziecko do pokazania sytuacji rodzicowi, ale nie wysyła automatycznego alarmu.
Dla high / urgent tworzy alert bezpieczeństwa, jeśli istnieje aktywny parent_link.


## Lokalizacja dziecka dla sparowanego rodzica

Family Bridge może przenosić bieżącą lokalizację dziecka do aplikacji Polska Wataha, ale tylko dla aktywnego parent_link.

Nowe encje:

```
child_location_consent (
  child_user_id,
  parent_user_id,
  enabled,
  mode,               -- off | while_app_open | background
  share_exact_location,
  retention_hours,
  updated_at
)

child_location_fix (
  child_user_id,
  lat,
  lon,
  accuracy_m,
  recorded_at,
  source
)
```

Endpointy:

- POST /bridge/location/consent
- POST /bridge/location/update
- GET /bridge/children/:id/location
- DELETE /bridge/location/history

Zasady bezpieczeństwa:
- tylko sparowany rodzic/opiekun,
- backend sprawdza parent_link, nie ufa child_user_id z klienta,
- dziecko widzi wyraźny status „Udostępniasz lokalizację rodzicowi”,
- brak publicznej lokalizacji,
- brak lokalizacji dla ADMIN tylko dlatego, że jest ADMIN,
- śledzenie w tle wymaga osobnego uprawnienia systemowego,
- retencja historii ma być krótka i konfigurowalna,
- po wyłączeniu udostępniania nowe pozycje nie są wysyłane,
- SOS może wysłać bieżącą pozycję zgodnie z trybem kryzysowym.

W Polskiej Watasze rodzic widzi:
- bieżącą pozycję na mapie,
- czas ostatniej aktualizacji,
- dokładność,
- status „aktualna / nieaktualna”.

Nie budujemy ukrytego śledzenia. Funkcja ma być jawna po stronie dziecka i ograniczona do zatwierdzonej relacji rodzic-dziecko.


## SOS: zabezpieczenie dźwięku otoczenia

Po świadomym naciśnięciu przez dziecko przycisku „POTRZEBUJĘ POMOCY” aplikacja może uruchomić Emergency Evidence Capture.

Zakres MVP:
- nagrywanie wyłącznie po SOS,
- wyraźny wskaźnik aktywnego mikrofonu,
- brak stałego podsłuchu i brak ukrytego nagrywania przed SOS,
- limit czasu nagrania,
- lokalne szyfrowanie,
- SHA-256 po zakończeniu pliku,
- zapis czasu,
- opcjonalnie zapis pozycji GPS i dokładności,
- upload tylko do aktywnie sparowanego rodzica/opiekuna,
- brak publicznego dostępu,
- brak automatycznego wysyłania pliku do policji lub innych służb.

Nowe endpointy kontraktowe:
- POST /bridge/emergency-evidence/start
- POST /bridge/emergency-evidence/:id/complete
- POST /bridge/emergency-evidence/:id/upload
- GET /bridge/children/:id/emergency-evidence
- DELETE /bridge/emergency-evidence/:id

Backend musi weryfikować parent_link i ownership. Sam ADMIN nie otrzymuje dostępu do nagrań dziecka.

Rodzic w Polskiej Watasze widzi zdarzenie:
„SOS dziecka · dostępny zapis dźwięku”
oraz czas, pozycję i integralność pliku.
