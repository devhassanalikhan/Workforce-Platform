# Workforce Platform

An ethical global workforce mobility platform — AI-scored profiles, verified credentials, and transparent international placement.

---

## Initial Setup Guide

Follow these steps to get the development environment running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)

---

### 1. Navigate into the project workspace

The application source lives inside the `app` directory.

```bash
cd app
```

> All subsequent commands must be run from inside the `app` directory.

---

### 2. Install dependencies

```bash
npm install
```

This downloads every package listed in `package.json` into a local `node_modules` folder.

> **Common error this fixes:**
> ```
> 'vite' is not recognized as an internal or external command
> ```
> This error means dependencies were never installed. Running `npm install` resolves it.

---

### 3. Start the development server

```bash
npm run dev
```

The terminal will print a local URL — open it in your browser:

```
➜  Local:   http://localhost:5173/
```

The server supports **Hot Module Replacement (HMR)**: file changes reflect in the browser instantly without a full reload.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and produce a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Routing:** React Router v7
- **Bundler:** Vite
- **Styling:** Tailwind CSS v3 (class-based dark mode)
- **UI Primitives:** Radix UI
- **Icons:** Lucide React
