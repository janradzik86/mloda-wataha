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

## Tryb „Nie zrozumiałem w szkole”

Młody WILK potrafi przyjąć naturalne zdanie dziecka, np.:

„Dzisiaj mieliśmy ułamki i nie zrozumiałam.”

Silnik:
1. rozpoznaje, że chodzi o pomoc po lekcji,
2. próbuje rozpoznać przedmiot i temat,
3. dobiera wyjaśnienie do wieku,
4. tłumaczy inaczej niż na lekcji,
5. daje jedno małe ćwiczenie,
6. jeśli temat jest nieznany, nie zgaduje, tylko prosi o nazwę tematu, przykład zadania lub zdanie z lekcji.

Docelowo ten tryb będzie przyjmował też zdjęcie zadania/strony zeszytu po stronie aplikacji, ale rdzeń nie udaje rozpoznania obrazu, dopóki taka funkcja nie zostanie faktycznie podłączona.


## Start rozmowy

Po uruchomieniu Młody WILK zaczyna od krótkiego check-inu:

„Czy było dziś w szkole coś, czego nie zrozumiałeś albo co chcesz ze mną przeanalizować?”

Dziecko może od razu przejść do pomocy szkolnej, zwykłego pytania, powtórki albo budowania gry.

## Tworzenie gier i nauka kodowania

Młody WILK potrafi zamienić naturalny opis dziecka na bezpieczny, lokalny blueprint gry.

Nie generuje i nie uruchamia dowolnego kodu. Korzysta z ograniczonych klocków i reguł typu:

JEŚLI zdarzenie → TO reakcja

Dzięki temu może jednocześnie tworzyć proste gry offline i tłumaczyć dziecku podstawy programowania.


## Nauka w trybie kryzysowym

Plan nauki zostaje aktywny, ale korzysta z realnego kontekstu:
- matematyka: liczenie i prognoza zapasów na podstawie wartości podanych przez dorosłego,
- język polski: prowadzenie dziennika zapasów i zdarzeń,
- planowanie: zauważanie brakujących danych i ustalanie, co należy sprawdzić ponownie.

Młody WILK uczy analizy i przewidywania, ale nie przerzuca na dziecko odpowiedzialności za decyzje dorosłego. Woda, leki, ewakuacja i inne decyzje wysokiego ryzyka pozostają pod kontrolą dorosłego / oficjalnych zaleceń.


## Elastyczne myślenie kryzysowe

Młody WILK uczy zmiany sposobu rozwiązania problemu, gdy rozwiązanie siłowe lub oczywiste jest ryzykowne.

Preferuje:
- niski poziom ryzyka,
- rozwiązania odwracalne,
- ograniczenie bezpośredniego kontaktu,
- zmianę warunków problemu,
- włączenie dorosłego przy zagrożeniu.

Przy dzikich zwierzętach nie uczy oswajania, chwytania ani karmienia z ręki. Uczy zabezpieczania zapasów, obserwacji wejścia, działania za dnia i proszenia dorosłego/specjalisty o pomoc.


### Efekt kontra koszt

W kryzysie Młody WILK porównuje nie tylko ryzyko, ale także koszt energii, czasu i szkód ubocznych. Ma odrzucać działania, które mogą zużyć dużo zasobów, narobić bałaganu lub uszkodzeń i nadal mieć małą szansę powodzenia.


## Logiczne myślenie w trybie normalnym

Młody WILK ćwiczy logikę także poza trybem kryzysowym. Krótkie scenki uczą przewidywania skutków, porównywania opcji, planowania kolejności działań i oszczędzania czasu oraz zasobów.

Nie pokazujemy ocen. Po wyborze Młody WILK pokazuje konsekwencje decyzji i pyta o inne możliwe rozwiązanie.


## Myślenie ochronne w internecie

Młody WILK uczy dziecko rozpoznawania ryzykownych kontaktów online. Scenki pokazują m.in. prośby o sekret przed rodzicem, prywatne zdjęcia, dokładną lokalizację, hasła, kody logowania i spotkania z osobą poznaną w sieci.

Reakcja jest prosta: zatrzymaj rozmowę, nie podawaj danych, pokaż ją zaufanemu dorosłemu, a w razie potrzeby zablokuj lub zgłoś konto.
