# InternshipYatra

🔗 Live — https://internshipyatra.vercel.app

InternshipYatra is a full-stack web platform that connects students with internship opportunities. Interns can discover and apply for listings, while HR / companies can manage postings and review applicants.

---

## Features

- **For Interns** — Browse internships, apply, manage profile, upload resume
- **For Companies / HR** — Post, edit, delete internship listings; view applicant profiles & resumes
- **Auth** — Secure login with short-lived **Access Tokens** (15 min) + long-lived **Refresh Tokens** (7 days, httpOnly cookie)
- **Silent Token Refresh** — Axios interceptor transparently refreshes expired tokens without logging the user out
- **Server-side Logout** — Refresh token is revoked in the database on logout
- **Cloud Storage** — Cloudinary for profile images, company logos, and resumes
- **Rich Text Editor** — Jodit editor for formatted internship descriptions
- **Toast Notifications** — Single global Toastify instance (no duplicate toasts)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| **Axios + Interceptors** | Centralized HTTP client, auto token attach & refresh |
| **Context API** | Global auth state (token, user info, login/logout) |
| Tailwind CSS | Styling |
| Jodit React | Rich text editor |
| React Toastify | Notifications |
| date-fns | Date formatting |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| **JWT (Access + Refresh)** | Stateless auth with token rotation |
| bcrypt | Password hashing |
| cookie-parser | httpOnly refresh token cookie |
| Cloudinary + Multer | File upload & cloud storage |
| Joi | Request validation |

---

## Project Structure

```
InternshipYatra/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── api/
│       │   └── axiosInstance.js   # Centralized axios with interceptors
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state (Context API)
│       ├── components/
│       │   ├── Header.jsx         # Shared header (auth-aware)
│       │   └── Footer.jsx         # Shared footer
│       └── pages/                 # Route-level page components
│
└── server/                   # Node.js + Express backend
    ├── Controllers/           # Route handlers
    ├── Middlewares/           # Auth middleware (JWT verify)
    ├── Models/                # Mongoose schemas
    ├── Routes/                # Express routers
    └── lib/                   # Multer / Cloudinary configs
```

---

## Auth Flow

```
LOGIN
  → Server issues: accessToken (15min, JSON) + refreshToken (7d, httpOnly cookie)
  → Client stores accessToken in localStorage + AuthContext

API REQUEST
  → Axios request interceptor auto-attaches: Authorization: Bearer <accessToken>

EXPIRED TOKEN (401)
  → Axios response interceptor silently calls POST /auth/refresh
  → Server validates refreshToken cookie → issues new accessToken
  → Original request is retried automatically

LOGOUT
  → POST /auth/logout → server nullifies refreshToken in DB + clears cookie
  → Client clears localStorage + resets context
```

---

## Getting Started

### Prerequisites
- Node.js 22.x
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```sh
git clone https://github.com/ravikhokle/InternshipYatra.git
cd InternshipYatra
```

### 2. Set up environment variables

Create a `.env` file inside the `server/` folder:
```env
PORT=5000
URI=your_mongodb_connection_string
JWT_SECRATE=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=your_cloudinary_url
```

Create a `.env` file inside the `client/` folder:
```env
VITE_API=http://localhost:5000
```

### 3. Install dependencies

```sh
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Run in development

```sh
# Terminal 1 — Backend (from server/)
npm run dev

# Terminal 2 — Frontend (from client/)
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 5. Build for production
```sh
cd client
npm run build
```

---

## Made with 🖤 by [Ravi Khokle](https://in.linkedin.com/in/ravikhokle)
