import { BsCheck2All, BsDownload } from "react-icons/bs"
import { GetUserIcon, GetProfilePicture } from "../../helpers"
import { MessageCompProps } from "../../interfaces"
import { useTheme } from "../../App"

const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}





const getDefaultFileName = (fileName: string | undefined, type: string) => {
    if (fileName) return fileName

    switch (type) {
        case 'image':
            return 'image.png'
        case 'file':
            return 'download'
        case 'sticker':
            return 'sticker.png'
        default:
            return 'download'
    }
}

const MessageComp = ({
    user,
    message,
    timestamp,
    socket,
    type = 'text',
    fileUrl,
    fileName,
    stickerUrl
}: MessageCompProps) => {
    const { isDarkMode } = useTheme();

    const renderMessageContent = () => {
        switch (type) {
            case 'image':
                const handleImageDownload = () => {
                    if (fileUrl && fileUrl !== '#' && fileUrl.startsWith('blob:')) {
                        try {
                            // For blob URLs, create a temporary download link
                            const link = document.createElement('a')
                            link.href = fileUrl
                            link.download = getDefaultFileName(fileName, 'image')
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        } catch (error) {
                            console.error('Error downloading image:', error)
                            alert('Error downloading image. Please try again.')
                        }
                    } else {
                        // For demo purposes, show a message that download isn't available
                        alert('Image download is not available in this demo. In a real application, the image would be uploaded to a server and a permanent download link would be provided.')
                    }
                }

                return (
                    <div className="space-y-2">
                        <div className="relative group">
                            <img
                                src={fileUrl}
                                alt={fileName || "Shared image"}
                                className="max-w-xs rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                onError={(e) => {
                                    console.error('Error loading image:', e)
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200"></div>

                            {/* Download button overlay */}
                            <button
                                onClick={handleImageDownload}
                                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="Download image"
                            >
                                <BsDownload className="h-4 w-4" />
                            </button>
                        </div>
                        {message && <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{message}</p>}
                    </div>
                )





            case 'sticker':
                const handleStickerDownload = () => {
                    if (stickerUrl && stickerUrl !== '#' && stickerUrl.startsWith('blob:')) {
                        try {
                            // For blob URLs, create a temporary download link
                            const link = document.createElement('a')
                            link.href = stickerUrl
                            link.download = getDefaultFileName(fileName, 'sticker')
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        } catch (error) {
                            console.error('Error downloading sticker:', error)
                            alert('Error downloading sticker. Please try again.')
                        }
                    } else {
                        // For demo purposes, show a message that download isn't available
                        alert('Sticker download is not available in this demo. In a real application, the sticker would be uploaded to a server and a permanent download link would be provided.')
                    }
                }

                // Check if it's an emoji sticker (no URL) or custom sticker (has URL)
                const isEmojiSticker = !stickerUrl || stickerUrl === ''

                return (
                    <div className="space-y-2">
                        <div className={`relative group flex justify-center ${!isEmojiSticker ? '' : 'p-4 rounded-lg border transition-colors duration-300 ' + (isDarkMode ? 'bg-gray-700/10 border-gray-600/20' : 'bg-white/10 border-white/20')}`}>
                            {isEmojiSticker ? (
                                // Emoji sticker - display as medium text
                                <div className="text-4xl select-none">
                                    {message}
                                </div>
                            ) : (
                                // Custom sticker - display as image
                                <img
                                    src={stickerUrl}
                                    alt="Custom sticker"
                                    className="w-32 h-32 object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                />
                            )}

                            {/* Download button overlay for custom stickers only */}
                            {!isEmojiSticker && (
                                <button
                                    onClick={handleStickerDownload}
                                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    title="Download sticker"
                                >
                                    <BsDownload className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {/* Only show message text if it's not an emoji sticker (to avoid duplication) */}
                        {!isEmojiSticker && message && <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{message}</p>}
                    </div>
                )

            default: // text
                return <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{message}</p>
        }
    }

    return (
        <div className={`flex ${user.id === socket.id ? "flex-row-reverse" : ""} space-x-3 max-w-sm md:max-w-md`}>
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <GetUserIcon
                            name={user.username}
                            size={10}
                            profilePicture={user.profilePicture || GetProfilePicture(user.username)}
                        />
                    </div>
                </div>
            </div>
            <div className={`max-w-xs lg:max-w-md ${user.id === socket.id ? "mr-2" : "ml-2"}`}>
                <div className={`relative p-4 shadow-lg ${user.id === socket.id ? "bg-gradient-to-br from-indigo-500 to-cyan-500 text-white rounded-2xl rounded-br-md" : "backdrop-blur-sm border rounded-2xl rounded-bl-md transition-colors duration-300 " + (isDarkMode ? "bg-gray-800/80 border-gray-600/50 text-gray-100" : "bg-white/80 border-indigo-100/50 text-gray-800")}`}>
                    {/* Message tail */}
                    <div className={`absolute top-4 w-3 h-3 ${user.id === socket.id ? "right-0 bg-gradient-to-br from-indigo-500 to-cyan-500 transform rotate-45 -mr-1" : "left-0 transform rotate-45 -ml-1 " + (isDarkMode ? "bg-gray-800 border-l border-t border-gray-600" : "bg-white border-l border-t border-indigo-100/50")}`}></div>

                    <div className="flex items-baseline space-x-2 mb-2 pr-8">
                        <span className={`text-xs font-semibold ${user.id === socket.id ? "text-white/90" : "text-indigo-600"}`}>
                            {user.username}
                            {user.id === socket.id && " (You)"}
                        </span>
                        <span className={`text-xs ${user.id === socket.id ? "text-white/70" : isDarkMode ? "text-gray-300" : "text-gray-400"}`}>
                            {formatTime(timestamp)}
                        </span>
                    </div>

                    {renderMessageContent()}

                    {
                        user.id === socket.id && <div className="flex justify-end mt-2">
                            <BsCheck2All className="h-4 w-4 text-white/80" />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default MessageComp
