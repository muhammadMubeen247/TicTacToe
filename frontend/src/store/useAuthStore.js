import {create} from 'zustand';
import axiosInstance from '../services/axios.js';
import { Toaster,toast } from 'sonner';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/checkAuth');
            set({
                authUser: res.data,
                isCheckingAuth: false
            });
        } catch (error) {
            set({
                authUser: null,
                isCheckingAuth: false
            });
            if (error.response?.status !== 401) { // Don't show error for unauthorized
            toast.error(error.response?.data?.message || 'Error checking authentication');
            }
        }
    },
    login: async (email, password) => {
        set({ isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            set({
                authUser: res.data.player,
                isLoggingIn: false
            });
            toast.success('Logged in successfully');
            console.log('Login successful:', res.data);
        } catch (error) {
            set({
                authUser: null,
                isLoggingIn: false
            });
            console.error('Error logging in:', error);
            toast.error('Error logging in');
        }
    },
    signup: async (username, email, password, confirmPassword) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/register', { username, email, password,confirmPassword });
            set({
                authUser: res.data.player,
                isSigningUp: false
            });
            toast.success('Signed up successfully');
            console.log('Signup successful:', res.data);
        } catch (error) {
            set({
                authUser: null,
                isSigningUp: false
            });
            console.error('Error signing up:', error);
            toast.error('Error signing up');
        }
    },
    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post('/auth/logout');
            set({
                authUser: null,
                isLoggingOut: false
            });
            toast.success('Logged out successfully');
            console.log('Logout successful');
        } catch (error) {
            set({
                authUser: null,
                isLoggingOut: false
            });
            console.error('Error logging out:', error);
            toast.error('Error logging out');
        }
    }
}));

export default useAuthStore;
