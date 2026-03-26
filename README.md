# MCA Expose

A React + TypeScript application built with Vite for MCA students — providing resources, community, and academic support.

## Tech Stack

- **React 18** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **React Router DOM** — Client-side routing
- **CSS Modules** — Scoped styling

## Project Structure

```
src/
├── components/        # Reusable components (Navbar, etc.)
├── pages/             # Page-level components (Home, About)
├── App.tsx            # Root component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Configure admin authentication

Create a `.env` file from `.env.example` and set secure values:

```bash
cp .env.example .env
```

Generate a SHA-256 hash for your password (PowerShell/Node):

```bash
node -e "const crypto=require('crypto'); const password='YOUR_PASSWORD'; const salt='mca-expose::'; console.log(crypto.createHash('sha256').update(salt + password).digest('hex'))"
```

Then place the hash in `VITE_ADMIN_PASSWORD_HASH`.

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Available Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
