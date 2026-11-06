# FlowBoard

FlowBoard to aplikacja webowa służąca do organizowania pracy, zarządzania projektami i zadaniami oraz współpracy zespołowej.
Umożliwia tworzenie tablic projektowych, organizowanie zadań w kolumnach, przypisywanie użytkowników, etykiet i priorytetów, a także zarządzanie uczestnikami projektów.

> **Status:** Projekt w trakcie rozwoju.

## Live Demo

[Otwórz aplikację FlowBoard](https://miloszdubielflowboard.vercel.app)

## Podgląd aplikacji 
### Strona główna 

<img width="1906" height="907" alt="image" src="https://github.com/user-attachments/assets/084e187a-cd93-4cf9-98ab-932f810f355b" />
<br />

### Strona z projektmai 

<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/7b647962-be9f-4203-b014-b0112f9b5b08" />
<br />

### Tablica projektowa

<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/530e1bfd-eac4-4646-90c0-124092b388ca" />
<br />
  
## Stos technologiczny 

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui

### Backend
- Next.js API Routes
- Prisma ORM
- Node.js

### Database
- PostgreSQL

### Authentication
- JWT Tokens (HTTP Only cookies)


## Architektura

Aplikacja wykorzystuje architekturę Fullstack
opartą na frameworku Next.js.

- **Frontend:** Komponenty React oraz strony Next.js.
- **Backend:** Endpointy API Next.js obsługujące logikę aplikacji.
- **Baza danych:** PostgreSQL przechowujący dane aplikacji.
- **ORM:** Prisma zarządzająca operacjami na bazie danych.
- **Uwierzytelnianie:** Obsługa uwierzytelniania użytkowników oraz zarządzania sesjami.

Frontend komunikuje się z endpointami backendu,
które przetwarzają żądania i wykonują operacje na bazie danych
za pośrednictwem Prisma ORM.


## Funkcjonalności aplikacji 

Aplikacja FlowBoard jest wyposażona w szereg różnych funkcjonalności. Do nich należą m.in.:

### Uwierzytelnianie
- Rejestracja użytkowników
- Logowanie i wylogowywanie użytkowników
- Resetowanie hasła
- Zarządzanie danymi konta

### Zarządzanie projektami
- Tworzenie i edycja tablic projektowych
- Usuwanie tablic projektowych
- Zarządzanie członkami tablic
- Zapraszanie użytkowników do projektów

### Zarządzanie zadaniami
- Tworzenie, edycja i usuwanie list
- Tworzenie, edycja i usuwanie kart zadań
- Przypisywanie użytkowników do zadań
- Zarządzanie zadaniami

### Zaproszenia
- Wysyłanie zaproszeń do projektów
- Akceptowanie i odrzucanie zaproszeń

### Powiadomienia
- Otrzymywanie powiadomień o aktywności w projektach
- Powiadomienia o otrzymanych zaproszeniach

### Zarządzanie użytkownikami
- Edycja danych konta
- Zarządzanie uczestnikami projektów

## Role i uprawnienia

FlowBoard wykorzystuje system ról i uprawnień, który pozwala kontrolować dostęp użytkowników do tablic oraz zarządzać ich możliwościami

### Dostępne role

- **Owner** – posiada pełną kontrolę nad tablicą, może zarządzać jej ustawieniami, członkami, uprawnieniami oraz zmieniac nazwę tablicy jak i usunąć projekt.
- **Admin** – może zarządzać tablicą, jej zawartością oraz członkami, zgodnie z przyznanymi uprawnieniami.
- **Member** – może korzystać z tablicy i wykonywać operacje związane z zarządzaniem zadaniami w zakresie przyznanych uprawnień.

### Tabela uprawnień

| Uprawnienie | Owner | Admin | Member |
|---|:---:|:---:|:---:|
| Dostęp do tablicy | ✓ | ✓ | ✓ |
| Dostęp do tablicy | ✓ | ✓ | ✓ |
| Dodawanie komentarzy i plików do nich | ✓ | ✓ | ✓ |
| Zarządzanie listami | ✓ | ✓ | X |
| Zarządzanie kartami | ✓ | ✓ | X |
| Zarządzanie członkami | ✓ | ✓ | X |
| Zapraszanie użytkowników | ✓ | ✓ | X |
| Zmiana ról członków | ✓ | ✓ | X |
| Zmiana ustawień tablicy | ✓ | ✓ | X |
| Usuwanie projektu i zmiana nazwy tablicy | ✓ | X | X |

Uprawnienia są weryfikowane po stronie serwera, aby uniemożliwić wykonywanie niedozwolonych operacji przez nieuprawnionych użytkowników.


## Struktura projektu

```text
project/
│
├── actions/
│   └── searchUsers.ts
│
├── app/
│   ├── (auth)/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   │
│   ├── (dashboard)/
│   ├── api/
│   │   ├── auth/
│   │   ├── board/
│   │   ├── card/
│   │   ├── invits/
│   │   ├── list/
│   │   ├── notification/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── tasks/
│   │
│   ├── settings/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/
│   ├── auth/
│   ├── board/
│   ├── modals/
│   ├── project/
│   ├── settings/
│   ├── skeletons/
│   └── ui/
│
├── hooks/
│   ├── use-mobile.ts
│   ├── useNotification.ts
│   └── useUser.ts
│
├── lib/
│   ├── auth/
│   ├── data/
│   └── ratelimits/
│
├── mutations/
│   └── dashboard/
│
├── prisma/
│   └── migrations/
│
├── schema/
│
├── types/
│   ├── project.type.ts
│   └── user.type.ts
│
├── public/
│
├── package.json
├── prisma.config.ts
├── proxy.ts
├── next.config.ts
└── README.md
```
## Architektura

Aplikacja wykorzystuje architekturę Fullstack
opartą na frameworku Next.js.

- **Frontend:** Komponenty React oraz strony Next.js.
- **Backend:** Endpointy API Next.js obsługujące logikę aplikacji.
- **Baza danych:** PostgreSQL przechowujący dane aplikacji.
- **ORM:** Prisma zarządzająca operacjami na bazie danych.
- **Uwierzytelnianie:** Obsługa uwierzytelniania użytkowników oraz zarządzania sesjami.

Frontend komunikuje się z endpointami backendu,
które przetwarzają żądania i wykonują operacje na bazie danych
za pośrednictwem Prisma ORM.


## Instalacja i uruchomienie

### Wymagania

Przed uruchomieniem aplikacji upewnij się, że masz zainstalowane:

- [Node.js](https://nodejs.org/) (zalecana wersja LTS)
- npm
- [Git](https://git-scm.com/)
- Dostęp do bazy danych PostgreSQL

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/TWOJ-LOGIN/FlowBoard.git

cd FlowBoard
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Konfiguracja zmiennych środowiskowych

Utwórz plik `.env` w głównym katalogu projektu.

Uzupełnij go wymaganymi zmiennymi środowiskowymi:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```
### 4. Konfiguracja bazy danych

Wygeneruj klienta Prisma:

```bash
npx prisma generate
```

Uruchom migracje bazy danych:

```bash
npx prisma migrate dev
```

### 5. Uruchomienie aplikacji

Uruchom serwer deweloperski:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem:

http://localhost:3000

## Zmienne środowiskowe

Utwórz plik `.env` w głównym katalogu projektu i uzupełnij go wymaganymi zmiennymi:

| Zmienna | Opis |
|---|---|
| `DATABASE_URL` | Adres URL połączenia z bazą danych |
| `DATABASE_USER` | Nazwa użytkownika bazy danych |
| `DATABASE_HOST` | Adres hosta bazy danych |
| `DATABASE_PASSWORD` | Hasło użytkownika bazy danych |
| `DATABASE_NAME` | Nazwa bazy danych |
| `DATABASE_PORT` | Port, na którym działa baza danych |
| `SUPABASE_URL` | Adres URL projektu Supabase wykorzystywanego do przechowywania plików |
| `SUPABASE_SECRET_KEY` | Tajny klucz API wykorzystywany do autoryzacji operacji w Supabase |
| `JWT_SECRET` | Tajny klucz wykorzystywany do podpisywania i weryfikacji tokenów JWT |
| `NODE_ENV` | Środowisko uruchomieniowe aplikacji (np. `development`, `production`, `test`) |
| `EMAIL_USER` | Adres e-mail konta wykorzystywanego do wysyłania wiadomości |
| `EMAIL_PASSWORD` | Hasło lub klucz dostępu do konta pocztowego |
| `UPSTASH_REDIS_REST_URL` | Adres URL instancji Redis w usłudze Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Token autoryzacyjny umożliwiający dostęp do Redis w usłudze Upstash |
| `IS_DEMO` | Przełącza aplikacje w tryb demonstracyjny |


**Uwaga:**
- SUPABASE_SECRET_KEY – upewnij się, że używasz właściwej nazwy klucza zgodnej z konfiguracją Supabase
- EMAIL_PASSWORD – jest to hasło aplikacji, a nie standardowe hasło do konta
- DATABASE_URL -  może być wystarczające do połączenia z bazą danych, jeśli zawiera już host, użytkownika, hasło, nazwę bazy i port

## Dokumentacja API

API aplikacji FlowBoard zostało zaimplementowane przy użyciu Next.js API Routes. Endpointy odpowiadają za obsługę żądań HTTP, walidację danych wejściowych oraz wykonywanie operacji na bazie danych.

### Authentication

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| POST | `/api/auth/register` | Rejestracja nowego użytkownika | Nie |
| POST | `/api/auth/login` | Logowanie użytkownika | Nie |
| POST | `/api/auth/logout` | Wylogowanie użytkownika | Nie |
| POST | `/api/auth/forgot-password` | Rozpoczęcie procesu resetowania hasła | Nie |
| POST | `/api/auth/reset-password` | Ustawienie nowego hasła | Nie |

### Projects

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| GET | `/api/projects` | Pobieranie projektów użytkownika | Tak |
| POST | `/api/projects` | Tworzenie nowego projektu | Tak |
| PATCH | `/api/projects/:id` | Aktualizacja danych projektu | Tak |
| DELETE | `/api/projects/:id` | Usuwanie projektu | Tak |

### Boards

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| POST | `/api/board/:id` | Zmiana nazwy tablicy | Tak |
| POST | `/api/board/member/:uid/delete` | Usuwanie użytkownika z tablicy | Tak |
| PUT | `/api/board/member/:uid/invite` | Wysyłanie zaproszenia do tablicy | Tak |
| PATCH | `/api/board/member/:uid/role` | Zmiana roli członka tablicy | Tak |

### Lists

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| POST | `/api/list` | Tworzenie nowej listy | Tak |
| PATCH | `/api/list/:listId` | Aktualizacja danych listy | Tak |
| DELETE | `/api/list/:listId` | Usuwanie listy | Tak |
| PATCH | `/api/list/reorder` | Zmiana kolejności list w tablicy | Tak |

### Cards

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| POST | `/api/card/add` | Tworzenie nowej karty | Tak |
| PATCH | `/api/card/:cardId/edit` | Edycja danych karty | Tak |
| DELETE | `/api/card/:cardId/delete` | Usuwanie karty | Tak |
| PATCH | `/api/card/switch` | Przenoszenie kart między listami | Tak |
| PATCH | `/api/card/:cardId/checklist` | Aktualizacja listy kontrolnej karty | Tak |
| POST | `/api/card/:cardId/comment` | Dodawanie komentarza do karty | Tak |
| POST | `/api/card/:cardId/comment/:commentId/file` | Dodawanie załącznika do komentarza | Tak |
| POST | `/api/card/:cardId/file` | Dodawanie plików do istniejącej karty | Tak |
| POST | `/api/card/file` | Dodawanie plików do nowej karty | Tak |

### Invitations

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| POST | `/api/invits/accept` | Akceptowanie zaproszenia | Tak |

### Notifications

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| DELETE | `/api/notification/:id` | Usuwanie powiadomienia | Tak |

### Settings

| Metoda | Endpoint | Opis | Autoryzacja |
|---|---|---|---|
| PATCH | `/api/settings/account` | Zmiana adresu e-mail użytkownika | Tak |
| DELETE | `/api/settings/:userId` | Usuwanie konta użytkownika | Tak |
| PATCH | `/api/settings/profile` | Aktualizacja danych profilu (imię, nazwisko, biografia i avatar) | Tak |
| PATCH | `/api/settings/security` | Zmiana hasła użytkownika | Tak |

## Schemat bazy danych 
<img width="1615" height="815" alt="supabase-schema-xtcthkndmdztgtieboyv" src="https://github.com/user-attachments/assets/b6a707d4-1470-463c-8e9d-95c82558376b" />



