# Task Manager - Aplikacja do Zarządzania Zadaniami

## 1. Wprowadzenie

### Opis projektu
Task Manager to aplikacja webowa do zarządzania zadaniami, łącząca w sobie funkcjonalności kalendarza i tablicy Kanban. Aplikacja pozwala użytkownikom efektywnie organizować swoje zadania zarówno w kontekście czasowym, jak i statusowym.

### Cel aplikacji
Głównym celem aplikacji jest dostarczenie intuicyjnego narzędzia do planowania i śledzenia zadań, które łączy:
- **Widok kalendarzowy** - dla zadań z określonym czasem wykonania
- **Widok Kanban** - dla zadań bez określonego czasu, organizowanych według statusu

### Kluczowe funkcje i możliwości
- ✅ **Dual-view system** - przełączanie między widokiem kalendarza a Kanban
- ✅ **Autentykacja użytkowników** - bezpieczne logowanie i rejestracja z JWT
- ✅ **Zarządzanie zadaniami** - tworzenie, edycja, usuwanie zadań
- ✅ **Priorytety zadań** - LOW, MEDIUM, HIGH z wizualnymi wskaźnikami
- ✅ **Statusy zadań** - TODO, IN_PROGRESS, DONE, FAILED
- ✅ **Walidacja czasowa** - zapobieganie nakładaniu się zadań
- ✅ **Wyszukiwanie i filtrowanie** - po nazwie i kategorii

---

## 2. Wykorzystane technologie

### Backend
- **Node.js** (v18+) - środowisko uruchomieniowe JavaScript
- **NestJS** (v11.0.1) - progresywny framework Node.js
- **TypeScript** (v5.x) - JavaScript
- **TypeORM** (v0.3.28) - ORM do zarządzania bazą danych
- **PostgreSQL** (v15) - relacyjna baza danych
- **JWT** (@nestjs/jwt) - autentykacja tokenowa
- **bcrypt** - hashowanie haseł
- **class-validator** - walidacja DTO
- **Swagger** - dokumentacja API

### Frontend
- **React** (v19.2.0) - biblioteka UI
- **TypeScript** (v5.x) - JavaScript
- **Vite** (v6.0.11) - build tool
- **Material-UI** (v7.3.6) - komponenty UI
- **Axios** - klient HTTP
- **React Router** (v7.5.0) - routing

### DevOps
- **Docker** & **Docker Compose** - konteneryzacja
- **ESLint** - linting kodu
- **Git** - kontrola wersji

---

## 3. Instalacja

### Wymagania wstępne
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** >= 20.10.0
- **Docker Compose** >= 2.0.0
- **Git**

### Klonowanie repozytorium
```bash
git clone https://github.com/Xemuuu/todoapp
cd todoapp
```

### Kroki instalacji

#### 1. Uruchomienie całego stacku (Docker - REKOMENDOWANE)
```bash
# Z głównego katalogu projektu uruchom wszystkie serwisy
docker-compose up -d

# Backend: http://localhost:3000
# Frontend: http://localhost:5173
# PostgreSQL: localhost:5432
```

**Seed bazy danych (tworzy testowe konto):**
```bash
# Wykonaj seed w kontenerze backendu
docker exec todoapp-backend-1 npm run seed

# Testowe konto:
# Email: john@example.com
# Hasło: password123
```

#### 2. Uruchomienie manualne (alternatywnie)

**2.1. Uruchomienie bazy danych (Docker)**
```bash
# Uruchom PostgreSQL w kontenerze
docker-compose up -d db
```

**2.2. Instalacja i uruchomienie backendu**
```bash
cd backend

# Instalacja zależności
npm install

# Seed bazy danych (opcjonalnie - tworzy testowego użytkownika)
npm run seed

# Uruchomienie w trybie development
npm run start:dev
```

Backend będzie dostępny pod adresem: `http://localhost:3000`
Dokumentacja API (Swagger): `http://localhost:3000/api`

**2.3. Instalacja i uruchomienie frontendu**
```bash
cd frontend

# Instalacja zależności
npm install

# Uruchomienie w trybie development
npm run dev
```

