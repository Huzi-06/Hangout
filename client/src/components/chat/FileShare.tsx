import { useState, useRef } from "react"
import { FiX, FiImage, FiSmile, FiPlus } from "react-icons/fi"
import { socket } from "../../services/socket"

interface FileShareProps {
    onClose: () => void
    currentUser: { id: string; username: string }
}

const FileShare = ({ onClose }: FileShareProps) => {
    const [isUploading, setIsUploading] = useState(false)
    const [activeTab, setActiveTab] = useState<'main' | 'stickers' | 'upload'>('main')
    const imageInputRef = useRef<HTMLInputElement>(null)
    const stickerInputRef = useRef<HTMLInputElement>(null)

    // Predefined sticker collection
    const defaultStickers = [
        '😀', '😂', '😊', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤔',
        '😎', '😮', '😯', '😪', '😴', '🤯', '🥴', '😵', '🤐', '🥺', '😳', '😨',
        '👍', '👎', '👌', '✌️', '🤞', '👏', '🙌', '🤝', '🙏', '💪', '🦵', '🦶',
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
        '🎉', '🎊', '🎈', '🎁', '🎂', '🍰', '🧁', '🍭', '🍬', '🍫', '🍿', '🍩'
    ]

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setIsUploading(true)
            try {
                const fileUrl = URL.createObjectURL(file)
                const messageData = {
                    type: 'image' as const,
                    fileUrl,
                    fileName: file.name,
                    fileSize: file.size,
                    message: `Shared a photo: ${file.name}`
                }
                socket.emit("sendMessage", messageData)
                onClose()
            } catch (error) {
                console.error('Error uploading image:', error)
                alert('Error uploading image. Please try again.')
            } finally {
                setIsUploading(false)
            }
        }
    }



    const handleStickerSelect = (sticker?: string) => {
        if (sticker) {
            // Send selected sticker
            const messageData = {
                type: 'sticker' as const,
                message: sticker,
                stickerUrl: '' // For emoji stickers, we don't need a URL
            }
            socket.emit("sendMessage", messageData)
            onClose()
        } else {
            // Show sticker picker
            setActiveTab('stickers')
        }
    }

    const handleCustomStickerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setIsUploading(true)
            try {
                const stickerUrl = URL.createObjectURL(file)
                const messageData = {
                    type: 'sticker' as const,
                    message: `Custom sticker: ${file.name}`,
                    stickerUrl,
                    fileName: file.name
                }
                socket.emit("sendMessage", messageData)
                onClose()
            } catch (error) {
                console.error('Error uploading sticker:', error)
                alert('Error uploading sticker. Please try again.')
            } finally {
                setIsUploading(false)
            }
        }
    }

    const sendEmojiSticker = (emoji: string) => {
        const messageData = {
            type: 'sticker' as const,
            message: emoji, // The emoji itself is the message
            stickerUrl: '' // For emoji stickers, we don't need a URL
        }
        socket.emit("sendMessage", messageData)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Share Content</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {activeTab === 'main' && (
                        <>
                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 gap-3">
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl border border-green-200/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <FiImage className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Photos</span>
                                </button>
                            </div>

                            {/* Additional Options */}
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => handleStickerSelect()}
                                    className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 rounded-2xl border border-yellow-200/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                                        <FiSmile className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Stickers</span>
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'stickers' && (
                        <>
                            {/* Sticker Picker Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Choose a Sticker</h4>
                                <button
                                    onClick={() => setActiveTab('main')}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Emoji Stickers */}
                            <div className="space-y-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Emoji Stickers</div>
                                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                                    {defaultStickers.map((sticker, index) => (
                                        <button
                                            key={index}
                                            onClick={() => sendEmojiSticker(sticker)}
                                            className="flex items-center justify-center w-12 h-12 text-2xl hover:bg-gray-100 rounded-xl transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                                            title={`Send ${sticker} sticker`}
                                        >
                                            {sticker}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Sticker Upload */}
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="text-sm font-medium text-gray-700 mb-2">Upload Custom Sticker</div>
                                <input
                                    ref={stickerInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCustomStickerUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => stickerInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex items-center space-x-3 w-full p-4 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl border border-indigo-200/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                                        <FiPlus className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium text-gray-700">Upload Custom Sticker</div>
                                        <div className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</div>
                                    </div>
                                </button>
                            </div>
                        </>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="flex items-center justify-center space-x-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                            <span className="text-sm font-medium text-indigo-700">Uploading...</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FileShare
