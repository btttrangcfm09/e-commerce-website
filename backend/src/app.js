const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const attachedRoutes = require('./routes/index');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.raw({ limit: '100mb' }));
// app.set('trust proxy', 1);

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
// Middleware để parse dữ liệu JSON trong request body (tích hợp sẵn trong express)
app.use(bodyParser.json());

app.use(cookieParser());

// Serve uploaded files (local fallback for profile image uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware để parse dữ liệu JSON trong request body
app.use('/', attachedRoutes);
app.use(errorHandler);


// Handle preflight requests
app.options('*', cors(corsOptions));

const port = process.env.PORT || 3000;
// Khởi động server
app.listen(port, function (err) {
    if (err) console.log('Error in server setup');
    console.log('Server listening on Port', port);
});