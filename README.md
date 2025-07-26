# Tic Tac Toe Game

A multiplayer Tic Tac Toe game built with Node.js, Express, Socket.IO, and React.

## Project Structure

```
.
├── backend/                 # Backend server code
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── lib/           # Utility functions
│   │   └── middleware/    # Express middleware
│   └── package.json
└── frontend/              # Frontend React application
```

## Features

- User authentication (register/login)
- Real-time gameplay using Socket.IO
- JWT-based authentication
- MongoDB database integration

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd tic-tac-toe
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the backend server
```bash
npm start
```

5. Install and start the frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
