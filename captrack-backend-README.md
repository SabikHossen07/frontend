# CapTrack Backend

REST API for [CapTrack](https://github.com/SabikHossen07/Cse412-Project-), a capstone project lifecycle management system built for East West University (Group 5, CSE412). The React frontend lives in [frontend](https://github.com/SabikHossen07/frontend).

**Live API:** https://captrack-backend-3c36.onrender.com
(Render free tier: the first request after idle can take 30-50 seconds.)

## Tech stack

Node.js, Express 5, MongoDB with Mongoose, JSON Web Tokens, bcryptjs, CORS, dotenv.

## API routes

All routes are mounted under `/api`.

| Route | Purpose |
|---|---|
| `/api/auth` | Registration and login |
| `/api/projects` | Capstone projects and supervision requests |
| `/api/admin` | Admin management |
| `/api/submissions` | Deliverable submissions and approvals |
| `/api/profiles` | Student and supervisor profiles |
| `/api/feed` | Collaboration feed posts |
| `/api/activity` | Activity notifications |
| `/api/tasks` | Milestones and tasks |
| `/api/chat` | Group messages |
| `/api/files` | Group file sharing |

## Models

`User`, `Project`, `SupervisionRequest`, `Task`, `Submission`, `Message`, `GroupFile`, `CollaborationPost`, `ActivityNotification`, `Semester`.

Users have one of three roles: `student`, `supervisor` or `admin`.

## Run locally

Requires Node.js and a MongoDB database (for example MongoDB Atlas).

```bash
git clone https://github.com/SabikHossen07/captrack-backend.git
cd captrack-backend
npm install
```

Create a `.env` file (never commit it):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/captrack
JWT_SECRET=use_a_long_random_string
```

```bash
npm run dev   # auto-restart with nodemon
npm start     # plain node
```

Open http://localhost:5000. You should see `CapTrack Backend Server Operational!`.

## Deployment

Deployed on Render as a Web Service from the `main` branch. Set `MONGO_URI` and `JWT_SECRET` as environment variables in the Render dashboard.

## Authors

Group 5, East West University: Md. Sabik Hossen, Wasimul Bari Rahat, Md Fahim Hassan Samir, Nila Ashma Sara, Nafiz Ibna Mahobub, Samira Akter.
