import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
        },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
        },
    password: {
        type: String,
        required: true,
        minlength: 6
        },
    level: {
        type: Number,
        required: true,
        default: 1,
        min: 1
        }

}, 
{
    timestamps: true
});

const Player = mongoose.model("Player", playerSchema);

export default Player;