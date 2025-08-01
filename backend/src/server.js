import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    }
});

export { app, server, io };