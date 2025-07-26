import Player from '../models/player.model.js';
import jwt from 'jsonwebtoken'; 

const protectRoute = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({message: 'Unauthorized access'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const player = Player.findUserById(decoded.id).select('-password');
        if (!player) {
            return res.status(401).json({message: 'Unauthorized access'});
        }
        req.player = player;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({message: 'Unauthorized access'}); 
    }
}