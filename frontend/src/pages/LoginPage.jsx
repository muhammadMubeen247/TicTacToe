import React from 'react'
import { useState } from 'react'
import useAuthStore from '../store/useAuthStore' 
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoggingIn } = useAuthStore()
  const handleLogin = async (e) => {
    e.preventDefault()
    await login(email, password)
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-4 border-blue-600 relative">
        {/* Tic-Tac-Toe grid background effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-3 gap-1 h-full">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          <span className="text-red-500">X</span> Login <span className="text-green-500">O</span>
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoggingIn}
            className={`cursor-pointer w-full py-3 px-4 rounded-md text-white font-bold text-lg transition-colors duration-200 ${
              isLoggingIn
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } flex items-center justify-center space-x-2`}
          >
            <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
            {!isLoggingIn && (
              <span className="text-2xl">❌</span>
            )}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up <span className="text-green-500">O</span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage