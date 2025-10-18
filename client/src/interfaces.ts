export interface User {
    id: string,
    username: string,
    profilePicture?: string,
}

export interface LoginProps {
    onLogin: (username: string) => void
}

export interface ChatProps {
    currentUser: User | null,
    onLogout: (username: string) => void
}

export interface Message {
    id: string,
    user: User,
    message?: string,
    type: 'text' | 'image' | 'file' | 'voice' | 'sticker',
    timestamp: Date,
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    stickerUrl?: string
}

export interface HeaderProps {
    currentUser: User | null,
    users: User[],
    onLogout: (username: string) => void
}

export interface NotificationProps {
    type: "join" | "leave" | "message",
    text: string
}

export interface SidebarProps {
    users: User[],
    currentUser: User
}

export interface MessageCompProps {
    user: User,
    socket: any,
    message?: string,
    timestamp: Date,
    type?: 'text' | 'image' | 'file' | 'voice' | 'sticker',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    stickerUrl?: string
}

export interface ScheduledMessage {
    id: string
    user: User
    message: string
    type: 'text' | 'image' | 'file' | 'voice' | 'sticker'
    scheduledTime: Date
    recipient?: string // optional: send to specific user
    isRecurring?: boolean
    recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'yearly'
    fileUrl?: string
    fileName?: string
    stickerUrl?: string
    status: 'pending' | 'sent' | 'failed'
    createdAt: Date
    sentAt?: Date // when the message was actually sent
}

export interface ScheduleMessageProps {
    onSchedule: (scheduledMessage: Omit<ScheduledMessage, 'id' | 'status' | 'createdAt'>) => void
    onClose: () => void
    currentUser: User
}
