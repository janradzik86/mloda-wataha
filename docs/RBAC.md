# RBAC — Młoda Wataha i Family Bridge

Ukrycie przycisku nie jest autoryzacją. Każdy chroniony endpoint sprawdza rolę na serwerze.

## Role etapu 1

| Rola | Kto | Gdzie się loguje | Shell |
|---|---|---|---|
| USER | dziecko / młodzież | Wejdź do Młodej Watahy | shell dziecka |
| ADMIN | Wojan / właściciel | Panel administratora | shell admina |

Dorosły w Polskiej Watasze nie dostaje roli ADMIN Młodej Watahy przez samo konto sąsiedzkie.
Relacja rodzic-dziecko to rekord Family Bridge (parent_link), nie rola ADMIN.

## Role późniejsze (rezerwa)

Użytkownik może mieć wiele ról. Uprawnienia są stringami, nie if-ami w JSX.

```
ADMIN
USER
PARENT      # później
CHILD       # doprecyzowanie USER
TEACHER
MODERATOR
```

Na tym etapie interfejs Młodej Watahy dzieli się tylko na ADMIN i USER.

## Model danych

```
user_roles (
  user_id    text not null,
  role       text not null,
  granted_by text,
  created_at timestamptz,
  primary key (user_id, role)
)

role_permissions (
  role       text not null,
  permission text not null
)
```

Nie trzymaj roli w localStorage jako źródła prawdy. Klient może cacheować shell, serwer i tak weryfikuje.

## Nadawanie ADMIN

- Brak otwartej rejestracji ADMIN.
- USER nie może sam sobie nadać ADMIN (parametr, hidden field, role=admin w URL).
- Jedynym kontem, które może otrzymać rolę ADMIN Młodej Watahy, jest konto uwierzytelnione dokładnie adresem: `jan.radzik86@gmail.com`.
- Porównanie wykonuj po bezpiecznej normalizacji wielkości liter i białych znaków, ale NIE akceptuj aliasów z plusem, innych domen, wariantu googlemail.com ani podobnych adresów.
- Sam adres e-mail w żądaniu nie wystarcza. Serwer musi najpierw zweryfikować sesję / tożsamość dostawcy auth, a dopiero potem sprawdzić zweryfikowany e-mail konta.
- Rola ADMIN jest nadawana i egzekwowana wyłącznie po stronie serwera.
- Hasła ADMIN nie wolno wpisywać na sztywno w aplikacji ani w bundle frontendu.
- Brak zgodności dokładnego zweryfikowanego e-maila = brak roli ADMIN i odpowiedź 403 dla endpointów administracyjnych.

## Wymuszanie

Każda funkcja serwerowa:

1. requireUserId() — sesja
2. requireRole(role) albo requirePermission(perm)
3. zapytania scoped do user_id (USER) albo do uprawnienia (ADMIN)

USER nie uzyska endpointów ADMIN przez ręczny /admin, zmianę parametrów, manipulację klientem ani bezpośrednie API. Odpowiedź: 403, bez wycieku danych.

Przykład uprawnień:

```
user.self.read
user.lessons.read
user.wilk.ask
user.requests.create
family.link.use
admin.content.write
admin.knowledge.write
admin.rewards.configure
admin.users.read
admin.bridge.review
```

## Logowanie a rola

Przyciski na starcie to dwa wejścia UX, nie dwa systemy auth.
Po sesji:

- ADMIN → shell admina
- tylko USER → shell dziecka
- brak roli → odmowa, nie gość admina

Nie pokazuj dziecku nieaktywnych funkcji administratora.


## Twarda polityka właściciela ADMIN

Stała polityka projektu:
- OWNER_ADMIN_EMAIL = jan.radzik86@gmail.com
- dokładnie jedno konto właściciela ma ADMIN,
- brak samodzielnego awansu USER -> ADMIN,
- brak admina przez parametr URL, localStorage, frontend, hidden field lub manipulację tokenem,
- backend sprawdza rolę przy każdym chronionym endpointcie,
- frontend może jedynie ukrywać/pokazywać shell, ale nie jest źródłem autoryzacji.

Jeśli w przyszłości potrzebny będzie drugi administrator, wymaga to świadomej zmiany polityki i kodu po stronie serwera. Nie rozszerzaj listy automatycznie.
