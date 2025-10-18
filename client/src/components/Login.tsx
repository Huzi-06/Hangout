import { useState } from "react"
import { LoginProps } from "../interfaces";
import { GetUserIcon, GetProfilePicture } from "../helpers";

const Login = ({ onLogin }: LoginProps) => {

    const [username, setUsername] = useState<string>("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-10">

                {/* Animated gradient border */}
                <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"></div>

                <div className="px-8 py-12">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Hangout</h1>
                        <p className="text-white/70">Connect with friends instantly</p>
                    </div>

                    {/* Profile Picture Preview */}
                    {username && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="text-center">
                                <p className="text-sm font-medium text-white/80 mb-3">Your Profile Picture</p>
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <GetUserIcon
                                            name={username}
                                            size={12}
                                            profilePicture={GetProfilePicture(username)}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-white/60 mt-2">Auto-generated from your username</p>
                            </div>
                        </div>
                    )}

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-white/90">Choose your username</label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your cool username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="relative w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300 text-white placeholder:text-white/50"
                                    required
                                />
                                {username && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={!username.trim()}
                            type="submit"
                            className="relative w-full px-4 py-4 text-white font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative flex items-center justify-center space-x-2">
                                <span>Join Chat</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                        <p className="text-center text-sm text-white/60">
                            By joining, you agree to our{' '}
                            <a href="#" className="text-pink-300 hover:text-pink-200 underline decoration-pink-300/50 underline-offset-2 transition-colors">Terms</a>
                            {' '}and{' '}
                            <a href="#" className="text-pink-300 hover:text-pink-200 underline decoration-pink-300/50 underline-offset-2 transition-colors">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
