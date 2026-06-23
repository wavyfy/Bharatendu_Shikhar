# Bharatendu Shikhar

A modern web application built using a monorepo architecture. 

## 🚀 Tech Stack

- **Framework**: [Next.js App Router](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Framer Motion, Lucide React
- **Database / Backend**: [Supabase](https://supabase.com/)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: pnpm

## 📁 Project Structure

The repository uses Turborepo to manage multiple applications and packages.

```text
.
├── apps/
│   ├── admin/       # Admin dashboard application
│   └── web/         # Main public-facing application
├── packages/
│   └── api/         # Shared API utilities and logic
├── supabase/        # Supabase configuration and migrations
└── turbo.json       # Turborepo configuration
```

## 🛠️ Prerequisites

Ensure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [pnpm](https://pnpm.io/) (v11.2.2 or higher)

## 🏃‍♂️ Getting Started

1. **Install dependencies**
   Install all dependencies across the monorepo workspace:
   ```bash
   pnpm install
   ```

2. **Run development server**
   Start the development environment for all apps and packages:
   ```bash
   pnpm run dev
   ```

## 📜 Available Scripts

Run these scripts from the root directory:

- `pnpm run dev`: Starts development servers for all apps.
- `pnpm run build`: Builds all apps and packages for production.
- `pnpm run lint`: Runs ESLint across the monorepo.
- `pnpm run type-check`: Runs TypeScript compiler checks.

## 🔒 Security

* Never commit `.env` or sensitive credentials to version control.
* Use Supabase Row Level Security (RLS) policies to protect data access.
