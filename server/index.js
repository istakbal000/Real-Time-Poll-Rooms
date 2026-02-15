require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const pollRoutes = require('./routes/pollRoutes');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

// Attach io to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/polls', pollRoutes);

// Basic route to check server status
app.get('/', (req, res) => {
    res.send("Poll Share Backend is Running");
});

// Socket.IO
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinPoll', (pollId) => {
        socket.join(pollId);
        console.log(`Socket ${socket.id} joined poll ${pollId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/poll-app';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));
