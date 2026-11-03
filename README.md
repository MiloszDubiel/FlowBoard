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
  
## Tech Stack

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
- NextAuth.js


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

