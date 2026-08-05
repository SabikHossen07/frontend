# 🎓 CapTrack — Capstone Project Lifecycle Management System

CapTrack is a full-stack MERN web application built to manage the complete lifecycle of university capstone projects — from finding a teammate and a supervisor, to tracking milestones, submitting deliverables, receiving feedback, and archiving completed work — all in one connected platform.

Built by **Group 5** for the Capstone Project course at **East West University**.

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🎨 **Frontend (Vercel)** | https://frontend-scqb.vercel.app |
| ⚙️ **Backend API (Render)** | https://captrack-backend-3c36.onrender.com |

> ⚠️ The backend runs on Render's free tier, which spins down after periods of inactivity. The **first** request after idle time can take 30–50 seconds to wake up — this is expected, not a bug.

## 🎥 Demo Video

📺 **[Watch the full project demo on YouTube](https://youtu.be/Hwu2flbv8Y8)**

📁 **[Additional demo files (Google Drive)](https://drive.google.com/drive/folders/1jeMLSafSedbmIpLWjLy0_yGHKGXAlVK3?usp=sharing)**

---

## ✨ Key Features

### 👨‍🎓 Student Side
- **Secure Registration & Login** — restricted to verified university emails (`@std.ewubd.edu` for students, `@ewubd.edu` for supervisors), with JWT-based authentication and encrypted passwords.
- **Personal Dashboard** — profile snapshot, live project summary, and an activity feed of new feedback, requests, and updates.
- **Find Teammates** — browse fellow students by skill, CGPA, and availability.
- **Supervisor Directory** — browse faculty by research focus, department, and open supervision slots, and send a supervision request directly.
- **Collaboration Feed** — a recruitment feed where students and supervisors post project ideas; like, comment, save, or apply to join a group.
- **Project Workspace** — a unified space with:
  - **Overview** — milestones and progress at a glance
  - **Tasks & Milestones** — assigned work, deadlines, and status
  - **Submissions** — upload deliverables and track approval status
  - **Feedback** — every supervisor comment in one place
- **Group Chat** — real-time messaging and file sharing with teammates and the assigned supervisor.

### 👩‍🏫 Supervisor Side
- **Supervisor Dashboard** — live overview of assigned groups, pending submissions, milestone approvals, feedback owed, and remaining supervision slots.
- **Student Profiles** — browse and filter students by skill, CGPA, and availability.
- **Milestone Tasks** — review tasks across every assigned group; approve work, add feedback, extend deadlines, or create new milestone tasks.
- **Pending Submissions** — approve completed deliverables or request revisions with notes.
- **Feedback Queue** — track and manage all outstanding feedback in one place.
- **Supervision Requests** — accept or reject incoming student requests.

### 🗂️ Shared
- **Project Archive** — a searchable, department-wide library of past and ongoing capstone projects, with abstracts, supervisor history, and links to reports and GitHub repositories.
- **Role-Based Access Control** — dedicated views and permissions for **Students**, **Supervisors**, and **Admins**.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Axios, Tailwind CSS, Radix UI, lucide-react
- **Backend:** Node.js, Express, Mongoose, JSON Web Tokens (JWT), bcryptjs
- **Database:** MongoDB Atlas (cloud-hosted)
- **Deployment:** Vercel (frontend) + Render (backend)

---

## 📦 Repository Structure

CapTrack is split into two separate repositories:

| Repo | Purpose | Link |
|---|---|---|
| **Frontend** | React + Vite single-page app | https://github.com/SabikHossen07/frontend |
| **Backend** | Express REST API | https://github.com/SabikHossen07/captrack-backend |

```text
frontend/                  captrack-backend/
  ├── src/                   ├── models/       # Mongoose schemas
  │   ├── app/                ├── routes/       # API endpoints
  │   │   ├── components/     ├── middleware/   # Auth middleware
  │   │   └── App.tsx         └── index.js      # Server entry point
  │   └── styles/
  ├── index.html
  └── package.json
```

---

## ⚙️ Local Setup Instructions

### 1. Clone both repositories
```bash
git clone https://github.com/SabikHossen07/captrack-backend.git
git clone https://github.com/SabikHossen07/frontend.git
```

### 2. Backend setup
```bash
cd captrack-backend
npm install
```

Create a `.env` file inside `captrack-backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/captrack?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

Run the server:
```bash
npm run dev      # development, auto-restarts on changes
# or
npm start        # production
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

By default the frontend points to the live deployed backend (`https://captrack-backend-3c36.onrender.com`). To point it at your local backend instead, update the `baseURL` in the `axios.create()` calls to `http://localhost:5000/api`.

---

## ☁️ Deployment

- **Backend** is deployed on **Render** as a Web Service, auto-deploying from the `main` branch of the backend repo. Required environment variables: `MONGO_URI`, `JWT_SECRET`.
- **Frontend** is deployed on **Vercel**, auto-deploying from the `main` branch of the frontend repo.

---

## 👥 Team

**Group 5 — CapTrack**
East West University · Capstone Project Lifecycle Management System

| Name | Student ID |
|---|---|
| Md. Sabik Hossen | 2023-2-60-305 |
| Wasimul Bari Rahat | 2022-3-60-243 |
--------------------------------------------
| Md Fahim Hassan Samir | 2023-3-60-239 |
| Nila Ashma Sara | 2022-2-60-104 |
| Nafiz Ibna Mahobub | 2022-3-60-126 |
| Samira Akter | 2022-3-60-301 |
