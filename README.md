# Job Deck

Job Deck is a fully-featured **Job Application Command Center** — a personal mini ATS that helps you track your job search, manage your pipeline, analyze performance, and maintain a complete candidate profile.

This project demonstrates **modern React engineering**, clean UI/UX design, state architecture, authentication, and real-world dashboard patterns.

---

## ✨ Features

### 🔐 Authentication (Clerk)

- Secure login & signup
- Protected routes
- User session-aware UI
- Sidebar profile section with avatar + navigation
- All profile data tied to the logged-in user

---

### 📊 Dashboard

A clean, pastel-themed analytics dashboard featuring:

- Application statistics (live from job data)
- Weekly applications chart
- Status distribution chart
- Calendar widget
- Recent activities
- Fully responsive card layout

---

### 🗂 Pipeline (Kanban Board)

A drag-and-drop pipeline built with HTML5 DnD:

- Status columns:  
  **Saved → Applied → Interview → Offer → Rejected**
- Move jobs between columns by dragging
- Updates job status instantly in Redux
- Smooth UI, mobile-friendly, professional layout

---

### 📋 Jobs Module

Complete job tracking system:

- Add / edit / delete jobs
- Status dropdown
- Jobs table with:
  - Search
  - Status filter
  - Source filter
- Job detail page with timeline + notes
- All job data persisted

---

### 🧠 Profile Management

A fully editable, multi-section candidate profile:

#### Sections:

- **Basic Info**  
  (title, employer, notice period, location, work mode, preferred roles/locations)
- **Skills** (tags editor)
- **Experience**
  - Month pickers
  - “Currently working here” toggle
  - Timeline view
- **Education**
  - Multiple entries
  - Month pickers
  - “Currently pursuing” toggle
- **Summary**
- **Career Focus**
- **Resume Upload**
  - Via a dedicated drawer
  - Stores metadata (filename, size, updated at)

#### Additional UX features:

- Snapshot sidebar showing preferred roles & locations
- Profile completeness (dynamic, % based on sections filled)
- Smooth scrolling with header offset

---

### 💾 Data Persistence

All important data is persisted using:

- **Redux Toolkit**  
  (jobs, activities, profile)
- **Zustand**  
  (UI filters, view state)
- **localStorage**  
  (full Redux state persistence)

Per-user persistence via Clerk user ID.

---

### 🎨 UI / UX Enhancements

- Full pastel theme
- Global theme tokens
- Sticky header + fixed sidebar
- Collapsible sidebar with centered avatar
- Consistent card heights
- Responsive grid layout
- Modern, soft shadow design

---

## 🧰 Tech Stack

- **React (Vite)**
- **React Router**
- **Ant Design**
- **Redux Toolkit**
- **Zustand**
- **Clerk Authentication**
- **Day.js**
- **HTML5 Drag & Drop**
- **localStorage Persistence**

---

### 🧱 State Layers

| Layer               | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| **Redux Toolkit**   | Persistent domain data (jobs, activities, profile) |
| **Zustand**         | UI state (filters, view options)                   |
| **Component State** | Forms, modals, drawers                             |

---

## 📦 Installation

- **git clone <repo-url>**
- **cd job-deck**
- **npm install**
- **npm run dev**

Create `.env` file:

VITE_CLERK_PUBLISHABLE_KEY=your-public-key

---

## 🚀 Deployment (Recommended: Vercel)

1. Push repo to GitHub
2. Import repo into Vercel
3. Add environment variable:

VITE_CLERK_PUBLISHABLE_KEY=your-public-key

4. Deploy → Live 🎉

---

## 🙌 About This Project

This project was built to demonstrate:

- Real-world dashboard architecture
- Advanced state management
- Authentication workflows
- Multi-section form handling
- Drag-and-drop interactions
- UI theming & clean styling
- SPA routing with protected pages

Perfect as a **portfolio project**, **ATS simulator**, or **job search companion tool**.

---
