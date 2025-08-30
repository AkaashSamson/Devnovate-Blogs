

# 📝 Devnovate Blogging Platform (MERN Stack)

A **blogging & article platform** built with the **MERN stack (MongoDB, Express.js, React, Node.js)** for **VIBE HACK 2025**.  
Users can write and submit blogs, while admins moderate content. Trending blogs are shown based on likes/comments.  
This project ensures **content quality, user engagement, and responsive design**.

---

## 🚀 Problem Statement
Build a **blogging and article platform** where:  
- Users can submit blogs (pending admin approval).  
- Admins manage blogs (approve/reject/delete).  
- Trending blogs are highlighted based on user engagement (likes/comments).  

---

## ✨ Features

### 👤 User Side
- Signup/Login with **JWT authentication**  
- Create & submit blogs (pending admin approval)  
- View published blogs on homepage  
- Like blogs & view trending blogs  
- Responsive UI (desktop + mobile)  

### 🛠 Admin Side
- Dashboard to **approve/reject** submitted blogs  
- Option to delete published blogs  
- Control content visibility  

### 🔮 Bonus (Stretch Features)
- Markdown editor (`react-quill`) for blog writing  
- Email notifications (approval/rejection updates)  
- Analytics dashboard (views, likes, comments tracking)  

---

## 📂 Project Structure

mern-blog-platform/ │── backend/         # Node.js + Express API │   ├── models/      # User & Blog schema │   ├── routes/      # Auth, Blog, Admin routes │   ├── middleware/  # JWT authentication │   └── server.js    # Express server entry │ │── frontend/        # React + Vite + Tailwind UI │   ├── pages/       # Home, Login, Signup, CreateBlog, Admin │   ├── components/  # Navbar, BlogCard │   └── utils/axios.js

---

## ⚙️ Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Axios, React Router  
- **Backend**: Node.js, Express.js, JWT, Bcrypt  
- **Database**: MongoDB Atlas  
- **Deployment**: Vercel (frontend), Render (backend)  

---

## 🔧 Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/mern-blog-platform.git
cd mern-blog-platform

2️⃣ Backend Setup

cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
PORT=5000

Run backend:

npm run dev

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev


---

📡 API Endpoints

Auth

POST /api/auth/signup → Register new user

POST /api/auth/login → Login & get JWT


Blogs

POST /api/blogs → Create blog (JWT required, status = pending)

GET /api/blogs → Get all approved blogs

POST /api/blogs/:id/like → Like a blog


Admin

PUT /api/admin/:id/approve → Approve blog

DELETE /api/admin/:id → Delete blog



---

🌍 Deployment

Backend API → Render Deployment

Frontend App → Vercel Deployment

Database → MongoDB Atlas



---

📸 Screenshots (Demo Flow)

1. Signup/Login → Secure JWT authentication


2. Create Blog → User submits blog for approval


3. Admin Dashboard → Approve/Reject blogs


4. Home Page → Display approved + trending blogs




---

🏆 Hackathon Info

Event: VIBE HACK 2025

Problem Statement: Blogging & Article Platform (MERN Stack)

Team: [Your Team Name]

Submission Deadline: 30th Aug, 8 PM



---

🔮 Future Enhancements

Blog detail pages with comments

Social sharing options

AI-powered content suggestions

Full analytics dashboard



---

👨‍💻 Contributors

Your Name

Team Members (if any)



---

✨ Built with ❤️ during VIBE HACK 2025

---
