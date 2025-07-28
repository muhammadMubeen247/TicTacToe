import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore.js'
import { toast } from 'sonner'

const SignUpPage = () => {
  const navigate = useNavigate()
  const { signup, isSigningUp } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () =>{
    const { username, email, password, confirmPassword } = formData
    if (!username || !email || !password || !confirmPassword) {
      toast.error('All fields are required')
      return false
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return
    const { username, email, password, confirmPassword } = formData
    const success = await signup(username, email, password, confirmPassword)
    if (success) {
      navigate('/')
    }
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
          <span className="text-red-500">X</span> Sign Up <span className="text-green-500">O</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSigningUp}
            className={`w-full py-3 px-4 rounded-md text-white font-bold text-lg transition-colors duration-200 ${
              isSigningUp
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } flex items-center justify-center space-x-2`}
          >
            <span>{isSigningUp ? 'Signing up...' : 'Sign Up'}</span>
            {!isSigningUp && (
              <span className="text-2xl">⭕</span>
            )}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Log in <span className="text-red-500">X</span>
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage