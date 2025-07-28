import { app, server, io } from './server.js';
import { config } from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import { setupGameConnection } from './lib/socket.js';

import authRoutes from './routes/auth.route.js';

config();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
setupGameConnection(io);


connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to DB:', err);
});
