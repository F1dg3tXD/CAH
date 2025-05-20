const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const setRoutes = require('./routes');
const { loadAnswers, loadPrompts } = require('./utils/cardLoader');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load card data
const answers = loadAnswers();
const prompts = loadPrompts();

// Set up routes
setRoutes(app, io, answers, prompts);

// Socket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle socket events here

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});