import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    isPublic: { type: Boolean, default: true }, // False for private, true for matchmaking
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Removed required
    moves: [
      {
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
        position: { type: Number, min: 0, max: 8, required: true }, // Tic-tac-toe specific
        symbol: { type: String, enum: ['X', 'O'], required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    currentTurn: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
    status: { type: String, enum: ['waiting', 'in-progress', 'completed'], default: 'waiting' },
    endedAt: { type: Date, default: null },
    reason: { type: String, default: null },
  },
  { timestamps: true }
);

// Index for matchmaking queries
gameSchema.index({ isPublic: 1, status: 1 });

const Game = mongoose.model('Game', gameSchema);

export default Game;