Frontend będzie dostępny pod adresem: `http://localhost:5173`

---

## 4. Instrukcje użytkowania

### Pierwsze uruchomienie

#### Logowanie z testowym kontem
- **Email**: `john@example.com`
- **Hasło**: `password123`

#### Rejestracja nowego konta
1. Kliknij zakładkę "Rejestracja"
2. Wprowadź email i hasło (dwukrotnie)
3. Kliknij "Zarejestruj się"

### Główne funkcjonalności

#### 1. Widok Kalendarza
- Wyświetla zadania z określonym czasem w formacie tygodniowym
- **Nawigacja**: Strzałki ← → do przełączania tygodni
- **Edycja**: Kliknięcie na zadanie otwiera dialog edycji

#### 2. Widok Kanban
- Wyświetla zadania bez określonego czasu w 4 kolumnach:
  - 📋 **To Do** - zadania do wykonania
  - 🔄 **In Progress** - zadania w trakcie
  - ✅ **Done** - zadania zakończone
  - ❌ **Failed** - zadania nieudane

#### 3. Tworzenie zadania
1. Kliknij przycisk **+** (prawy dolny róg)
2. Wypełnij formularz:
   - **Tytuł** (wymagany)
   - **Opis** (opcjonalny)
   - **Status**: TODO, IN_PROGRESS, DONE, FAILED
   - **Priorytet**: LOW (🟢), MEDIUM (🟡), HIGH (🔴)
   - **Kategorie** (opcjonalne)
   - **Data/czas rozpoczęcia i zakończenia** (opcjonalne):
     - Jeśli podane → zadanie trafi do kalendarza
     - Jeśli puste → zadanie trafi do Kanban
3. Kliknij "Zapisz"

#### 4. Kategorie
- Kliknij przycisk **+** w sekcji kategorii
- Wybierz nazwę i kolor (16 predefiniowanych kolorów)
- Kategorie są unikalne dla każdego użytkownika

#### 5. Wyszukiwanie i filtrowanie
- **Wyszukiwanie**: Wpisz tekst w pole "Wyszukaj task po nazwie..."
- **Filtr kategorii**: Kliknij chip kategorii aby pokazać tylko te zadania

### Zrzuty ekranu

#### Strona logowania
![Login Page](img/login.png)
*Strona logowania z animowanym tłem i glassmorphism*

#### Widok kalendarza
![Calendar View](img/calendar.png)
*Tygodniowy widok kalendarza z dynamicznymi wysokościami godzin*

#### Widok Kanban
![Kanban View](img/kanban.png)
*Tablica Kanban z 4 kolumnami statusów*

#### Dialog zadania
![Task Dialog](img/task-dialog.png)
*Formularz tworzenia/edycji zadania z glassmorphism*

---

## 5. Kod i konfiguracja

