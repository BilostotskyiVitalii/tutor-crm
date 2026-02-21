# Tutor CRM

**Tutor CRM** — full-featured frontend project for English tutors, demonstrating modern React architecture, state management, and UI design.

🔗 Link: [https://tutor-crm-49cae.web.app/](https://tutor-crm-49cae.web.app/)

---

## 📌 Project Overview

This is a **frontend-focused pet project** aimed at:

- Managing students and lessons
- Scheduling via calendar
- Providing a clean, responsive, and interactive UI
- Practicing **React, TypeScript, state management, and component architecture**

The backend (Firebase + Express) serves as an API layer; the main focus is **frontend engineering**.

---

## 🧱 Tech Stack

### Frontend

- **React 18 + TypeScript**
- **Vite** (fast dev + build)
- **Redux Toolkit**
- **React Router v7**
- **Ant Design** for UI components
- **React Big Calendar** for scheduling
- **Recharts** for dashboards
- **i18next** for multi-language support

### Dev Tools

- **ESLint** + **Prettier** (code quality)
- **Husky + lint-staged** (pre-commit hooks)
- **SASS(SCSS)** for styling
- **Axios** for API requests

---

## 🌐 Frontend Features

- Student & lesson management dashboards
- Interactive calendar with drag/drop and event tracking
- Protected routing
- Form validation & error handling
- Internationalization support (i18n)
- Basic analytics charts (Recharts)
- Clean separation: **components → features → pages → app**

---

## 🔧 Installation & Local Setup

### Clone the repo

```bash
git clone https://github.com/your-username/tutor-crm.git
cd tutor-crm
```

### Install dependencies

```bash
npm install
```

### Run frontend

```bash
npm run dev
```

Open in browser: `http://localhost:5173`

---

## ⚡ Architecture Highlights

- **Feature-based folder structure** for scalability
- **Redux Toolkit** for global state with persisted storage
- **Axios instance** with interceptors for auth handling
- **Protected routes** via React Router
- **UI component library integration** (AntD) for good-looking components
- **i18n** for multi-language support

---

## 🔐 Authentication Flow

- Login via Email & Google OAuth
- Password reset flow
- JWT stored & verified in frontend Axios interceptors
- Protected routes & redirects for non-authenticated users

> Backend (Firebase Functions + Express) handles actual auth logic; frontend demonstrates **integration with real-world APIs**.

---

## 🔮 Next Improvements (Frontend-Focused)

- Advanced analytics dashboard
- Test coverage
- Accessibility improvements
- Adaptive layout

---
