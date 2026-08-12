# ChatWithDoc — Frontend

A production-grade React frontend for ChatWithDoc, an AI-powered document intelligence (RAG) application. Built with React (Vite), Tailwind CSS, Axios, and React Router, designed to pair with an existing Django REST Framework + JWT backend.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM v7
- Axios (with auto token-refresh interceptors)
- react-hot-toast for notifications
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at your Django backend (defaults to `/api`, intended to be proxied or reverse-proxied in production).

```bash
cp .env.example .env
```

## Backend contract this UI expects

These are the endpoints the API layer calls. Adjust `src/api/*.js` if your DRF URLs differ — no other files need to change.

| Purpose | Method | Path |
|---|---|---|
| Register | POST | `/auth/register/` |
| Login (returns access + refresh) | POST | `/auth/login/` |
| Refresh token | POST | `/auth/token/refresh/` |
| Logout (blacklist refresh) | POST | `/auth/logout/` |
| Current user | GET | `/auth/me/` |
| Upload file (PDF only) | POST | `/documents/upload/` (multipart, field `file`) |
| Ask a question | POST | `/chat/ask/` (`{ question }`) |

The Dashboard, Upload history list, and History page currently render mock data so the UI is fully demoable without a live backend — swap the `MOCK_*` constants in `src/pages/Dashboard.jsx`, `src/pages/Upload.jsx`, and `src/pages/HistoryPage.jsx` for the corresponding `documentApi` / `chatApi` calls once you're ready to wire them up.

## Folder structure

```
src/
  api/          axios instance + interceptors, authApi, documentApi, chatApi
  components/
    ui/         Button, Input, Card, Modal, Loader, EmptyState, ErrorState, StatusBadge, PageHeader, Logo
    layout/     Sidebar, Navbar, DashboardLayout, ProtectedRoute
    auth/       AuthCard
    upload/     UploadPanel, DocumentHistoryList
    chat/       AskPanel, ConversationCard
  contexts/     AuthContext (Context API — no Redux)
  hooks/        useAuth
  pages/        Login, Register, Dashboard, Upload, Chat, HistoryPage, NotFound
  utils/        cn (classnames), format (dates/bytes)
```

## Auth & routing

- `AuthContext` exposes `user`, `isAuthenticated`, `login`, `register`, `logout`.
- `ProtectedRoute` checks `localStorage.getItem("access")` and redirects unauthenticated users to `/login`, preserving the original destination.
- Axios attaches `Authorization: Bearer <access>` to every request and transparently refreshes the token on a 401 using the refresh token; if refresh fails, the user is logged out and redirected to `/login`.

## Design

White/slate/black neutral palette with an indigo accent (`--color-accent-*` tokens in `src/index.css`), Inter typeface, restrained shadows and motion — aiming for the Notion/Linear/Vercel dashboard register rather than a flashy gradient-heavy look.
