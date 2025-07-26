import { app, server, io } from './server.js';
import { config } from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './lib/db.js';

import authRoutes from './routes/auth.route.js';

config();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json());
app.use('/api/auth', authRoutes);

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})