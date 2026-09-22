# WATAHA OFFLINE NAVIGATION CORE

Ten moduł jest gotowym rdzeniem nawigacji do wykorzystania w Młodej Watasze.

## Co już robi
- wspólne modele punktów, wyników wyszukiwania, tras i manewrów,
- rejestr paczek offline,
- sprawdzanie pokrycia geograficznego,
- lokalny kontrakt wyszukiwania,
- lokalny kontrakt routingu,
- stan aktywnej nawigacji,
- wykrycie zjechania z trasy,
- sygnał do przeliczenia trasy,
- wykrycie dotarcia do celu,
- dystans do celu i następnego manewru.

## Adaptery natywne do podpięcia
1. MapLibre Native: render lokalnego PMTiles.
2. Lokalny indeks SQLite/FTS: adresy i POI.
3. BRouter albo inny lokalny router: implementacja OfflineRoutingProvider.
4. Android LocationManager/Fused Location: implementacja LocationProvider.
5. MapPackDownloader: pobieranie województw w trybie normalnym.

## Format paczki
WATAHA_MAP_PACK_V1:
- manifest.json
- map.pmtiles
- search.db
- routing/
- opcjonalny signature + sha256

## Tryb kryzysowy
Bez pobrań i bez serwera. Nawigacja działa wyłącznie z wcześniej zainstalowanych, zweryfikowanych paczek.

## Młoda Wataha
UI dziecka powinno upraszczać funkcje do dużych akcji: Dom, Rodzic, Szkoła, Punkt pomocy, Moja pozycja. Dokładna pozycja nie jest publikowana publicznie.
