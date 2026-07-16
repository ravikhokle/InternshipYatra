const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const DBConnect = require('./Models/db');
const AuthRouter = require('./Routes/AuthRouter');
const PostRouter = require('./Routes/PostRouter');
const ProfileRouter = require('./Routes/ProfileRouter');
const ContactRouter = require('./Routes/ContactRouter');

const PORT = process.env.PORT || 8000;

DBConnect();

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.RENDER_EXTERNAL_URL,
    'https://internshipyatra.vercel.app',
    'https://internshipyatra.ravikhokle.site',
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    app.use('/public', express.static(publicDir));
}

app.use('/profile', ProfileRouter);
app.use('/auth', AuthRouter);
app.use('/posts', PostRouter);
app.use('/contact', ContactRouter);

// Serve React build in production (single-server deploy)
const frontendDist = path.join(__dirname, '../frontend/dist');
const serveClient = process.env.SERVE_CLIENT === 'true' || process.env.NODE_ENV === 'production';

if (serveClient && fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    // SPA fallback — only for non-API frontend routes
    app.get('*', (req, res, next) => {
        if (
            req.path.startsWith('/auth') ||
            req.path.startsWith('/posts') ||
            req.path.startsWith('/profile') ||
            req.path.startsWith('/public')
        ) {
            return next();
        }
        res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
            if (err) next(err);
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    if (serveClient && fs.existsSync(frontendDist)) {
        console.log('Serving frontend from:', frontendDist);
    }
});
