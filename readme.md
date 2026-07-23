# InternshipYatra

🔗 Live — https://internshipyatra.vercel.app

InternshipYatra is a full-stack web platform that connects students with internship opportunities. Interns can discover, filter, and apply for listings, while HR / companies can manage postings and review applicants.

---

## Features

### For Interns
- Browse internship listings with search, filters, sorting, and pagination
- Filter by work mode (Remote / On-site / Hybrid), stipend (Paid / Unpaid), location, and date posted
- Sort by most recent or highest stipend
- View internship details via ID or SEO-friendly slug URLs
- Apply to internships (in-app or external apply link)
- Build a profile with bio, headline, skills, education, experience, LinkedIn & GitHub
- Upload and update resume (PDF) and profile image
- In-browser resume viewer (`react-pdf`)
- Track your applications from the profile dashboard
- Public profile page at `/publicprofile/:username`

### For Companies / HR
- Create, edit, and delete internship posts
- Rich-text descriptions with **Jodit** editor
- Upload company logo and company bio
- Optional external apply link per posting
- View applicants for each post and open their resumes / profiles

### Authentication & Security
- Email/password signup with **OTP email verification** (Nodemailer)
- **Google OAuth** sign-in (`@react-oauth/google` + `google-auth-library`)
- Login with short-lived **Access Tokens** (15 min) + long-lived **Refresh Tokens** (7 days, httpOnly cookie)
- Silent token refresh via Axios interceptor (no forced logout on expiry)
- Server-side logout revokes the refresh token in the database
- Forgot password → OTP verify → reset password flow
- Protected routes for authenticated-only pages
- Joi request validation on auth endpoints
- bcrypt password hashing

### Profile & Privacy
- Unique usernames (auto-generated, changeable)
- Per-field **privacy settings** for public profile visibility
- Delete account support

### Platform
- Contact Us form (email delivery)
- About page
- Custom 404 page
- Global toast notifications (single Toastify instance)
- React Error Boundary for graceful UI failures
- CORS-locked origins for local + production frontend

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios + Interceptors | HTTP client with auto token attach & refresh |
| Context API | Global auth state (token, user, login/logout) |
| Tailwind CSS + PostCSS + Autoprefixer | Styling |
| Jodit React | Rich text editor for post descriptions |
| React Toastify | Toast notifications |
| date-fns | Date formatting |
| react-icons | Icon set |
| react-pdf | In-browser PDF resume viewer |
| @react-oauth/google | Google Sign-In button / token flow |
| ESLint | Linting |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (Access + Refresh) | Stateless auth with refresh rotation |
| bcrypt | Password hashing |
| cookie-parser | httpOnly refresh token cookie |
| cors | Cross-origin requests with credentials |
| dotenv | Environment config |
| Cloudinary + Multer + multer-storage-cloudinary | File upload & cloud storage |
| Joi | Request validation |
| Nodemailer | OTP / contact emails |
| google-auth-library | Verify Google ID tokens |

### Deployment & Hosting
| Service | Role |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend API hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Images, logos, and resume storage |

---

## Project Structure

```
InternshipYatra/
├── frontend/                          # React + Vite SPA
│   ├── public/                        # Static assets, redirects
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js       # Axios + auth interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state
│   │   ├── components/
│   │   │   ├── Header.jsx / Footer.jsx
│   │   │   ├── InternshipCard.jsx
│   │   │   ├── InternshipFilters.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── GoogleAuthButton.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── ContentShell.jsx
│   │   │   ├── UploadPageLayout.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── AppIcons.jsx / ProfileIcons.jsx
│   │   ├── pages/                     # Route-level screens
│   │   │   ├── Home.jsx               # Listings + filters + pagination
│   │   │   ├── ViewDetails.jsx        # Internship detail (id / slug)
│   │   │   ├── Login.jsx / SignUp.jsx
│   │   │   ├── VerifySignupOTP.jsx
│   │   │   ├── ForgotPassword.jsx / VerifyOTP.jsx / ResetPassword.jsx
│   │   │   ├── UserProfile.jsx / UpdateUserProfile.jsx
│   │   │   ├── PublicProfile.jsx
│   │   │   ├── CreatePost.jsx / UpdatePost.jsx
│   │   │   ├── AppliedUsers.jsx
│   │   │   ├── UpdateResume.jsx / ViewResume.jsx
│   │   │   ├── UpdateProfileImg.jsx / UpdateCompanyLogo.jsx
│   │   │   ├── About.jsx / ContactUs.jsx / NotFound.jsx
│   │   │   └── ProtectedRoutes.jsx
│   │   ├── utils/                     # Filters, slugs, privacy, validation
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
│
├── backend/                           # Node.js + Express API
│   ├── Controllers/                   # Route handlers
│   ├── Middlewares/                   # JWT auth + Joi validation
│   ├── Models/                        # Mongoose schemas (User, Post, Apply, PendingSignup)
│   ├── Routes/
│   │   ├── AuthRouter.js              # /auth/*
│   │   ├── PostRouter.js              # /posts/*
│   │   ├── ProfileRouter.js           # /profile/*
│   │   └── ContactRouter.js           # /contact/*
│   ├── lib/                           # Multer, Cloudinary, mailer, slug, username, privacy
│   ├── index.js                       # App entry
│   └── .env.example
│
├── package.json                       # Root workspace (Render deploy)
├── render.yaml                        # Render service config
├── vercel.json
└── readme.md
```

---

## Auth Flow

```
SIGNUP
  → POST /auth/send-signup-otp → email OTP
  → POST /auth/verify-signup-otp → account created
  → (or) POST /auth/google → Google OAuth account

LOGIN
  → Server issues: accessToken (15min, JSON) + refreshToken (7d, httpOnly cookie)
  → Client stores accessToken in localStorage + AuthContext

API REQUEST
  → Axios request interceptor attaches: Authorization: Bearer <accessToken>

EXPIRED TOKEN (401)
  → Axios response interceptor silently calls POST /auth/refresh
  → Server validates refreshToken cookie → issues new accessToken
  → Original request is retried automatically

LOGOUT
  → POST /auth/logout → server nullifies refreshToken in DB + clears cookie
  → Client clears localStorage + resets context
```

---

## API Overview

| Prefix | Purpose |
|---|---|
| `/auth` | Login, signup OTP, Google auth, refresh, logout, password reset |
| `/posts` | Create / list / search / apply / update / delete internships |
| `/profile` | User profile, resume, images, public profile, delete account |
| `/contact` | Contact form submissions |

---

## Getting Started

### Prerequisites
- Node.js 22.x
- MongoDB Atlas account
- Cloudinary account
- Gmail (or SMTP) App Password for OTP / contact emails
- Google Cloud OAuth Client ID (optional, for Google Sign-In)

### 1. Clone the repository
```sh
git clone https://github.com/ravikhokle/InternshipYatra.git
cd InternshipYatra
```

### 2. Set up environment variables

Create a `.env` file inside `backend/`:
```env
PORT=8000
URI=your_mongodb_connection_string
JWT_SECRATE=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside `frontend/`:
```env
VITE_API=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> Keep `VITE_API` in sync with the backend `PORT`.

### 3. Install dependencies

```sh
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run in development

```sh
# Terminal 1 — Backend (from backend/)
npm run dev

# Terminal 2 — Frontend (from frontend/)
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

### 5. Build for production
```sh
cd frontend
npm run build
```

---

## Made with 🖤 by [Ravi Khokle](https://in.linkedin.com/in/ravikhokle)
