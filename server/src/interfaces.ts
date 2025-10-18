export interface User {
    id: string,
    username: string,
    profilePicture?: string
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

export interface ChatRoom {
    id: string,
    name: string,
    description: string,
    accessCode: string,
    isPrivate: boolean,
    createdAt: Date,
    memberCount: number
}
