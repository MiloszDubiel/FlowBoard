# FlowBoard
Aplikacja do organizowania pracy i zarządzania zadaniami w formie
tablic. Umożliwia porządkowanie kart w kolumnach, przypisywanie etykiet
i priorytetów oraz współpracę użytkowników.

> **Status:** projekt w trakcie rozwoju.

## Funkcjonalności

- Tworzenie i zarządzanie tablicami.
- Organizowanie zadań w kolumnach i kartach.
- Dodawanie tytułu oraz opisu karty.
- Ustawianie priorytetu i terminu wykonania zadania.
- Przypisywanie użytkowników do kart.
- Tworzenie etykiet z własną nazwą i kolorem oraz przypisywanie ich do
  kart.
- Zarządzanie kartami i ich danymi.
- Uwierzytelnianie użytkowników i dostęp do funkcji zależnie od
  uprawnień 
  
## Technologie

- **Next.js** 
- **React** 
- **TypeScript** 
- **Prisma ORM** 
- **Tailwind CSS** 
- **Zod** 
- **React Form Hook**


## Wymagania

Przed uruchomieniem przygotuj:

- Node.js w wersji zgodnej z projektem.
- Menedżer pakietów, np. npm.
- Bazę danych obsługiwaną przez konfigurację Prisma.

## Instalacja i uruchomienie

1.  Sklonuj repozytorium:

    ```bash
    git clone https://github.com/MiloszDubiel/FlowBoard
    cd flowboard
    ```

2.  Zainstaluj zależności:

    ```bash
    npm install
    ```

3.  Utwórz plik `.env` na podstawie `.env.example`
    i uzupełnij wymagane zmienne środowiskowe, w tym połączenie z bazą
    danych.

4.  Wygeneruj klienta Prisma i zastosuj migracje:

    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  Uruchom serwer developerski:

    ```bash
    npm run dev
    ```

6.  Otwórz <http://localhost:3000> w przeglądarce.


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
