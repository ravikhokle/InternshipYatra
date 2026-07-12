const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const DBConnect = require('./Models/db');
const AuthRouter = require('./Routes/AuthRouter');
const PostRouter = require('./Routes/PostRouter');
const ProfileRouter = require('./Routes/ProfileRouter');

const PORT = process.env.PORT || 8000;

DBConnect();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // allow cookies to be sent cross-origin
}));

app.use(cookieParser());

const _dirname = path.resolve();

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/profile', ProfileRouter);
app.use('/auth', AuthRouter);
app.use('/posts', PostRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
