# 📋 Task Management App

A modern task management app built with **Next.js**, **TypeScript**, and **Tailwind CSS**, featuring drag-and-drop Kanban boards, task views, and admin-controlled task editing — all with zero backend.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State/Logic**:
  - `@hello-pangea/dnd` – Drag and Drop
  - `html2canvas` – Screenshot capture
  - `lucide-react` – Icons
- **Storage**:
  - [jsonstorage.net](https://jsonstorage.net) – Task data
  - Cookies – Session management

---

## ✨ Core Features

### ✅ Task Management

- Create, edit, and delete tasks
- Each task includes:
  - `title`
  - `description`
  - `type` (e.g., bug, feature, etc.)
  - `status` (`backlog`, `inprogress`, `ready-to-check`, `done`)
  - `assignee`
  - `subtasks` support

### 🧭 Views

- **List View**: Filter tasks by active/completed
- **Kanban Board**: Drag-and-drop tasks between columns

### 👤 User System

- Simple login system
- Admin access:
  - **Username**: `asadbek`
  - Can create/edit/delete tasks

### 💾 Data Handling

- All task data is stored on [jsonstorage.net](https://jsonstorage.net)
- User session stored in LocalStorage
- Automatic cleanup of outdated tasks (e.g., old completed tasks)

---

## 📱 UI & UX

- Fully responsive design (mobile-friendly)
- Smooth drag-and-drop interactions
- Clean and minimal UI
- Error messages and validation

---

## ⚙️ Developer Notes

- Written in **clean, modular TypeScript**
- Well-defined interfaces for tasks and users
- Handles errors gracefully (fetch failures, invalid inputs, etc.)
- Optimized rendering and re-renders for performance

---

## 📸 Screenshots

> _Add screenshots here if you have any (List view, Kanban view, Task modal, etc.)_

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/asadbekme/task-management-app.git
cd task-management-app

# Install dependencies
npm install

# Run the dev server
npm run dev
```
