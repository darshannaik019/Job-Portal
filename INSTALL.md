# Developer Setup & Installation Guide

Follow these instructions to run the application locally on your computer.

## Prerequisites
- Node.js installed (v18 or higher recommended)
- npm package manager (comes bundled with Node.js)
- MongoDB Atlas account (for database hosting) or local MongoDB instance

## Step-by-Step Installation

### 1. Clone or Download Code
Ensure the repository contents are present in your workspace root:
```bash
c:\Users\darsh\OneDrive\Desktop\job
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` inside both the root and `backend/` directories.
Fill in your MongoDB connection string and optional SMTP (email) and Cloudinary credentials.
*Note: If no actual Cloudinary or SMTP credentials are provided, the system automatically uses built-in log simulations, allowing the application to run locally without failing.*

### 3. Install Dependencies
Run the command below from the root directory to install package components for the root runner, frontend, and backend folders:
```bash
npm run install-all
```

### 4. Start Development Server
Run the dev task to start both servers concurrently:
```bash
npm run dev
```
- The backend API runs on `http://localhost:5000`
- The React frontend client runs on `http://localhost:5173`

## Initial Login Testing Accounts
You can create new seeker and recruiter accounts directly from the UI Registration page, or use registration APIs to test credentials.
- Register an account with role `user` for Job Seeker flow.
- Register an account with role `admin` for Recruiter Overview flow.
