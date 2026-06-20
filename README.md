# DevBlog — Frontend

React + Vite blog platform with public browsing and admin panel.

## Live Demo
https://blog-fe-black.vercel.app/

for admin access -> 
username: admin
password: admin1234

## Tech Stack
React, React Router DOM, Axios, Tailwind CSS, Vite, Lucide React

## Features
- Browse, search, paginate published blogs
- Blog detail with cover image and gallery
- Submit comments (Thai characters and numbers only)
- Admin dashboard with blog and comment management
- Image upload to Supabase Storage
- JWT authentication

## Setup

```bash
npm install
```

Create `.env`:
```env
VITE_API_URL=https://blog-be-3emd.onrender.com/api
```

```bash
npm run dev
```

## Admin Access
URL:      /login
Username: admin
Password: admin1234

Deployed on Vercel. Set `VITE_API_URL` in project environment variables.