### Repozytorium GitHub
Kod źródłowy dostępny na: [GitHub Repository](https://github.com/Xemuuu/todoapp)

### Konfiguracja środowiska

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=db_todoapp

# API
PORT=3000
API_KEY=your-super-secret-api-key-2026

# JWT
JWT_SECRET=your-jwt-secret-key-2026
JWT_EXPIRES_IN=7d
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-super-secret-api-key-2026
```

#### Docker Compose (domyślna konfiguracja)
```yaml
services:
  db:
    image: postgres:15-alpine
    container_name: todoapp-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: db_todoapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## 6. Funkcje

### 1. System autentykacji (JWT)
- **Rejestracja** - hashowanie haseł z bcrypt (salt rounds: 10)
- **Logowanie** - generowanie JWT tokena z 7-dniową ważnością
- **Persistent session** - token przechowywany w localStorage
- **Auto-logout** - przekierowanie na login przy 401 Unauthorized
- **Protected routes** - guard na endpointach wymagających autentykacji

### 2. Dual-view system (Unikalna funkcjonalność)
**Automatyczny routing zadań**:
- Zadania **z czasem** (`startDateTime` && `endDateTime`) → Widok kalendarza
- Zadania **bez czasu** (`null` datetime) → Widok Kanban

**Przełączanie widoków**:
- Przycisk toggle z animacją
- Filtrowanie po stronie frontendu w `TasksPage.tsx`

### 3. REST API - Dostępne endpointy

Aplikacja udostępnia pełne REST API z dokumentacją Swagger dostępną pod adresem: `http://localhost:3000/api/docs`

**Autentykacja:**
- `POST /auth/register` - Rejestracja nowego użytkownika (email, password)
- `POST /auth/login` - Logowanie (zwraca JWT token i dane użytkownika)

**Zadania (Tasks):**
- `GET /tasks` - Pobierz wszystkie zadania użytkownika (filtrowanie: status, categoryId, paginacja)
- `POST /tasks` - Utwórz nowe zadanie (title, description, status, priority, startDateTime, endDateTime, categoryIds)
- `GET /tasks/:id` - Pobierz szczegóły pojedynczego zadania
- `PATCH /tasks/:id` - Zaktualizuj zadanie (wszystkie pola opcjonalne)
- `DELETE /tasks/:id` - Usuń zadanie

**Kategorie (Categories):**
- `GET /categories` - Pobierz wszystkie kategorie użytkownika
- `POST /categories` - Utwórz nową kategorię (name, color)

**Zabezpieczenia:**
- Wszystkie endpointy (oprócz `/auth/*`) wymagają:
  - Header `X-API-KEY` - klucz API z pliku `.env`
  - Header `Authorization: Bearer <token>` - JWT token (po zalogowaniu)
- Każdy request automatycznie scope'owany do zalogowanego użytkownika (`userId`)
- Walidacja danych wejściowych przez `class-validator` (DTO)

**Format odpowiedzi:**
Wszystkie response'y są owinięte w standardowy format przez `TransformInterceptor`:
```json
{
  "success": true,
  "data": { /* właściwa odpowiedź */ },
  "timestamp": "2026-01-20T12:00:00.000Z",
  "path": "/tasks"
}
```

**Obsługa błędów:**
- `400 Bad Request` - błąd walidacji (np. nieprawidłowy email)
- `401 Unauthorized` - brak lub nieprawidłowy token JWT
- `404 Not Found` - zasób nie istnieje
- `409 Conflict` - konflikt (np. email już istnieje przy rejestracji)

---

## 7. Struktura kodu

### Model danych - Schemat bazy danych

#### ER Diagram
```
┌─────────────┐         ┌──────────────┐                    ┌─────────────┐
│    User     │         │     Task     │                    │  Category   │
├─────────────┤         ├──────────────┤                    ├─────────────┤
│ id (PK)     │────────<│ userId (FK)  │                    │ id (PK)     │
│ email       │    1:N  │ id (PK)      │                    │ name        │
│ password    │         │ title        │                    │ color       │
│ created_at  │         │ description  │                    │ userId (FK) │
│ updated_at  │         │ status       │                    │             │
└─────────────┘         │ priority     │                    └─────────────┘
                        │ startDateTime│                         ▲
                        │ endDateTime  │                         │
                        │ created_at   │                         │
                        │ updated_at   │                         │
                        └──────────────┘                         │
                               │                                 │
                               │        ┌──────────────────┐     │
                               │        │ task_categories  │     │
                               │        │ (junction table) │     │
                               │        ├──────────────────┤     │
                               └───────>│ task_id (FK, PK) │     │
                                  N:M   │ category_id (FK) │<────┘
                                        └──────────────────┘
```

#### Tabela: users
| Kolumna    | Typ         | Opis                           |
|------------|-------------|--------------------------------|
| id         | SERIAL PK   | Unikalny identyfikator         |
| email      | VARCHAR     | Email użytkownika (unique)     |
| password   | VARCHAR     | Hashowane hasło (bcrypt)       |
| created_at | TIMESTAMP   | Data utworzenia konta          |
| updated_at | TIMESTAMP   | Data ostatniej aktualizacji    |

#### Tabela: tasks
| Kolumna        | Typ                | Opis                                    |
|----------------|--------------------|-----------------------------------------|
| id             | SERIAL PK          | Unikalny identyfikator                  |
| title          | VARCHAR            | Tytuł zadania                           |
| description    | TEXT               | Szczegółowy opis (nullable)             |
| status         | ENUM               | TODO, IN_PROGRESS, DONE, FAILED         |
| priority       | ENUM               | LOW, MEDIUM, HIGH                       |
| start_date_time| TIMESTAMP          | Początek zadania (nullable)             |
| end_date_time  | TIMESTAMP          | Koniec zadania (nullable)               |
| user_id        | INTEGER FK         | Referencja do users.id                  |
| created_at     | TIMESTAMP          | Data utworzenia                         |
| updated_at     | TIMESTAMP          | Data ostatniej modyfikacji              |

**Uwaga**: `start_date_time` i `end_date_time` są nullable - gdy NULL, task trafia do widoku Kanban.

#### Tabela: categories
| Kolumna    | Typ         | Opis                           |
|------------|-------------|--------------------------------|
| id         | SERIAL PK   | Unikalny identyfikator         |
| name       | VARCHAR     | Nazwa kategorii                |
| color      | VARCHAR(7)  | Kolor w formacie HEX (#FF5733) |
| user_id    | INTEGER FK  | Referencja do users.id         |

#### Tabela: task_categories (Many-to-Many)
| Kolumna     | Typ         | Opis                    |
|-------------|-------------|-------------------------|
| task_id     | INTEGER FK  | Referencja do tasks.id  |
| category_id | INTEGER FK  | Referencja do categories.id |

**Constraint**: Composite Primary Key (task_id, category_id)

### Struktura projektu

```
todoapp/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Moduł autentykacji
│   │   │   ├── auth.controller.ts    # Endpointy login/register
│   │   │   ├── auth.service.ts       # Logika JWT
│   │   │   └── jwt.strategy.ts       # Strategia Passport JWT
│   │   │
│   │   ├── categories/        # Moduł kategorii
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── entities/
│   │   │   │   └── category.entity.ts   # Entity TypeORM
│   │   │   └── dto/
│   │   │       └── create-category.dto.ts
│   │   │
│   │   ├── tasks/             # Moduł zadań
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── entities/
│   │   │   │   └── task.entity.ts       # Entity z relacjami
│   │   │   └── dto/
│   │   │       ├── create-task.dto.ts
│   │   │       └── update-task.dto.ts
│   │   │
│   │   ├── users/             # Moduł użytkowników
│   │   │   ├── users.service.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── common/            # Współdzielone elementy
│   │   │   ├── guards/
│   │   │   │   └── api-key.guard.ts     # Guard API Key
│   │   │   └── interceptors/
│   │   │       └── transform.interceptor.ts  # Response wrapper
│   │   │
│   │   ├── app.module.ts      # Główny moduł aplikacji
│   │   ├── main.ts            # Entry point
│   │   └── seed.ts            # Seeding bazy danych
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Komponenty React
│   │   │   ├── WeekView.tsx           # Widok kalendarza
│   │   │   ├── KanbanView.tsx         # Widok Kanban
│   │   │   ├── TaskDialog.tsx         # Dialog zadania
│   │   │   ├── CategoryDialog.tsx     # Dialog kategorii
│   │   │   ├── CategoryFilter.tsx     # Filtry kategorii
│   │   │   ├── SearchBar.tsx          # Wyszukiwarka
│   │   │   └── TopBar.tsx             # Górny pasek nawigacji
│   │   │
│   │   ├── pages/             # Strony aplikacji
│   │   │   ├── LoginPage.tsx          # Strona logowania
│   │   │   └── TasksPage.tsx          # Główna strona z taskami
│   │   │
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.tsx        # Kontekst autentykacji
│   │   │
│   │   ├── services/          # Serwisy API
│   │   │   ├── authService.ts
│   │   │   ├── tasksService.ts
│   │   │   └── categoriesService.ts
│   │   │
│   │   ├── config/
│   │   │   └── api.ts                 # Konfiguracja Axios
│   │   │
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript types
│   │   │
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml         # Docker configuration
└── README.md                  # Ten plik
```

### Główne elementy kodu

#### 1. Backend - Task Entity (Model)

**Lokalizacja**: `backend/src/tasks/entities/task.entity.ts`

Entity Task definiuje model zadania w bazie danych wykorzystując dekoratory TypeORM. Kluczowe aspekty:
- Pola `startDateTime` i `endDateTime` są opcjonalne (`nullable: true`) - umożliwia to dual-view system
- Enumy `TaskStatus` (TODO, IN_PROGRESS, DONE, FAILED) i `TaskPriority` (LOW, MEDIUM, HIGH) zapewniają type safety
- Relacja Many-to-One z User - każdy task należy do użytkownika
- Relacja Many-to-Many z Category - task może mieć wiele kategorii, kategoria wiele tasków
- Automatyczne timestampy (`createdAt`, `updatedAt`) dzięki dekoratorom TypeORM

#### 2. Backend - Tasks Service (Business Logic)

**Lokalizacja**: `backend/src/tasks/tasks.service.ts`

Serwis Tasks zawiera logikę biznesową aplikacji:
- **Dependency Injection** - repositories wstrzykiwane przez konstruktor (NestJS pattern)
- **Metoda create()** - tworzy task i automatycznie obsługuje relacjeMany-to-Many z kategoriami
- **Metoda findAll()** - QueryBuilder TypeORM do zaawansowanych zapytań z JOIN, filtrowaniem i paginacją
- **Metoda update()** - aktualizuje zarówno pola taska jak i przypisane kategorie
- Wszystkie operacje są scope'owane do aktualnego użytkownika (userId)

#### 3. Frontend - WeekView Component (Widok)

**Lokalizacja**: `frontend/src/components/WeekView.tsx`

Komponent WeekView wyświetla tygodniowy widok kalendarza z zaawansowanymi funkcjami:
- **Funkcja parseLocalDate()** - rozwiązuje problem timezone (backend zwraca UTC, frontend wyświetla lokalny czas)
- **Dynamiczne wysokości godzin** - godziny z taskami mają 130px, puste godziny 50px (optymalizacja przestrzeni)
- **Funkcja getTaskStyle()** - oblicza pozycję i wysokość taska na podstawie czasu rozpoczęcia/zakończenia, uwzględniając zmienne wysokości godzin
- **Absolutne pozycjonowanie** - taski są nakładane na siatkę godzin używając position: absolute
- **Conditional rendering** - krótkie taski (≤30 min) mają kompaktowy widok, długie pokazują pełne informacje
- **Glassmorphism UI** - półprzezroczyste tła z backdrop-filter: blur()

#### 4. Frontend - TasksPage (Controller)

**Lokalizacja**: `frontend/src/pages/TasksPage.tsx`

Główny komponent-kontroler aplikacji:
- **Container Component** - zarządza całym stanem aplikacji (tasks, categories, filters, dialogs)
- **Dual-view logic** - filtruje taski: z czasem → Calendar, bez czasu → Kanban
- **Wyszukiwanie i filtrowanie** - po nazwie taska i kategorii
- **Week navigation** - oblicza początek tygodnia (poniedziałek) i umożliwia nawigację
- **Conditional rendering** - dynamicznie przełącza między WeekView a KanbanView
- **Lifting State Up** - dialogi (TaskDialog, CategoryDialog) są zarządzane centralnie i przekazują callbacks

---

## 8. Wdrożenie


Przy wdrożeniu należy pamiętać o:
- Ustawieniu zmiennych środowiskowych (JWT_SECRET, API_KEY, DATABASE_URL)
- Wyłączeniu `synchronize: true` w TypeORM dla produkcji
- Konfiguracji CORS dla właściwej domeny
- Włączeniu SSL/HTTPS

---

## Autor

**Dawid Kowalczuk** 

