# Młody WILK v0.1

To jest osobny silnik dla aplikacji **Młoda Wataha**.

Nie importować WILKA z Polskiej Watahy.

## Założenia

- dostosowanie języka do wieku i poziomu,
- kilka sposobów tłumaczenia tego samego zagadnienia,
- quiz diagnostyczny po etapie,
- brak ocen 1–6 i procentów na ekranie dziecka,
- nagroda dopiero po realnym opanowaniu tematu,
- możliwość mikro-powtórki konkretnego błędu zamiast cofania całego działu,
- osobny, spokojny tryb kryzysowy,
- głos jako adapter: mikrofon + TTS, z priorytetem dla pracy offline,
- brak otwartego czatu z obcymi dorosłymi,
- brak publicznej dokładnej lokalizacji dziecka.

## Diagnostyka

Silnik wewnętrznie może analizować poprawność, ale UI dziecka ma pokazywać tylko komunikaty typu:

- „Dobra, lecimy dalej.”
- „Jeszcze jeden mały kawałek i będzie.”
- „Pokażę Ci to inaczej.”
- „Wrócimy na chwilę do jednej rzeczy.”

Nie pokazujemy procentów, ocen ani rankingów dzieci.

## Nagrody

Flaga rewardEligible=true oznacza, że temat został opanowany.
UI może wtedy przyznać np. 🍭 Lizak Watahy.
Lizak jest nagrodą za opanowanie tematu, nie za perfekcyjny wynik za pierwszym razem.

## Bezpieczeństwo

Treści kryzysowe nie przechodzą przez zabawne style, misje ani humor.
Fakty kryzysowe i edukacyjne mają pochodzić z zatwierdzonej bazy, a adaptacja ma zmieniać formę, nie fakty.

## Następne kroki

1. Rozszerzyć bazę tematów.
2. Dodać trwały profil uczenia.
3. Dodać generator quizów z ograniczonego banku pytań.
4. Dodać Family Bridge hook do zgód rodzica.
5. Dodać Lizaki/Norę jako osobną warstwę nagród.
6. Podłączyć natywny STT/TTS w aplikacji.