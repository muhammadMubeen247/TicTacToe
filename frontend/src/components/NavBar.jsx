import React from 'react'
import useAuthStore from '../store/useAuthStore'

const NavBar = () => {
  const { authUser, logout } = useAuthStore()
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Title with Tic-Tac-Toe theme */}
          <h1 className="text-2xl font-bold text-white">
            <span className="text-red-500">X</span> Tic Tac Toe <span className="text-green-500">O</span>
          </h1>
          
          {/* Logout Button (visible when authenticated) */}
          {authUser && (
            <button
              onClick={logout}
              className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-md border-2 border-blue-300 hover:bg-blue-100 hover:border-blue-500 transition-colors duration-200"
            >
              <span>Logout</span>
              <span className="text-xl">❌</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Subtle Tic-Tac-Toe grid background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-12 gap-1 h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border border-white"></div>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar