// src/store/useGameStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';

const BASE_URL = 'http://localhost:5174';

export const useGameStore = create((set, get) => ({
  socket: null,
  roomId: null,
  playerId: null,
  opponentId: null,
  currentTurn: null,
  moves: [],
  gameStatus: 'idle',
  winner: null,

  connectSocket: () => {
    const player = useAuthStore.getState().authUser;
    if (!player) return toast.error('You must be logged in.');

    const socket = io(BASE_URL, { withCredentials: true });

    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
      set({ socket: null, gameStatus: 'idle' });
    });

    // Global error handler
    socket.on('error', (err) => toast.error(err.message || 'Socket error'));

    set({ socket, playerId: player._id });
  },

  createPrivateRoom: () => {
    const { socket, playerId } = get();
    if (!socket || !playerId) return toast.error('Socket or player not initialized');
    socket.emit('createPrivateRoom', { playerId });

    socket.once('roomCreated', ({ roomId, players }) => {
      set({ roomId, moves: [], currentTurn: null, gameStatus: 'waiting', opponentId: null });
      toast.success(`Room ${roomId} created`);
    });
  },

  joinPrivateRoom: (roomId) => {
    const { socket, playerId } = get();
    if (!socket || !roomId) return toast.error('Invalid socket or room ID');
    socket.emit('joinPrivateRoom', { roomId, playerId });

    socket.once('roomJoined', ({ roomId, players }) => {
      const opponentId = players.find(p => p !== playerId);
      set({ roomId, opponentId, gameStatus: players.length === 2 ? 'in-progress' : 'waiting' });
    });

    socket.on('playerJoined', (opponentId) => {
      set({ opponentId, gameStatus: 'in-progress' });
      toast.success('Opponent joined!');
    });
  },

  quickMatch: () => {
    const { socket, playerId } = get();
    if (!socket) return toast.error('Not connected');
    socket.emit('quickMatch', { playerId });

    socket.on('roomJoined', ({ roomId, players }) => {
      const opponentId = players.find(p => p !== playerId);
      set({ roomId, opponentId, gameStatus: players.length === 2 ? 'in-progress' : 'waiting' });
    });

    socket.on('playerJoined', (opponentId) => {
      set({ opponentId, gameStatus: 'in-progress' });
    });
  },

  makeMove: (position, symbol) => {
    const { socket, playerId, roomId } = get();
    if (!socket || !roomId) return toast.error('Game not initialized');
    socket.emit('makeMove', playerId, roomId, { position, symbol });
  },

  listenForMoves: () => {
    const { socket } = get();
    if (!socket) return;

    socket.on('moveMade', ({ playerId, position, symbol, nextTurn }) => {
      set((state) => ({
        moves: [...state.moves, { playerId, position, symbol }],
        currentTurn: nextTurn,
      }));
    });

    socket.on('gameOver', ({ winner, message }) => {
      set({ gameStatus: 'completed', winner });
      toast.success(message);
    });

    socket.on('playerLeft', () => {
      set({ gameStatus: 'completed' });
      toast.error('Your opponent left the game');
    });
  },

  leaveGame: () => {
    const { socket, roomId, playerId } = get();
    if (socket && roomId) {
      socket.emit('leaveGame', roomId, playerId);
      socket.disconnect();
    }
    set({ socket: null, roomId: null, gameStatus: 'idle', moves: [], opponentId: null });
  },

  resetGame: () => set({
    socket: null,
    roomId: null,
    playerId: null,
    opponentId: null,
    currentTurn: null,
    moves: [],
    gameStatus: 'idle',
    winner: null,
  })
}));

export default useGameStore;
