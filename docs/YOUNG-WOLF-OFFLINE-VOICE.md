# Młody WILK: głos offline

## Cel

Młody WILK ma mówić naturalnym, młodym głosem bez zależności od chmury.

## Architektura

Docelowy Android adapter:
- sherpa-onnx,
- lokalny TTS,
- polskie modele VITS/Piper,
- pliki modelu zapisane na urządzeniu,
- brak zapytań sieciowych podczas syntezy.

Sherpa-onnx ma oficjalne wsparcie Androida oraz tryb TTS działający lokalnie. Integrację natywną trzeba wykonać dopiero w Android shellu aplikacji.

## Profile głosu

- Młody Wilk: naturalny, lekko szybszy i lżejszy,
- Odkrywca: bardziej energiczny,
- Nauczyciel: wolniejszy i bardzo wyraźny,
- Kryzysowy: krótkie komunikaty, spokojne tempo, bez zabawnego tonu.

pitchHint jest wskazówką dla adaptera. Nie każdy silnik pozwala bezpośrednio zmieniać wysokość tonu. Nie należy sztucznie podnosić pitchu tak mocno, żeby głos brzmiał nienaturalnie.

## Dobór modelu

Nie nazywamy żadnego modelu dziecięcym bez odsłuchu.

Kandydaci są tylko pulą do testów A/B na telefonie. Kryteria wyboru:
1. naturalność po polsku,
2. odbiór jako młodszy / lżejszy głos,
3. zrozumiałość,
4. szybkość generowania na średnim Androidzie,
5. wielkość paczki,
6. stabilność offline.

## Paczki

- jeden głos podstawowy może być dostarczony razem z aplikacją,
- pozostałe jako opcjonalne paczki pobierane wcześniej,
- po pobraniu działają całkowicie offline,
- brak pobranego głosu nie może blokować tekstowego Młodego Wilka,
- systemowy Android TTS może być awaryjnym fallbackiem, nie głównym doświadczeniem.

## Następny krok implementacyjny

Gdy repo dostanie właściwy Android shell:
1. dodać bibliotekę sherpa-onnx,
2. dodać OfflineVoiceManager,
3. mapować modelId na lokalny folder modelu,
4. sprawdzać integralność paczki,
5. wygenerować próbki wszystkich kandydatów,
6. zrobić prosty ekran odsłuchu A/B,
7. wybrać domyślny głos dopiero po teście na urządzeniu.