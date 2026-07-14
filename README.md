# Premium SaaS Job Portal (MERN Stack)

A production-ready, highly secure, and responsive Job Portal built using MongoDB, Express.js, React (Vite), and Node.js.

## Key Features

### Frontend (Job Seekers)
- **Modern Responsive UI**: Built with Tailored colors and Glassmorphism accents matching the Professional Efficiency System design system.
- **Role-Based Auth & Protected Routes**: Job Seekers get access to dashboards, applications, resume uploaders, and settings.
- **Job Searches & Interactive Filters**: Real-time category, location, and salary filter queries.
- **User Profile Management**: Add skills, education history, work experience, upload professional avatars, and sync resumes.
- **Theme Toggles**: Light and Dark mode options matching typography and layout requirements.

### Admin (Recruiter Portal)
- **Interactive Dashboards**: Bar chart visual analytics tracking application volumes and views by source.
- **CRUD Job Operations**: Publish, edit, and archive job opportunities using a custom bento modal.
- **Candidate Status Management**: Review candidate resumes and toggle application statuses (Pending, Shortlisted, Hired, Rejected).

### Backend REST API
- **Secure Authentication**: Short-lived JWT Access Tokens combined with Secure HTTP-Only Refresh Tokens.
- **Middleware Protections**: Authorization guards, helmet security headers, rate limiting (100 requests per 10 mins per IP), and Zod request body validation.
- **Cloudinary Integration**: Stores seeker resumes (raw PDF/DOC) and avatars.
- **Email Notifications**: Triggers Nodemailer updates for registration and candidate statuses.
- **Global Error Handling**: Centralized controller wrapper handling cast errors, validation errors, and logs using Winston.

## Project Structure

```
job/
  ├── backend/               # Express + Node + Mongoose
  │   ├── config/            # DB & Cloudinary configs
  │   ├── controllers/       # Route request handlers
  │   ├── middleware/        # Auth, role check, upload & error validations
  │   ├── models/            # User, Job, & Application schemas
  │   ├── routes/            # API endpoints
  │   ├── services/          # Email & Cloudinary upload promises
  │   ├── utils/             # Winston logger, JWT signs, & Zod schemas
  │   └── server.js          # Express server entry point
  │
  ├── frontend/              # React (Vite) client
      ├── src/
          ├── components/    # Common UI elements, Skeletons, & Charts
          ├── context/       # Toast & Dark mode providers
          ├── hooks/         # Custom toast triggers
          ├── pages/         # Dashboard layouts, Landings, Logins, Registers
          ├── redux/         # Global slice state management (Store)
          └── utils/         # Axios instance client config
```

## Quick Start

1. Install dependencies across root, frontend, and backend folders:
   ```bash
   npm run install-all
   ```
2. Setup environment keys in both root and backend `.env` folders using `.env.example` as a template.
3. Boot development servers for both client and backend concurrently:
   ```bash
   npm run dev
   ```
4. Access client in browser at `http://localhost:5173`.
