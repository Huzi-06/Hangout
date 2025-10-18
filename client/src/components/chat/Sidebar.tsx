import { GetUserIcon, GetProfilePicture } from "../../helpers"
import { SidebarProps } from "../../interfaces"
import { useTheme } from "../../App"

const Sidebar = ({ users, currentUser }: SidebarProps) => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`hidden md:block w-72 backdrop-blur-xl border-r shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-blue-900/50 border-blue-700/50' : 'bg-white/50 border-indigo-100/50'}`}>
            <div className="p-6">
                <div className="mb-6">
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-indigo-600'}`}>Active Members</h3>
                    <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>{users.length} online</span>
                    </div>
                </div>

                <div className="space-y-2">
                    {
                        users.map((user) => (
                            <div key={user.id} className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${user.id === currentUser.id ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg" : isDarkMode ? "text-blue-200 hover:bg-gradient-to-r hover:from-blue-800/50 hover:to-cyan-800/50 hover:shadow-md" : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 hover:shadow-md"}`}>
                                <div className="relative flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full p-0.5 transition-colors duration-300 ${user.id === currentUser.id ? "bg-white/20" : isDarkMode ? "bg-gradient-to-br from-blue-600 to-cyan-600" : "bg-gradient-to-br from-indigo-200 to-cyan-200"}`}>
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <GetUserIcon
                                                name={user.username}
                                                size={10}
                                                profilePicture={user.profilePicture || GetProfilePicture(user.username)}
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate transition-colors duration-300 ${user.id === currentUser.id ? "text-white" : isDarkMode ? "text-blue-100 group-hover:text-blue-300" : "text-gray-800 group-hover:text-indigo-700"}`}>
                                        {user.username}
                                        {user.id === currentUser.id && " (You)"}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.id === currentUser.id ? "bg-white/60" : "bg-emerald-400"}`}></div>
                                        <span className={`text-xs transition-colors duration-300 ${user.id === currentUser.id ? "text-white/70" : isDarkMode ? "text-blue-300" : "text-gray-500"}`}>Online</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar
