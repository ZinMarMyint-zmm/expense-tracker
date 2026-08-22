# 💸 Smart Expense Tracker & Financial Analytics Platform

A production-ready, full-stack personal finance and expense tracking application built with **Next.js App Router**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🌟 Key Engineering Features

- **Custom Session-Based Authentication:** Secure, stateless session handling integrated with Prisma.
- **Relational Data Integrity:** Cascade deletions and foreign key constraints between Users, Transactions, and Categories.
- **Type-Safe Database Access:** Fully typed queries using Prisma ORM with PostgreSQL.
- **Transactional Consistency:** Accurate `INCOME` and `EXPENSE` calculations using PostgreSQL `Decimal` types to avoid floating-point precision issues.
- **Optimized Performance:** Fast data fetching using Next.js Server Components, Server Actions, and database indexing.

---

## 📐 System Architecture & Data Flow

```mermaid
graph TD
    Client[Next.js Client Components] -->|Server Actions / API| Server[Next.js App Router Server]
    Server -->|Session Validation| Auth[Session Auth Guard]
    Auth -->|Type-safe Query| Prisma[Prisma ORM]
    Prisma -->|ACID Transactions| DB[(PostgreSQL Database)]
```

---

## 🗄️ Database Schema (ERD)

The application utilizes a normalized PostgreSQL relational database schema:

```mermaid
erDiagram
    User ||--o{ Session : "has many"
    User ||--o{ Transaction : "tracks"
    Category ||--o{ Transaction : "categorizes"

    User {
        string id PK
        string email UK
        string passwordHash
        UserRole role
    }

    Session {
        string id PK
        string userId FK
        datetime expiresAt
    }

    Category {
        string id PK
        string name UK
        string icon
        string color
    }

    Transaction {
        string id PK
        string title
        TransactionType type
        decimal amount
        datetime date
        string userId FK
        string categoryId FK
    }
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Authentication:** Custom Session-based Auth (`Session` Model)
- **Deployment:** Vercel (Frontend/Backend), Neon / Supabase (PostgreSQL)

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database URL

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/your-username/expense-tracker.git](https://github.com/your-username/expense-tracker.git)
   cd expense-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/expensetracker?schema=public"
   ```

4. **Run Database Migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
