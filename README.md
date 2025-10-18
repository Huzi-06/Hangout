# Hangout - Real-Time Chat Application

A modern, feature-rich real-time chat application built with React, TypeScript, Node.js, and Socket.IO. Connect with friends instantly with a beautiful, responsive interface.

## ✨ Features

- **Real-time messaging** - Instant message delivery with Socket.IO
- **User authentication** - Simple username-based login system
- **File sharing** - Share images, documents, and other files
- **Scheduled messages** - Schedule messages to be sent at specific times
- **Dark mode** - Toggle between light and dark themes
- **Typing indicators** - See when others are typing
- **Message history** - Persistent message storage and retrieval
- **Profile pictures** - Auto-generated avatars based on usernames
- **Responsive design** - Works perfectly on desktop and mobile
- **Modern UI** - Beautiful gradient backgrounds and smooth animations
- **Error handling** - Robust error boundaries and user feedback

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- **Node.js** (v20.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 🛠️ Installation & Setup

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Huzi-06/Hangout.git
   cd Hangout
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server will run on `http://localhost:8080`

3. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Client will run on `http://localhost:5173`

4. **Open your browser**
   Navigate to `http://localhost:5173` and start chatting!

## 📁 Project Structure

```
Hangout/
├── client/                          # React frontend
│   ├── public/                     # Static assets
│   │   └── vite.svg               # Vite logo
│   ├── src/
│   │   ├── assets/                # React assets
│   │   │   └── react.svg         # React logo
│   │   ├── components/           # React components
│   │   │   ├── Chat.tsx         # Main chat interface
│   │   │   ├── Login.tsx        # User login component
│   │   │   └── chat/            # Chat-specific components
│   │   │       ├── FileShare.tsx     # File sharing functionality
│   │   │       ├── Header.tsx        # Chat header
│   │   │       ├── MessageComp.tsx   # Message display component
│   │   │       ├── Notification.tsx  # Notifications
│   │   │       ├── ScheduleMessage.tsx # Message scheduling
│   │   │       └── Sidebar.tsx       # User sidebar
│   │   ├── services/            # API services
│   │   │   ├── schedulingService.ts  # Message scheduling logic
│   │   │   └── socket.ts        # Socket.IO client setup
│   │   ├── App.tsx             # Main App component
│   │   ├── helpers.tsx         # Utility functions
│   │   ├── interfaces.ts       # TypeScript type definitions
│   │   ├── main.tsx           # React entry point
│   │   └── vite-env.d.ts      # Vite environment types
│   ├── eslint.config.js       # ESLint configuration
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   ├── tsconfig.*.json       # TypeScript configuration
│   └── vite.config.ts        # Vite configuration
│
└── server/                      # Node.js backend
    ├── src/
    │   ├── index.ts            # Server entry point
    │   └── interfaces.ts       # TypeScript interfaces
    ├── package.json           # Backend dependencies
    └── tsconfig.json          # TypeScript configuration
```

## 🎯 Usage

1. **Login** - Enter your desired username on the login screen
2. **View Profile** - See your auto-generated profile picture
3. **Start Chatting** - Send messages in real-time to all connected users
4. **Share Files** - Click the file share button to upload and share files
5. **Schedule Messages** - Use the scheduling feature to send messages later
6. **Toggle Theme** - Switch between light and dark modes
7. **See Typing** - Watch the typing indicators when others are typing

## 🔧 Development Scripts

### Client Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server Scripts
```bash
npm run dev      # Start development server with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm run start    # Start production server
```

## 🌟 Key Components

- **Login Component** - Beautiful animated login with gradient backgrounds
- **Chat Interface** - Full-featured chat with message history
- **Message Component** - Displays messages with file attachments and timestamps
- **File Share** - Handles file uploads and sharing
- **Schedule Messages** - Allows users to schedule messages for later delivery
- **Socket Service** - Manages real-time communication with the server

## 🔒 Security Features

- Input validation and sanitization
- Error boundaries for graceful error handling
- CORS configuration for secure cross-origin requests
- TypeScript for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request


## 🆘 Support

If you encounter any issues or need help:

1. Check the [Issues](../../issues) page for similar problems
2. Create a new issue with detailed information about your problem
3. Include error messages, steps to reproduce, and your environment details

## 🔄 Updates

The project uses Socket.IO for real-time communication and includes features like:
- Message persistence across sessions
- User presence indicators
- File upload and sharing capabilities
- Scheduled message delivery
- Dark/light theme switching

---

