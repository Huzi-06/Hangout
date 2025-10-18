import { useCallback, useEffect, useRef, useState } from "react"
import { ChatProps, Message, User, ScheduledMessage } from "../interfaces"
import { socket } from "../services/socket";
import { GetProfilePicture } from "../helpers";
import { schedulingService } from "../services/schedulingService";
import { useTheme } from "../App";
import Header from "./chat/Header";
import Notification from "./chat/Notification";
import Sidebar from "./chat/Sidebar";
import { FiSend, FiPaperclip, FiClock } from "react-icons/fi";
import MessageComp from "./chat/MessageComp";
import FileShare from "./chat/FileShare.tsx";
import ScheduleMessage from "./chat/ScheduleMessage";


const Chat = ({ currentUser, onLogout, onUpdateUser }: ChatProps & { onUpdateUser: (user: User) => void }) => {
    const { isDarkMode } = useTheme();
    console.log('🏠 Chat component rendering with user:', currentUser?.username)

    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([])
    const [notification, setNotification] = useState<{ text: string, type: "join" | "leave" | "message" } | null>(null)
    const [showFileShare, setShowFileShare] = useState(false)
    const [showScheduleMessage, setShowScheduleMessage] = useState(false)
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeoutRef = useRef<number | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sendScheduledMessage = useCallback((scheduledMessage: ScheduledMessage) => {
        try {
            console.log('🚀 Sending scheduled message:', scheduledMessage)
            console.log('🚀 Current user in callback:', !!currentUser)

            if (!currentUser) {
                console.error('❌ No current user when sending scheduled message')
                return
            }

            if (!scheduledMessage.message || !scheduledMessage.message.trim()) {
                console.error('❌ Scheduled message is empty')
                return
            }

            // Create the message object directly and emit it
            const messageData = {
                type: scheduledMessage.type || 'text',
                message: scheduledMessage.message.trim(),
                timestamp: new Date(),
                user: {
                    ...scheduledMessage.user,
                    id: socket.id, // Use current socket.id to show as "You"
                    profilePicture: currentUser?.profilePicture || GetProfilePicture(currentUser?.username || 'Unknown')
                },
                id: `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }

            console.log('📤 Broadcasting scheduled message directly:', messageData)

            // Broadcast directly to all clients (simulating server behavior)
            socket.emit("broadcastMessage", messageData)
            console.log('✅ Message broadcast completed')

            // Show notification that message was sent
            setNotification({
                text: `✅ Scheduled message sent: "${scheduledMessage.message}"`,
                type: "message"
            })

            console.log('🎉 Scheduled message sent successfully')
        } catch (error) {
            console.error('💥 Error sending scheduled message:', error)
            setNotification({
                text: "❌ Failed to send scheduled message",
                type: "message"
            })
        }
    }, [currentUser]) // Add currentUser as dependency

    // Page Scrolling Logic, so that when the new message comes the page get scrolled
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Notification Logic
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000);

            return () => clearTimeout(timer)
        }
    }, [notification])

    // Set up the message sender callback for scheduled messages
    useEffect(() => {
        console.log('🔗 Setting up message sender callback in Chat component')
        console.log('🔗 sendScheduledMessage function exists:', typeof sendScheduledMessage)
        console.log('🔗 Current user:', !!currentUser)

        if (currentUser) {
            console.log('🔗 Calling setMessageSender with function')
            schedulingService.setMessageSender(sendScheduledMessage)

            // Verify the callback was set correctly
            const hasCallback = schedulingService.hasMessageSender()
            console.log('✅ setMessageSender called successfully')
            console.log('🔍 Callback verification:', hasCallback)

            if (!hasCallback) {
                console.error('❌ Failed to set callback despite calling setMessageSender!')
            }
        } else {
            console.log('⚠️ Current user not available, skipping callback setup')
        }
    }, [currentUser, sendScheduledMessage]) // Added currentUser and sendScheduledMessage dependencies

    // Check for pending scheduled messages every 10 seconds (backup method) - COMPLETELY DISABLED
    useEffect(() => {
        // This was causing messages to be sent immediately when scheduled
        // Only the timer-based system should send messages
        console.log('📋 Backup checking completely disabled')
    }, [])

    useEffect(() => {
        // Connect socket when Chat component mounts
        if (!socket.connected) {
            socket.connect();
        }

        const handleConnect = () => {
            if (currentUser && currentUser.username) {
                // Join the chat with the username
                socket.emit("join", currentUser.username);
            }
        };

        const handleNewMessage = (newMessage: Message) => {
            // Ensure timestamp is a Date object
            const processedMessage: Message = {
                ...newMessage,
                timestamp: newMessage.timestamp instanceof Date ? newMessage.timestamp : new Date(newMessage.timestamp)
            }

            setMessages((prev) => {
                // Check if message already exists (avoid duplicates)
                const messageExists = prev.some(msg =>
                    msg.id === processedMessage.id ||
                    (msg.user.id === processedMessage.user.id &&
                     msg.message === processedMessage.message &&
                     Math.abs(msg.timestamp.getTime() - processedMessage.timestamp.getTime()) < 10000) // 10 second window
                );

                if (!messageExists) {
                    return [...prev, processedMessage];
                }

                return prev;
            });
        }

        const handleMessageHistory = (messageHistory: Message[]) => {
            // Ensure all timestamps are Date objects
            const processedHistory = messageHistory.map(msg => ({
                ...msg,
                timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
            }))
            setMessages(processedHistory)
        }

        const handleUserList = (userList: User[]) => {
            setUsers(userList)
        }

        const handleUserLeft = (username: string) => {
            setNotification({ text: `${username} left the chat`, type: "leave" })
        }

        const handleUserJoined = (username: string) => {
            setNotification({ text: `${username} joined the chat`, type: "join" })
        }

        const handleUserTyping = (data: { username: string, isTyping: boolean }) => {
            console.log('Received typing event:', data);
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                if (data.isTyping) {
                    newSet.add(data.username);
                } else {
                    newSet.delete(data.username);
                }
                return newSet;
            });
        }

        // Socket event listeners
        socket.on("connect", handleConnect);
        socket.on("newMessage", handleNewMessage)
        socket.on("broadcastMessage", handleNewMessage) // Listen for scheduled messages
        socket.on("messageHistory", handleMessageHistory)
        socket.on("userList", handleUserList)
        socket.on("userLeft", handleUserLeft)
        socket.on("userJoined", handleUserJoined)
        socket.on("userTyping", handleUserTyping)

        // Request initial data
        socket.emit("getMessageHistory")
        socket.emit("getUserList")

        return () => {
            socket.off("connect", handleConnect);
            socket.off("newMessage", handleNewMessage)
            socket.off("broadcastMessage", handleNewMessage)
            socket.off("messageHistory", handleMessageHistory)
            socket.off("userList", handleUserList)
            socket.off("userLeft", handleUserLeft)
            socket.off("userJoined", handleUserJoined)
            socket.off("userTyping", handleUserTyping)
        }
    }, [])

    // Update currentUser with socket ID when socket connects
    useEffect(() => {
        const handleConnect = () => {
            if (currentUser && currentUser.username && !currentUser.id) {
                // Update the current user with the actual socket ID and profile picture
                onUpdateUser({
                    ...currentUser,
                    id: socket.id,
                    profilePicture: GetProfilePicture(currentUser.username)
                });
            }
        };

        socket.on("connect", handleConnect);

        // If already connected, update immediately
        if (socket.connected && currentUser && currentUser.username && !currentUser.id) {
            onUpdateUser({
                ...currentUser,
                id: socket.id,
                profilePicture: GetProfilePicture(currentUser.username)
            });
        }

        return () => {
            socket.off("connect", handleConnect);
        };
    }, [currentUser, onUpdateUser])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() && currentUser) {
            const messageData = {
                type: 'text' as const,
                message: message.trim()
            }

            // Stop typing when message is sent
            handleStopTyping()

            // Send to server
            socket.emit("sendMessage", messageData)
            setMessage('')
        }
    }

    const handleStartTyping = () => {
        if (!isTyping && currentUser) {
            setIsTyping(true)
            console.log(`Emitting typing start for ${currentUser.username}`)
            socket.emit("typing", { username: currentUser.username, isTyping: true })
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Set new timeout to stop typing
        typingTimeoutRef.current = window.setTimeout(() => {
            handleStopTyping()
        }, 2000) // Stop typing after 2 seconds of inactivity
    }

    const handleStopTyping = () => {
        if (isTyping && currentUser) {
            setIsTyping(false)
            socket.emit("typing", { username: currentUser.username, isTyping: false })
        }

        // Clear timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)

        if (e.target.value.trim()) {
            handleStartTyping()
        } else {
            handleStopTyping()
        }
    }

    const handleScheduleMessage = (scheduledMessage: Omit<ScheduledMessage, 'id' | 'status' | 'createdAt'>) => {
        try {
            console.log('📅 Scheduling message:', scheduledMessage)
            console.log('⏰ Scheduled time:', scheduledMessage.scheduledTime.toISOString())
            console.log('⏰ Current time:', new Date().toISOString())

            // Schedule the message using the scheduling service
            const scheduled = schedulingService.scheduleMessage(scheduledMessage)
            console.log('✅ Message scheduled successfully:', scheduled)

            // Show success notification
            setNotification({
                text: `✅ Message scheduled for ${scheduledMessage.scheduledTime.toLocaleString()}`,
                type: "message"
            })

            // Close the schedule modal
            setShowScheduleMessage(false)
        } catch (error) {
            console.error('❌ Error scheduling message:', error)
            setNotification({
                text: "❌ Failed to schedule message. Please try again.",
                type: "message"
            })
        }
    }

    return (
        <div className={`flex flex-col h-screen relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'}`}>

            {/* Background Pattern */}
            <div className={`absolute inset-0 ${isDarkMode ? 'opacity-10' : 'opacity-30'}`}>
                <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,_${isDarkMode ? 'rgba(120,119,198,0.1)' : 'rgba(120,119,198,0.3)'},transparent_50%)] animate-pulse`}></div>
                <div className={`absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_${isDarkMode ? 'rgba(255,119,198,0.05)' : 'rgba(255,119,198,0.15)'},transparent_50%)] animate-pulse delay-1000`}></div>
            </div>

            {/* Header  */}
            {currentUser && <Header currentUser={currentUser} onLogout={onLogout} users={users} />}

            {/* Notification */}
            {
                notification && <Notification text={notification.text} type={notification.type} />
            }

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative z-10">

                {/* Sidebar */}
                {currentUser && <Sidebar currentUser={currentUser} users={users} />}

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-b from-gray-800/80 to-gray-900/50' : 'bg-gradient-to-b from-white/80 to-indigo-50/50'}`}>

                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {
                                messages.map(({ user, timestamp, message, type, fileUrl, fileName, fileSize, stickerUrl }, index) => (
                                    <div key={index} className={`flex ${user.id === socket.id ? "justify-end" : "justify-start"}`}>
                                        <MessageComp
                                            socket={socket}
                                            message={message}
                                            timestamp={timestamp}
                                            user={user}
                                            type={type}
                                            fileUrl={fileUrl}
                                            fileName={fileName}
                                            fileSize={fileSize}
                                            stickerUrl={stickerUrl}
                                        />
                                    </div>
                                ))
                            }
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Typing Indicator */}
                    {typingUsers.size > 0 && (
                        <div className={`px-6 py-2 border-t backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-700/60 border-gray-600/30' : 'bg-white/60 border-indigo-100/30'}`}>
                            <div className="max-w-4xl mx-auto">
                                <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <div className="flex space-x-1">
                                        <div className={`w-1 h-1 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                                        <div className={`w-1 h-1 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.1s' }}></div>
                                        <div className={`w-1 h-1 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span>
                                        {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message Input */}
                    <div className={`p-6 border-t backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-600/50' : 'bg-white/80 border-indigo-100/50'}`}>
                        <div className="max-w-4xl mx-auto space-y-3">
                            {/* Action Buttons */}
                            <div className="flex justify-start space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowFileShare(true)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300 hover:bg-gray-700/50' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'}`}
                                >
                                    <FiPaperclip className="h-4 w-4" />
                                    <span className="text-sm font-medium">Share</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        console.log('🕐 Schedule button clicked')
                                        setShowScheduleMessage(true)
                                    }}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'text-green-400 hover:text-green-300 hover:bg-gray-700/50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                                >
                                    <FiClock className="h-4 w-4" />
                                    <span className="text-sm font-medium">Schedule</span>
                                </button>
                            </div>

                            {/* Message Input Form */}
                            <form onSubmit={handleSendMessage}>
                                <div className="relative flex items-center group">
                                    <div className={`absolute inset-0 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? 'bg-gradient-to-r from-indigo-500/10 to-cyan-500/10' : 'bg-gradient-to-r from-indigo-500/10 to-cyan-500/10'}`}></div>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={handleInputChange}
                                        placeholder="Type your message..."
                                        className={`relative w-full px-6 py-4 backdrop-blur-sm border rounded-2xl pr-16 focus:outline-none focus:ring-2 transition-all duration-300 shadow-sm hover:shadow-md ${isDarkMode ? 'bg-gray-700/70 border-gray-600/50 focus:ring-indigo-500/50 focus:border-indigo-400 placeholder:text-gray-500' : 'bg-white/70 border-indigo-200/50 focus:ring-indigo-500/50 focus:border-indigo-400 placeholder:text-gray-400'}`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!message.trim()}
                                        className="absolute right-2 p-3 text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95"
                                    >
                                        <FiSend className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div>

            {/* File Share Modal */}
            {showFileShare && currentUser && (
                <FileShare
                    onClose={() => setShowFileShare(false)}
                    currentUser={currentUser}
                />
            )}

            {/* Schedule Message Modal */}
            {showScheduleMessage && currentUser && (
                <ScheduleMessage
                    onSchedule={handleScheduleMessage}
                    onClose={() => setShowScheduleMessage(false)}
                    currentUser={currentUser}
                />
            )}
        </div>
    )
}

export default Chat
