import Player from '../models/player.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../lib/jwt.js';

export const register = async (req, res) => {
    try {
        const {username, email, password, confirmPassword} = req.body;
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({message: 'All fields are required'});
        }

        if (password !== confirmPassword) {
            return res.status(400).json({message: 'Passwords do not match'});
        }
        const existingPlayer = await Player.findOne({email});
        if (existingPlayer) {
            return res.status(400).json({message: 'Player already exists'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newPlayer = new Player({
            username,
            email,
            password: hashedPassword
        });

        const savedPlayer = await newPlayer.save();
        if(savedPlayer){
            generateToken(savedPlayer._id, res);
            res.status(201).json({
                message: 'Player registered successfully',
                player: {
                    id: savedPlayer._id,
                    username: savedPlayer.username,
                    email: savedPlayer.email
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error Signing Up'});
    }
}
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'});
        }
        const player = await Player.findOne({email});
        if (!player) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, player.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
        generateToken(player._id, res);
        res.status(200).json({
            message: 'Player logged in successfully',
            player: {
                id: player._id,
                username: player.username,
                email: player.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error Logging In'});
    }
}
export const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({message: 'Player logged out successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error Logging Out'});
    }
}

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.player);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error Checking Authentication'});
    }
}
