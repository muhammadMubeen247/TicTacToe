import mongoose from 'mongoose';
import Game from '../models/game.model.js';

const generateRandomCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const existingId = await Game.findOne({ roomId: code });
    if (existingId) {
        return generateRandomCode();
    }
    return code;
};

export const setupGameConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('A Player Connected', socket.id);

        // Create a private room
        socket.on('createPrivateRoom', async ({ playerId }) => {
            if (!mongoose.Types.ObjectId.isValid(playerId)) {
                return socket.emit('error', { message: 'Invalid player ID.' });
            }
            const privateRoomId = await generateRandomCode();
            try {
                const newGame = new Game({
                    roomId: privateRoomId,
                    isPublic: false,
                    createdBy: playerId,
                    players: [playerId],
                    status: 'waiting',
                    moves: [],
                    currentTurn: null,
                    winner: null,
                    endedAt: null,
                    reason: null,
                });
                await newGame.save();
                socket.join(privateRoomId);
                console.log(`Player ${socket.id} created private room ${privateRoomId}`);
                io.to(privateRoomId).emit('roomCreated', {
                    roomId: privateRoomId,
                    players: [playerId],
                });
            } catch (error) {
                console.error('Error creating private room:', error);
                socket.emit('error', { message: 'Failed to create private room.' });
            }
        });

        // Join a private room
        socket.on('joinPrivateRoom', async ({ roomId, playerId }) => {
            if (!mongoose.Types.ObjectId.isValid(playerId)) {
                return socket.emit('error', { message: 'Invalid player ID.' });
            }
            try {
                const game = await Game.findOne({ roomId, isPublic: false });
                if (!game) {
                    return socket.emit('error', { message: 'Private room not found.' });
                }
                if (game.players.length >= 2) {
                    return socket.emit('error', { message: 'Room is full.' });
                }
                if (game.players.includes(playerId)) {
                    return socket.emit('error', { message: 'You are already in this room.' });
                }
                game.players.push(playerId);
                game.status = 'in-progress';
                game.currentTurn = game.players[0];
                await game.save();
                socket.join(roomId);
                console.log(`Player ${socket.id} joined private room ${roomId}`);
                socket.to(roomId).emit('playerJoined', playerId);
                io.to(roomId).emit('roomJoined', {
                    roomId,
                    players: game.players,
                });
            } catch (error) {
                console.error('Error joining private room:', error);
                socket.emit('error', { message: 'Failed to join private room.' });
            }
        });

        // Quick match
        socket.on('quickMatch', async ({ playerId }) => {
            if (!mongoose.Types.ObjectId.isValid(playerId)) {
                return socket.emit('error', { message: 'Invalid player ID.' });
            }
            try {
                let game = await Game.findOne({
                    isPublic: true,
                    status: 'waiting',
                    players: { $nin: [playerId] },
                }).sort({ createdAt: -1 });
                let roomId;
                if (!game) {
                    roomId = await generateRandomCode();
                    game = new Game({
                        roomId,
                        isPublic: true,
                        createdBy: playerId,
                        players: [playerId],
                        status: 'waiting',
                        moves: [],
                        currentTurn: null,
                        winner: null,
                        endedAt: null,
                        reason: null,
                    });
                    await game.save();
                } else {
                    roomId = game.roomId;
                    game.players.push(playerId);
                    game.status = 'in-progress';
                    game.currentTurn = game.players[0];
                    await game.save();
                    io.to(roomId).emit('roomJoined', {
                        roomId,
                        players: game.players,
                    });
                    socket.to(roomId).emit('playerJoined', playerId);
                }
                socket.join(roomId);
                console.log(`Player ${socket.id} found a quick match in room ${roomId}`);
                socket.emit('roomJoined', {
                    roomId,
                    players: game.players,
                });
            } catch (error) {
                console.error('Error finding quick match:', error);
                socket.emit('error', { message: 'Failed to find a quick match.' });
            }
        });

        // Make a move
        socket.on('makeMove', async (playerId, roomId, move) => {
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6], // Diagonals
            ];
            if (!mongoose.Types.ObjectId.isValid(playerId)) {
                return socket.emit('error', { message: 'Invalid player ID.' });
            }
            if (!['X', 'O'].includes(move.symbol)) {
                return socket.emit('error', { message: 'Invalid symbol.' });
            }
            try {
                console.log(`Player ${socket.id} made a move in room ${roomId}:`, move);
                let game = await Game.findOne({ roomId });
                if (!game) {
                    return socket.emit('error', { message: 'Game not found.' });
                }
                if (game.status !== 'in-progress') {
                    return socket.emit('error', { message: 'Game is not active.' });
                }
                if (game.currentTurn.toString() !== playerId.toString()) {
                    return socket.emit('error', { message: 'It is not your turn.' });
                }
                if (move.position < 0 || move.position > 8) {
                    return socket.emit('error', { message: 'Invalid move position.' });
                }
                if (game.moves.some((m) => m.position === move.position)) {
                    return socket.emit('error', { message: 'Position already taken.' });
                }
                game.moves.push({
                    player: playerId,
                    position: move.position,
                    symbol: move.symbol,
                    timestamp: new Date(),
                });
                const [p1, p2] = game.players;
                game.currentTurn = game.currentTurn.toString() === p1.toString() ? p2 : p1;
                await game.save();
                io.to(roomId).emit('moveMade', {
                    playerId,
                    position: move.position,
                    symbol: move.symbol,
                    nextTurn: game.currentTurn,
                });
                const playerMoves = game.moves.filter((m) => m.player.toString() === playerId);
                const positions = playerMoves.map((m) => m.position);
                const hasWon = winningCombinations.some((pattern) =>
                    pattern.every((pos) => positions.includes(pos))
                );
                if (hasWon) {
                    game.status = 'completed';
                    game.winner = playerId;
                    game.endedAt = new Date();
                    game.reason = 'win';
                    await game.save();
                    io.to(roomId).emit('gameOver', {
                        winner: playerId,
                        message: `Player ${playerId} wins!`,
                    });
                } else if (game.moves.length === 9) {
                    game.status = 'completed';
                    game.winner = null;
                    game.endedAt = new Date();
                    game.reason = 'draw';
                    await game.save();
                    io.to(roomId).emit('gameOver', {
                        winner: null,
                        message: 'The game is a draw!',
                    });
                }
            } catch (error) {
                console.error('Error making move:', error);
                socket.emit('error', { message: 'Failed to make move.' });
            }
        });

        // Leave game
        socket.on('leaveGame', async (roomId, playerId) => {
            if (!mongoose.Types.ObjectId.isValid(playerId)) {
                return socket.emit('error', { message: 'Invalid player ID.' });
            }
            try {
                console.log(`Player ${socket.id} left the game in room ${roomId}`);
                socket.leave(roomId);
                socket.to(roomId).emit('playerLeft', playerId);
                const game = await Game.findOne({ roomId });
                if (!game) {
                    return socket.emit('error', { message: 'Game not found.' });
                }
                game.status = 'completed';
                game.reason = 'Player left';
                game.endedAt = new Date();
                game.players = game.players.filter((p) => p.toString() !== playerId.toString());
                if (game.players.length === 0) {
                    await Game.deleteOne({ roomId });
                } else {
                    await game.save();
                    io.to(roomId).emit('gameEnded', { message: 'Opponent left the game.' });
                }
            } catch (error) {
                console.error('Error leaving game:', error);
                socket.emit('error', { message: 'Failed to leave game.' });
            }
        });

        // Handle disconnect
        socket.on('disconnecting', async () => {
            const rooms = [...socket.rooms].filter((r) => r !== socket.id);
            for (const roomId of rooms) {
                socket.to(roomId).emit('playerLeft', socket.id);
                const game = await Game.findOne({ roomId });
                if (game) {
                    game.status = 'completed';
                    game.reason = 'Player disconnected';
                    game.endedAt = new Date();
                    game.players = game.players.filter((p) => p.toString() !== socket.id);
                    if (game.players.length === 0) {
                        await Game.deleteOne({ roomId });
                    } else {
                        await game.save();
                        io.to(roomId).emit('gameEnded', { message: 'Opponent disconnected.' });
                    }
                }
            }
        });
    });
};