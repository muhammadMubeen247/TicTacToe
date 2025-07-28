import express from 'express';
import { register,login,logout,checkAuth } from '../controllers/auth.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/logout', logout);

router.get('/checkAuth', protectRoute, checkAuth);


export default router;