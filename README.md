# Kanboard

A web-based Kanban task management app built with **Nuxt 2** and **Firebase**.
Users can sign up, manage their tasks on a board, sort them, get reminders for upcoming deadlines, and share tasks with other users.

🔗 **Live demo:** https://kanboard-zunsod.netlify.app
📦 **Repository:** https://github.com/Zunsod/kanboard

---

## Demo accounts

Two pre-filled accounts with shared tasks, so the sharing features can be tested:

| Name       | Email                   | Password   |
| ---------- | ----------------------- | ---------- |
| Бям Зөнсод | `zunsod.tech@gmail.com` | `Zunsod12` |
| Tugs       | `tugs@gmail.com`        | `Tugs1234` |

open the second account in a private/incognito window to see real-time updates between users.

---

## Features

### ✅ Assignment requirements

| Requirement             | Implementation                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User Authentication** | Email/password sign-up and log-in with Firebase Auth. Password rules, route guard for logged-out users                                                          |
| **Task Management**     | Create, read, update and delete tasks. Each task has a title, description, due date, priority and status (To Do / In Progress / Done)                           |
| **Task Sorting**        | Sort by due date or priority. Completion status is represented by the board columns                                                                             |
| **Task Reminders**      | On log-in, toast notifications show overdue tasks, tasks due today or tomorrow, and newly shared tasks. A notification bell keeps the list available afterwards |
| **Task Sharing**        | The owner shares a task by email. Shared tasks are visible and editable by both the owner and the recipient, and changes sync in real time                      |

### Also

- Drag & drop between columns
- Tabs: **All / My tasks / Shared with me** and search by title
- Real-time sync with Firestore listeners
- Firestore **Security Rules** enforce permissions on the server side
- Delete confirmation dialog and toast feedback for every action

---

## Tech stack

|             |                                          |
| ----------- | ---------------------------------------- |
| Framework   | Nuxt 2 (Vue 2)                           |
| State       | Vuex                                     |
| Backend     | Firebase Authentication, Cloud Firestore |
| Styling     | SCSS                                     |
| Icons       | `vue-tabler-icons`                       |
| Drag & drop | `vuedraggable@2`                         |
| Hosting     | Netlify                                  |

---

## Permissions

Permissions are enforced by Firestore Security Rules.

| Action                                              | Owner | Shared user |
| --------------------------------------------------- | ----- | ----------- |
| View task                                           | ✅    | ✅          |
| Edit title, description, due date, priority, status | ✅    | ✅          |
| Share / unshare                                     | ✅    | ❌          |
| Delete                                              | ✅    | ❌          |

---

## Data model

```
users/{uid}
  email: string
  displayName: string

tasks/{taskId}
  title: string
  description: string
  dueDate: string          // "YYYY-MM-DD"
  priority: "high" | "medium" | "low"
  status: "todo" | "in-progress" | "done"
  ownerId: string          // uid of the owner
  ownerName: string
  sharedWith: string[]     // uids, used for queries and security rules
  sharedUsers: { uid, name }[]  // for displaying avatars
  createdAt: timestamp
```

---

## Project structure

```
assets/scss/         Variables, mixins, global and auth styles
components/
  board/             BoardColumn, BoardToolbar, TaskCard
  modal/             TaskModal (create / edit / share), ConfirmDialog
  navbar/            SideBar, TopBar (notification bell)
  ui/                UiBadge, UserAvatar, ToastContainer
layouts/             default (sidebar), auth (login / sign-up)
middleware/auth.js   Redirects logged-out users to /login
pages/               index (board), login, signup
services/            Firebase setup, auth error messages
store/               auth, tasks (Firestore), toast
utils/date.js        Due date helpers
```

---

## Running locally

**Requirements:** Node.js 20 (see `.nvmrc`)

```bash
git clone https://github.com/Zunsod/kanboard.git
cd kanboard
npm install
```

Create a `.env` file in the project root with your Firebase web app config:

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

Then:

```bash
npm run dev        # http://localhost:3000
npm run generate   # static build into dist/
```

---
