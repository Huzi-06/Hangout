import React, { useState } from 'react'
import { FiX, FiClock, FiRepeat, FiCalendar, FiMessageSquare } from 'react-icons/fi'
import { ScheduleMessageProps, ScheduledMessage } from '../../interfaces'
import { schedulingService } from '../../services/schedulingService'

const ScheduleMessage: React.FC<ScheduleMessageProps> = ({
    onSchedule,
    onClose,
    currentUser
}) => {
    const [message, setMessage] = useState('')
    const [scheduledDate, setScheduledDate] = useState('')
    const [scheduledTime, setScheduledTime] = useState('')

    const [isRecurring, setIsRecurring] = useState(false)
    const [recurrencePattern, setRecurrencePattern] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')
    const [errors, setErrors] = useState<string[]>([])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('📋 Form submitted')
        setErrors([])

        // Validation
        const validationErrors: string[] = []

        if (!message.trim()) {
            validationErrors.push('Message is required')
        }

        if (!scheduledDate || !scheduledTime) {
            validationErrors.push('Date and time are required')
        }

        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
        console.log('📅 Parsed datetime:', scheduledDateTime)

        const validation = schedulingService.validateScheduledTime(scheduledDateTime)
        console.log('✅ Validation result:', validation)

        if (!validation.valid) {
            validationErrors.push(validation.error || 'Invalid scheduled time')
        }

        if (validationErrors.length > 0) {
            console.log('❌ Validation errors:', validationErrors)
            setErrors(validationErrors)
            return
        }

        // Create scheduled message
        const scheduledMessage: Omit<ScheduledMessage, 'id' | 'status' | 'createdAt'> = {
            user: currentUser,
            message: message.trim(),
            type: 'text',
            scheduledTime: scheduledDateTime,
            isRecurring,
            recurrencePattern: isRecurring ? recurrencePattern : undefined
        }

        console.log('📦 Calling onSchedule with:', scheduledMessage)
        onSchedule(scheduledMessage)
    }

    const getMinDateTime = () => {
        const now = new Date()
        const minTime = new Date(now.getTime() + 30000) // At least 30 seconds in the future for testing
        return minTime.toISOString().slice(0, 16)
    }

    const getCurrentDateTime = () => {
        const now = new Date()
        return now.toISOString().slice(0, 16)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform animate-slide-up max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl">
                            <FiClock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Schedule Message</h3>
                            <p className="text-sm text-gray-600">Send a message at a specific time</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Error Messages */}
                        {errors.length > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</div>
                                <ul className="text-sm text-red-700 space-y-1">
                                    {errors.map((error, index) => (
                                        <li key={index}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FiMessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FiCalendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Time <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FiClock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="time"
                                            value={scheduledTime}
                                            onChange={(e) => setScheduledTime(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>



                        {/* Recurring Options */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isRecurring"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="isRecurring" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <FiRepeat className="h-4 w-4" />
                                    <span>Recurring message</span>
                                </label>
                            </div>

                            {isRecurring && (
                                <div className="ml-7 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Repeat every:
                                    </label>
                                    <select
                                        value={recurrencePattern}
                                        onChange={(e) => setRecurrencePattern(e.target.value as any)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="daily">Day</option>
                                        <option value="weekly">Week</option>
                                        <option value="monthly">Month</option>
                                        <option value="yearly">Year</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Preview */}
                        {message && scheduledDate && scheduledTime && (
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="text-sm font-medium text-indigo-800 mb-2">Preview:</div>
                                <div className="text-sm text-indigo-700">
                                    <strong>Message:</strong> "{message}"
                                </div>
                                <div className="text-sm text-indigo-700 mt-1">
                                    <strong>Scheduled:</strong> {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                                </div>
                                {isRecurring && (
                                    <div className="text-sm text-indigo-700 mt-1">
                                        <strong>Repeats:</strong> Every {recurrencePattern}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full p-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                        >
                            Schedule Message
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 border-t border-gray-100">
                    <div className="text-xs text-gray-500 text-center">
                        Messages will be sent automatically at the scheduled time
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleMessage
