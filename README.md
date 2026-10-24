# Smart Expense Tracker
[![CI](https://github.com/ZinMarMyint-zmm/expense-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/ZinMarMyint-zmm/expense-tracker/actions/workflows/ci.yml)

A full-stack personal finance and expense tracking application built with **Next.js App Router**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## Features

### Authentication & Authorization

- User registration and login
- Database-backed session authentication
- HTTP-only session cookies
- Role-based authorization
- Admin-only category management
- Protected API routes

### Transaction Management

- Create, update, and delete transactions
- Income and expense tracking
- Category-based transactions
- Date-range filtering
- Paginated transaction list
- Search and transaction filtering
- Soft-deleted category support
- Original transaction currency stored in the database

### Multi-Currency Support

- Support for USD, MMK, THB, and JPY
- Global currency selection through the dashboard Navbar
- Currency preference managed with Redux Toolkit
- Automatic conversion of transaction amounts
- Original transaction currency is preserved
- Live exchange rates retrieved from the Frankfurter API
- Dashboard analytics converted to the selected currency
- Currency-aware formatting and symbols

### Analytics & Export

- Monthly cash flow visualization
- Expense breakdown by category
- Currency-aware dashboard analytics
- CSV transaction export
- Client-side PDF transaction report generation
- Converted amounts and currency symbols in exported reports

### Data Fetching & State Management

- TanStack Query for server-state management
- Query caching and automatic refetching
- Query invalidation after transaction mutations
- Redux Toolkit for global client-side currency state

### Testing

- Playwright end-to-end testing with Chromium
- Automated authentication tests covering registration, login, and logout
- Dashboard expense summary verification
- Admin category creation test
- Transaction create, edit, and delete test
- Application smoke test
- Separate test database configuration using `.env.test`
- Test admin account seeding with environment safeguards

**Current E2E test status:** 6 tests passed.

### Data Management

- PostgreSQL relational database
- Prisma ORM
- Foreign key relationships
- Database-backed sessions
- Soft deletion for categories
- Decimal values for financial amounts

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Authentication:** Custom database-backed session authentication
- **Server State:** TanStack Query
- **Client State:** Redux Toolkit
- **Charts:** Recharts
- **Currency Data:** Frankfurter API
- **PDF Generation:** jsPDF + jspdf-autotable
- **E2E Testing:** Playwright
- **Deployment:** Vercel

## Architecture

The application follows a client-to-server architecture with dedicated service, state-management, and data-fetching layers.

```text
Client Components
       ↓
TanStack Query / Redux Toolkit
       ↓
Service Functions
       ↓
Next.js API Routes
       ↓
Authentication / Authorization
       ↓
Prisma ORM
       ↓
PostgreSQL
```

### State Management

The application separates server state from client state:

- **TanStack Query** manages server-side data such as transactions, categories, and dashboard analytics.
- **Redux Toolkit** manages global client-side preferences such as the selected display currency.

For example, changing the global currency updates the selected currency in Redux and triggers the relevant dashboard queries to load data for that currency.

## Database Schema

The application uses PostgreSQL with the following main models:

```text
User
 ├── Session
 └── Transaction
        └── Category
```

### Main Relationships

- A user can have multiple sessions.
- A user can have multiple transactions.
- A category can be used by multiple transactions.
- Each transaction belongs to one user and one category.
- Categories use soft deletion so existing transaction records are not removed when a category is deactivated.

### Main Models

```text
User
- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt

Session
- id
- userId
- expiresAt
- createdAt

Category
- id
- name
- icon
- color
- isActive
- createdAt

Transaction
- id
- title
- type
- amount
- date
- note
- userId
- categoryId
- currency
- createdAt
- updatedAt
```

### Transaction Currency

Each transaction stores its original currency.

```text
Transaction
       ↓
amount + currency
       ↓
conversion
       ↓
selected display currency
```

This allows transactions created in different currencies to remain accurate while still supporting a global display currency.

## Authentication & Authorization

Authentication is handled using database-backed sessions.

After a successful login:

1. A session is created in the database.
2. The session ID is stored in an HTTP-only cookie.
3. The current user is retrieved from the session.
4. Protected API routes check whether the user is authenticated.
5. Admin-only routes additionally check the user's role.

For example, category creation, update, and deletion require an `ADMIN` role.

## Data Fetching

TanStack Query is used to manage server-side data.

The application uses query hooks for resources such as:

- Transactions
- Categories
- Dashboard summary
- Monthly dashboard data
- Expense-by-category data
- Exchange rates

After mutations such as creating, updating, or deleting a transaction, related queries are invalidated so the UI can automatically refresh with the latest data.

## Currency Conversion

Exchange rates are retrieved from the Frankfurter API.

The application keeps the original transaction currency in PostgreSQL and converts amounts only when displaying or aggregating them in the selected currency.

For example:

```text
Transaction A
USD 100

Transaction B
THB 3,000

Transaction C
MMK 500,000

       ↓

Selected Currency: THB

       ↓

Converted dashboard values
```

This prevents transactions with different original currencies from being incorrectly summed together.

## Automated Testing

The project uses Playwright to test key user workflows in a real browser.

### Run E2E Tests

```bash
npm run test:e2e
```

The Playwright configuration starts the development server with environment variables loaded from `.env.test`.

### Test Coverage

| Test               | What it verifies                                |
| ------------------ | ----------------------------------------------- |
| Smoke test         | Application opens successfully                  |
| Authentication     | User can register and log in                    |
| Session management | User can log out and lose session access        |
| Dashboard          | Expense summary is displayed correctly          |
| Categories         | Admin can create a category                     |
| Transactions       | User can create, edit, and delete a transaction |

### Test Database Setup

The E2E tests use a separate test database configured in `.env.test`. Configure this file with a test database connection string and the required test environment variables before running the suite.

The test admin account can be prepared using:

```bash
npm run db:seed:test
```

The seed script checks `E2E_TEST_DB=true` before proceeding. Keep test database credentials and passwords private, and never commit `.env.test`.

## Local Development

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/ZinMarMyint-zmm/expense-tracker.git
cd expense-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/expensetracker?schema=public"
```

Use your own PostgreSQL connection details.

4. **Run database migrations**

```bash
npx prisma migrate dev
```

5. **Start the development server**

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables

| Variable       | Description                           |
| -------------- | ------------------------------------- |
| `DATABASE_URL` | PostgreSQL database connection string |

E2E testing additionally requires the test environment variables configured in `.env.test`, including `E2E_TEST_DB` and `E2E_ADMIN_PASSWORD` for the test seed workflow.

Exchange rates are retrieved from the Frankfurter API and do not require a separate API key.

## Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
├── components/
├── hooks/
├── lib/
├── services/
├── store/
│   └── slices/
├── types/
└── utils/

e2e/
├── auth.spec.ts
├── categories.spec.ts
├── dashboard.spec.ts
├── smoke.spec.ts
└── transactions.spec.ts

prisma/
├── schema.prisma
└── seed.ts
```

- `app/` — Pages, layouts, and API routes
- `components/` — Reusable UI components
- `hooks/` — TanStack Query hooks and application hooks
- `lib/` — Shared utilities such as authentication, Prisma, currency conversion, and formatting
- `services/` — API communication functions
- `store/` — Redux Toolkit store and slices
- `types/` — TypeScript types
- `utils/` — Utility functions such as date formatting and export/PDF generation
- `e2e/` — Playwright end-to-end tests
- `prisma/` — Database schema, migrations, and seed script

## Screenshots

### Dashboard

![Dashboard](./public/screenshots/dashboard.png)

### Transactions Page

![Transactions](./public/screenshots/transactions.png)

### Add Transaction

![Add Transaction](./public/screenshots/addtransactionform.png)

### Category Management

![Category Management](./public/screenshots/categorymanagement.png)

### Login

![Login](./public/screenshots/signin.png)

## Future Improvements

- Add more advanced transaction filtering and sorting
- Add additional financial reports and analytics
- Improve notification and error feedback
- Improve dashboard empty states
- Add more production-level validation and monitoring
