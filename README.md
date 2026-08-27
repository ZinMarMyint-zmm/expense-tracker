# Smart Expense Tracker

A full-stack personal finance and expense tracking application built with **Next.js App Router**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## Features

### Authentication & Authorization

- User registration and login
- Database-backed session authentication
- HTTP-only session cookies
- Role-based authorization
- Admin-only category management

### Transaction Management

- Create, update, and delete transactions
- Income and expense tracking
- Category-based transactions
- Date-range filtering
- Paginated transaction list

### Analytics & Export

- Monthly cash flow visualization
- Expense breakdown by category
- CSV export
- Client-side PDF generation

### Data Management

- PostgreSQL relational database
- Prisma ORM
- Foreign key relationships
- Soft deletion for categories
- Decimal values for financial amounts

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Authentication:** Custom session-based authentication
- **Deployment:** Vercel

## Architecture

The application follows a simple client-to-server architecture:

```text
Client Components
       ↓
Next.js API Routes
       ↓
Authentication / Authorization
       ↓
Prisma ORM
       ↓
PostgreSQL
```

Client components handle the user interface and call service functions to communicate with the API routes.

The API routes handle authentication, authorization, validation, and database operations through Prisma.

## Database Schema

The application uses PostgreSQL with the following main models:

```text
User
 ├── Session
 └── Transaction
        └── Category
```

### Main relationships

- A user can have multiple sessions.
- A user can have multiple transactions.
- A category can be used by multiple transactions.
- Each transaction belongs to one user and one category.
- Categories use soft deletion so existing transaction records are not removed when a category is deactivated.

The main models are:

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
- createdAt
- updatedAt
```

## Authentication & Authorization

Authentication is handled using database-backed sessions.

After a successful login:

1. A session is created in the database.
2. The session ID is stored in an HTTP-only cookie.
3. The current user is retrieved from the session.
4. Protected API routes check whether the user is authenticated.
5. Admin-only routes additionally check the user's role.

For example, category creation, update, and deletion require an `ADMIN` role.

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

The application requires the following environment variable:

| Variable       | Description                           |
| -------------- | ------------------------------------- |
| `DATABASE_URL` | PostgreSQL database connection string |

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
├── types/
└── utils/

prisma/
└── schema.prisma
```

- `app/` — Pages, layouts, and API routes
- `components/` — Reusable UI components
- `hooks/` — Client-side state and data-fetching logic
- `lib/` — Shared server-side utilities such as authentication and Prisma
- `services/` — API communication functions
- `types/` — TypeScript types
- `utils/` — Utility functions such as date formatting and export/PDF generation
- `prisma/` — Database schema and Prisma configuration

## Screenshots

### Dashboard

![Dashboard](./public/screenshots/dashboard.png)

### Transactions page

![Transactions](./public/screenshots/transactions.png)

### Add transaction

![AddTransaction](./public/screenshots/addtransactionform.png)

### Category management

![CategoryManagement](./public/screenshots/categorymanagement.png)

### Login

![Login](./public/screenshots/signin.png)

## Future Improvements

- Add more advanced transaction filtering and sorting
- Add additional financial reports and analytics
- Improve notification and error feedback
