import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"
import cors from "cors"
import { Message, User } from "./interfaces";

const app = express();
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

const users = new Map<string, User>();
const messages: Message[] = []

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (username: string) => {
        users.set(socket.id, { id: socket.id, username: username });
        socket.emit("userList", Array.from(users.values())) // Broadcast to ALL clients
        socket.emit("userJoined", username); // Broadcast to ALL clients
        socket.emit("messageHistory", messages) // Send to just this socket
    })

    socket.on("getMessageHistory", () => {
        socket.emit("messageHistory", messages)
    })

    socket.on("getUserList", () => {
        socket.emit("userList", Array.from(users.values()))
    })

    socket.on("sendMessage", (messageData: any) => {
        const user = users.get(socket.id);
        if (user) {
            const msg: Message = {
                id: `${socket.id}_${Date.now()}`,
                user,
                type: messageData.type || 'text',
                timestamp: new Date(),
                message: messageData.message,
                fileUrl: messageData.fileUrl,
                fileName: messageData.fileName,
                fileSize: messageData.fileSize,
                stickerUrl: messageData.stickerUrl
            }
            messages.push(msg)
            io.emit("newMessage", msg)
        }
    })

    socket.on("broadcastMessage", (messageData: any) => {
        // Handle scheduled messages - broadcast without requiring a valid user session
        const msg: Message = {
            id: messageData.id || `${socket.id}_${Date.now()}`,
            user: messageData.user,
            type: messageData.type || 'text',
            timestamp: new Date(messageData.timestamp),
            message: messageData.message,
            fileUrl: messageData.fileUrl,
            fileName: messageData.fileName,
            fileSize: messageData.fileSize,
            stickerUrl: messageData.stickerUrl
        }
        messages.push(msg)
        io.emit("broadcastMessage", msg) // Broadcast as broadcastMessage to match client listener
        io.emit("newMessage", msg) // Also broadcast as newMessage for consistency
    })

    socket.on("typing", (data: { username: string, isTyping: boolean }) => {
        console.log(`User ${data.username} typing: ${data.isTyping}`);
        // Broadcast typing status to all other clients (not the sender)
        socket.broadcast.emit("userTyping", data);
    })

    socket.on("disconnect", () => {
        const user = users.get(socket.id)
        if (user) {
            console.log(`${user.username} left the chat`);
            users.delete(socket.id);
            io.emit("userList", Array.from(users.values()));
            io.emit("userLeft", user.username)
        }
    })
})

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
