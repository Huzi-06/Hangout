import { useState, Component, ErrorInfo, ReactNode, createContext, useContext, useEffect } from "react";
import { User } from "./interfaces";
import { socket } from "./services/socket";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { GetProfilePicture } from "./helpers";

// Dark Mode Context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              The application encountered an error. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('hangout-theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  // Apply theme to document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hangout-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hangout-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogin = (username: string) => {
    try {
      // Don't set user ID here - let the socket connection handle it
      setCurrentUser({ id: '', username: username });
    } catch (error) {
      console.error('Login error:', error);
      setCurrentUser({ id: '', username: username });
    }
  }

  const handleLogout = (username: string) => {
    socket.emit("userLeft", username);
    socket.disconnect();
    setCurrentUser(null);
  }

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ErrorBoundary>
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col`}>
          {
            !currentUser ? <Login onLogin={handleLogin} /> : <Chat currentUser={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
          }
        </div>
      </ErrorBoundary>
    </ThemeContext.Provider>
  );
}

export default App;
