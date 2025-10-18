import { RiMessage2Fill } from "react-icons/ri"
import { HeaderProps } from "../../interfaces"
import { GetUserIcon, GetProfilePicture } from "../../helpers"
import { FiLogOut, FiSun, FiMoon, FiArrowLeft } from "react-icons/fi"
import { BsCircleFill } from "react-icons/bs"
import { useTheme } from "../../App"

const Header = ({ currentUser, users, onLogout }: HeaderProps) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <header className={`backdrop-blur-xl border-b shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-indigo-100/50'}`}>
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* App Brand */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-3 rounded-2xl shadow-xl shadow-indigo-500/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                            <RiMessage2Fill className="h-6 w-6 text-white relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Hangout</h1>
                            <p className="text-xs text-gray-500 -mt-1">Real-time messaging</p>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-full transition-all duration-200 ${isDarkMode ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                        </button>

                        <div className={`flex items-center space-x-3 px-4 py-2.5 rounded-full border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50' : 'bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-100/50'}`}>
                            <div className="relative">
                                <GetUserIcon
                                    name={currentUser?.username || ''}
                                    size={8}
                                    profilePicture={currentUser?.profilePicture || GetProfilePicture(currentUser?.username || '')}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{currentUser?.username}</span>
                        </div>

                        <button
                            onClick={() => onLogout(currentUser?.username || "")}
                            className={`p-2.5 rounded-full transition-all duration-200 group ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                        >
                            <FiLogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Online Users Bar */}
            <div className={`px-6 py-3 border-t flex items-center space-x-3 overflow-x-auto backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/30' : 'bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 border-indigo-100/30'}`}>
                <div className="flex -space-x-2 mr-4">
                    {
                        users.slice(0, 6).map((user) => {
                            return (
                                <div key={user.id} className="relative group">
                                    <div className={`w-9 h-9 rounded-full shadow-md transition-all duration-200 ${isDarkMode ? 'ring-gray-600 hover:ring-gray-500' : 'ring-white hover:ring-indigo-200'}`}>
                                        <GetUserIcon
                                            name={user.username}
                                            size={9}
                                            profilePicture={user.profilePicture || GetProfilePicture(user.username)}
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                </div>
                            )
                        })
                    }

                    {
                        users.length > 6 && <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ${isDarkMode ? 'ring-gray-600 bg-gray-600' : 'ring-white bg-gradient-to-br from-indigo-100 to-cyan-100'}`}>
                            <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-indigo-600'}`}>+{users.length - 6}</span>
                        </div>
                    }
                </div>
                <div className={`h-5 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-indigo-200'}`}></div>
                <span className={`text-sm flex items-center font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-indigo-600'}`}>
                    <BsCircleFill className="h-2.5 w-2.5 text-emerald-500 mr-2 animate-pulse" />
                    {users.length} online
                </span>
            </div>
        </header>
    )
}

export default Header
