# Job Deck

Job Deck is a personal **Job Application Command Center** – a mini ATS and analytics dashboard that helps you track your job search like a pro.

It’s designed to showcase:

- Modern **React** skills
- Clean **Ant Design** UI
- Real-world **state management** with **Redux Toolkit** and **Zustand**
- A scalable **dashboard-style layout** suitable for real applications

---

## 🚀 Features

### Current (MVP Skeleton)

- ⚛️ **React + Vite** setup for a fast, modern dev experience
- 🎨 **Ant Design layout shell** with:
  - Sidebar navigation
  - Top header
  - Content area for pages
- 🧭 **Routing with React Router**:
  - `/` – Dashboard
  - `/pipeline` – Pipeline Board
  - `/jobs` – Jobs List
  - `/jobs/:jobId` – Job Detail
- 🧱 **Initial state management layer**:
  - `jobsSlice` – base structure for job entities
  - `activitiesSlice` – base structure for job-related activities
  - `uiStore` (Zustand) – base structure for UI filters and preferences

### Planned (Upcoming)

> These are the features Job Deck is designed to support and will be built next:

- 📊 **Dashboard analytics**
  - Total applications, active pipeline, offers
  - Charts for applications per week, by source, and by status
- 🗂 **Kanban-style pipeline board**
  - Columns by job status (Saved, Applied, Interview, Offer, Rejected)
  - Drag-and-drop between stages
- 📋 **Jobs table with filters**
  - Search, sorting, and filtering by status, source, location, etc.
- 📝 **Job detail view**
  - Full job info, notes, tags, and history
  - Activity timeline (applied, follow-ups, interviews)
- 🔔 **Reminders & follow-ups**
  - Tasks or reminders related to each job
- 💾 **Data persistence**
  - Local storage for saving state across sessions
  - Optional future backend integration (Node/Express or similar)

---

## 🧰 Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Library**: [Ant Design](https://ant.design/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management (Domain State)**: [Redux Toolkit](https://redux-toolkit.js.org/) + [React-Redux](https://react-redux.js.org/)
- **State Management (UI State)**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [@ant-design/icons](https://ant.design/components/icon/)
- **Utility**: [Day.js](https://day.js.org/) (for dates – optional/enabled as needed)

---

## 🏗 Architecture Overview

Job Deck is structured to look and feel like a real-world dashboard application.

### Pages

- `DashboardPage` – High-level overview and analytics for your job search
- `PipelinePage` – Kanban board showing job applications by status
- `JobsPage` – Table view of all jobs with filters/search
- `JobDetailPage` – Detailed view for a single job, activities, and notes

### Layout

All pages are wrapped inside a shared `MainLayout`:

- **Sider** – Left navigation (Dashboard / Pipeline / Jobs)
- **Header** – App title and future actions
- **Content** – Renders the active page via React Router

### State Management Split

- **Redux Toolkit** – Stores the core **business/domain data**:
  - `jobsSlice` – All job entries
    - Normalized structure: `{ byId: {}, allIds: [] }`
  - `activitiesSlice` – Activities grouped by `jobId`
    - Structure: `{ byJobId: { [jobId]: Activity[] } }`
- **Zustand (`uiStore`)** – Stores **UI-focused state**:
  - Filters for the jobs list (status, source, search keyword)
  - Potential UI settings like layout mode, selected tabs, etc.
- **Local Component State** – Form inputs, modals, and small view-specific state

This separation makes it easier to demonstrate good architectural decisions:

- Redux for **persistent, shared data**
- Zustand for **ephemeral UI/control state**
- Local state for **component-level concerns**

---

## 📁 Project Structure

High-level structure (simplified):

```bash
src/
  components/          # Reusable shared components (to be added)
  features/
    jobs/
      jobsSlice.js     # Redux slice for jobs
    activities/
      activitiesSlice.js  # Redux slice for activities
  hooks/               # Custom hooks (to be added)
  layout/
    MainLayout.jsx     # Ant Design app shell (sider + header + content)
  pages/
    Dashboard/
      DashboardPage.jsx
    Pipeline/
      PipelinePage.jsx
    Jobs/
      JobsPage.jsx
    JobDetail/
      JobDetailPage.jsx
  store/
    store.js           # Redux store configuration
    uiStore.js         # Zustand UI state store
  App.jsx              # Route configuration and layout usage
  main.jsx             # Root render, providers (Redux, Router, AntD)
```
