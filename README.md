````markdown name=README.md
# Devnovate Blogs — MERN Blogging Platform

A blogging and article platform built with the MERN stack (MongoDB, Express.js, React, Node.js) for VIBE HACK 2025. Users can write and submit blogs; admins review and moderate content. Trending blogs are highlighted based on engagement (likes/comments). The app focuses on content quality, user engagement, and responsive design.

---

## Problem Statement

Build a blogging and article platform where:
- Users can submit blogs (pending admin approval).
- Admins manage blogs (approve/reject/delete).
- Trending blogs are highlighted based on user engagement (likes/comments).

---

## Features

User
- Sign up / Log in with JWT authentication
- Create and submit blogs (pending admin approval)
- Browse approved/published blogs
- Like blogs and view trending posts
- Responsive UI (desktop and mobile)

Admin
- Dashboard to approve/reject submitted blogs
- Delete published blogs
- Control content visibility

Stretch Goals
- Rich text/Markdown editor (e.g., react-quill)
- Email notifications (approval/rejection)
- Analytics (views, likes, comments)

---

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn-ui, Axios, React Router
- Backend: Node.js, Express.js, JWT, Bcrypt
- Database: MongoDB Atlas
- Deployment: Vercel (frontend), Render (backend)

---

## Repository Structure

```
Devnovate-Blogs/
├─ client/          # React + Vite frontend
├─ server/          # Node.js + Express API
├─ package.json     # Root config (if used)
├─ package-lock.json
├─ .gitignore
└─ README.md
```

---

## Getting Started

Prerequisites
- Node.js >= 18 and npm
- MongoDB Atlas connection string

Clone the repository
```bash
git clone https://github.com/AkaashSamson/Devnovate-Blogs.git
cd Devnovate-Blogs
```

Backend setup
```bash
cd server
npm install

# Create .env
# Required variables:
# MONGO_URI=your_mongodb_atlas_url
# JWT_SECRET=your_secret_key
# PORT=5000
#
# Example:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/devnovate
# JWT_SECRET=super_secret_key
# PORT=5000

npm run dev
```

Frontend setup
```bash
cd ../client
npm install

# Create .env
# VITE_API_URL points to your backend
# Example for local dev:
# VITE_API_URL=http://localhost:5000

npm run dev
```

---

## API Endpoints (Summary)

Auth
- POST /api/auth/signup — Register a new user
- POST /api/auth/login — Login and receive JWT

Blogs
- POST /api/blogs — Create blog (JWT required; initial status = pending)
- GET  /api/blogs — Get all approved blogs
- POST /api/blogs/:id/like — Like a blog (JWT required)

Admin
- PUT    /api/admin/:id/approve — Approve a blog
- DELETE /api/admin/:id         — Delete a blog

Note: Exact paths/middleware may vary with implementation.

---

## Deployment

- Backend (Render)
  - Environment variables: MONGO_URI, JWT_SECRET, PORT
  - Health check: / (or /api/health if implemented)
- Frontend (Vercel)
  - Environment variables: VITE_API_URL (point to the deployed backend)
- Database: MongoDB Atlas

---

## Screenshots (Optional)

1. Signup/Login — Secure JWT auth
2. Create Blog — User submission flow
3. Admin Dashboard — Approve/Reject blogs
4. Home Page — Approved + trending blogs

Add images to a /docs or /public directory and link them here.

---

## Roadmap / Future Enhancements

- Blog detail pages with comments
- Social sharing
- AI-powered content suggestions
- Full analytics dashboard

---

## Contributing

Contributions are welcome!
- Fork the repo
- Create a feature branch
- Commit changes with clear messages
- Open a pull request

---

## Acknowledgements

Built with ❤️ for VIBE HACK 2025.
````
