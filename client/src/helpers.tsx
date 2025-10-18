export const GetUserIcon = ({ name, size = 8, profilePicture }: { name: any, size: number, profilePicture?: string }) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"]
    const firstLetter = name.charAt(0).toUpperCase();
    const colorIndex = firstLetter.charCodeAt(0) % colors.length

    const sizeClasses = {
        7: "w-7 h-7",
        8: 'w-8 h-8',
        10: 'w-10 h-10',
        12: 'w-12 h-12'
    }[size] || "w-8 h-8"

    // If profile picture exists, use it
    if (profilePicture) {
        return <img
            src={profilePicture}
            alt={`${name}'s profile`}
            className={`${sizeClasses} rounded-full object-cover border-2 border-white shadow-sm`}
        />
    }

    // Otherwise, use the colored avatar with initials
    return <div className={`${colors[colorIndex]} ${sizeClasses} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
        {firstLetter}
    </div>
}

export const GetProfilePicture = (username: string): string => {
    // For demo purposes, we'll use Robohash.org to generate avatars
    // In a real app, you'd upload and store actual profile pictures
    return `https://robohash.org/${encodeURIComponent(username)}.png?size=100x100&set=set3`
}
