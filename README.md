# FlowBoard
Aplikacja do organizowania pracy i zarządzania zadaniami w formie
tablic. Umożliwia porządkowanie kart w kolumnach, przypisywanie etykiet
i priorytetów oraz współpracę użytkowników.

> **Status:** projekt w trakcie rozwoju.

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

Przykładowe elementy projektu:

```text
.
├── app/             # Strony i endpointy aplikacji Next.js
├── components/      # Komponenty interfejsu
├── lib/             # Wspólne funkcje i konfiguracja
├── prisma/          # Schemat i migracje bazy danych
├── schema/          # Schematy walidacji danych
└── public/          # Pliki statyczne
```
