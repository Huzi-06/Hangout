import { FiLogOut, FiUserPlus } from "react-icons/fi"
import { NotificationProps } from "../../interfaces"

const Notification = ({ text, type }: NotificationProps) => {
    return (
        <div className={`text-center py-3 px-6 text-sm font-medium flex items-center justify-center space-x-3 backdrop-blur-sm border-b border-indigo-100/30 ${type === "join" ? "bg-emerald-500/10 text-emerald-700" : type === "leave" ? "bg-amber-500/10 text-amber-700" : "bg-blue-500/10 text-blue-700"}`}>
            <div className={`p-1.5 rounded-full ${type === "join" ? "bg-emerald-100 text-emerald-600" : type === "leave" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
                {
                    type === "join" ? <FiUserPlus className="h-4 w-4" /> : <FiLogOut className="h-4 w-4" />
                }
            </div>
            <span className="font-semibold">{text}</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ${type === "join" ? "bg-emerald-500" : type === "leave" ? "bg-amber-500" : "bg-blue-500"}`}></div>
        </div>
    )
}

export default Notification
