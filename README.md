# DevPulse 🚀

> A full-stack developer social platform built with the MERN stack, featuring real-time messaging, secure authentication, notifications, and an AI-powered developer assistant.

## 🌐 Live Demo

**Frontend:** https://devpulse-sf3s.vercel.app/

**Backend:** https://devpulse-backend-4vvo.onrender.com/

---

## 📌 Overview

DevPulse is a developer-focused social platform where developers can create and share posts, connect with other developers, communicate in real time, receive notifications, and interact with an AI-powered assistant.

The project was built to go beyond a basic CRUD social media application by implementing production-oriented features such as JWT authentication with refresh tokens, Google OAuth, two-factor authentication, Socket.IO messaging, read receipts, notification systems, cloud image uploads, and AI integration.

---

## ✨ Features

### 🔐 Authentication & Security

- User registration and login
- JWT-based authentication
- Access token + refresh token architecture
- HTTP-only authentication cookies
- Automatic access-token refresh
- Google OAuth login
- Email verification
- Forgot password / password reset
- Two-factor authentication (2FA)
- Secure logout
- Protected API routes
- Authentication middleware

### 👨‍💻 Developer Profiles

- Developer profiles
- Custom bio
- Skills
- GitHub profile
- LinkedIn profile
- Personal website
- Experience
- Education
- Certificates
- Profile avatar
- Cover image
- Developer search
- Suggested developers

### 📝 Social Feed

- Create posts
- Edit posts
- Delete posts
- Image posts
- Hashtag extraction
- Paginated feed
- User-specific posts
- Post likes
- Comments
- Bookmarks

### 🤝 Developer Network

- Follow developers
- Unfollow developers
- Follow status
- Followers
- Following
- Developer discovery
- Suggested developers

### 💬 Real-Time Messaging

- One-to-one conversations
- Real-time messages using Socket.IO
- Private user rooms
- Message history
- Read receipts
- Typing indicators
- Real-time message delivery
- Online socket connection handling

### 🔔 Notifications

Real-time notifications for events such as:

- Likes
- Comments
- Follows
- Messages
- Other platform activity

Unread notification counts are also supported.

### 🤖 DevPulse AI

DevPulse includes an integrated AI assistant designed for developers.

Features include:

- AI-powered conversations
- Persistent AI conversations
- AI usage tracking
- Token/usage management
- Dedicated AI interface
- AI accessible from desktop and mobile navigation

### ☁️ Media & Cloud Storage

- Image uploads
- Cloudinary integration
- Profile images
- Cover images
- Post images

### 📱 Responsive UI

The application is designed to work across:

- Desktop
- Tablet
- Mobile

Mobile navigation includes access to the complete DevPulse experience, including DevPulse AI.

---

# 🏗️ Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Lucide React
- Socket.IO Client

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Google OAuth
- Nodemailer
- Cloudinary

## AI

- AI API integration
- Persistent AI conversations
- Token/usage tracking

## Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database
- Cloudinary — Media storage

---

# 🏛️ Architecture

DevPulse follows a modular full-stack architecture.

```text
DevPulse
│
├── frontend
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── context
│   ├── api
│   └── routes
│
└── backend
    ├── controllers
    ├── services
    ├── models
    ├── routes
    ├── middlewares
    ├── validators
    ├── socket
    ├── utils
    └── config
