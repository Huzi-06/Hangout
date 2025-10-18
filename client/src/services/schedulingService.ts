import { ScheduledMessage } from '../interfaces'

class SchedulingService {
  private scheduledMessages: ScheduledMessage[] = []
  private intervals: Map<string, number> = new Map()
  private onMessageSend?: (scheduledMessage: ScheduledMessage) => void

  /**
   * Set the callback function that will be called when a scheduled message needs to be sent
   */
  setMessageSender(callback?: (scheduledMessage: ScheduledMessage) => void) {
    console.log('🔗 Setting message sender callback:', !!callback)
    console.log('🔗 Callback type:', typeof callback)
    console.log('🔗 Callback name:', callback?.name || 'anonymous')
    this.onMessageSend = callback

    // Verify the callback was set
    console.log('🔍 Callback verification after setting:', !!this.onMessageSend)
    console.log('🔍 Callback type after setting:', typeof this.onMessageSend)
  }

  /**
   * Check if the message sender callback is properly set
   */
  hasMessageSender(): boolean {
    const hasCallback = !!this.onMessageSend
    console.log('🔍 Checking callback status:', hasCallback)
    return hasCallback
  }

  /**
   * Get the current callback function (for debugging)
   */
  getMessageSender(): ((scheduledMessage: ScheduledMessage) => void) | undefined {
    return this.onMessageSend
  }

  /**
   * Validate that a scheduled time is valid (in the future and not too far)
   */
  validateScheduledTime(scheduledTime: Date): { valid: boolean; error?: string } {
    const now = new Date()
    const minTime = new Date(now.getTime() + 10000) // At least 10 seconds in the future
    const maxTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // Max 1 year in the future

    if (scheduledTime < minTime) {
      return {
        valid: false,
        error: 'Scheduled time must be at least 10 seconds in the future'
      }
    }

    if (scheduledTime > maxTime) {
      return {
        valid: false,
        error: 'Scheduled time cannot be more than 1 year in the future'
      }
    }

    return { valid: true }
  }

  /**
   * Schedule a new message
   */
  scheduleMessage(message: Omit<ScheduledMessage, 'id' | 'status' | 'createdAt'>): ScheduledMessage {
    console.log('📅 Scheduling new message:', message)

    // Create the full scheduled message
    const scheduledMessage: ScheduledMessage = {
      ...message,
      id: `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date()
    }

    // Add to our list
    this.scheduledMessages.push(scheduledMessage)

    // Set up the timer
    this.setupMessageTimer(scheduledMessage)

    console.log('✅ Message scheduled successfully:', scheduledMessage.id)
    console.log('📊 Total scheduled messages:', this.scheduledMessages.length)

    return scheduledMessage
  }

  /**
   * Set up a timer to send the message at the scheduled time
   */
  private setupMessageTimer(scheduledMessage: ScheduledMessage) {
    const now = new Date()
    const delay = scheduledMessage.scheduledTime.getTime() - now.getTime()

    console.log('⏰ Setting up timer for message:', scheduledMessage.id)
    console.log('⏰ Scheduled for:', scheduledMessage.scheduledTime.toISOString())
    console.log('⏰ Current time:', now.toISOString())
    console.log('⏰ Delay (ms):', delay)
    console.log('⏰ Delay (minutes):', delay / 60000)

    if (delay <= 0) {
      console.log('⚠️ Delay is 0 or negative, checking if should execute immediately')
      // Only execute immediately if it's within 5 seconds of the scheduled time
      if (delay > -5000) {
        console.log('⚡ Executing immediately (within 5 seconds of scheduled time)')
        this.executeScheduledMessage(scheduledMessage)
      } else {
        console.error('❌ Invalid delay - time is too far in the past!')
      }
      return
    }

    // Clear any existing timer for this message
    if (this.intervals.has(scheduledMessage.id)) {
      clearTimeout(this.intervals.get(scheduledMessage.id)!)
    }

    // Set up the new timer
    const timeout = setTimeout(() => {
      console.log('⏰ Timer fired for message:', scheduledMessage.id)
      this.executeScheduledMessage(scheduledMessage)
    }, delay)

    this.intervals.set(scheduledMessage.id, timeout)
    console.log('✅ Timer set successfully for', delay / 60000, 'minutes from now')
  }

  /**
   * Execute a scheduled message (send it)
   */
  private executeScheduledMessage(scheduledMessage: ScheduledMessage) {
    console.log('⚡ Executing scheduled message:', scheduledMessage.id)
    console.log('⚡ Message:', scheduledMessage.message)
    console.log('⚡ Callback exists:', !!this.onMessageSend)
    console.log('⚡ Callback type:', typeof this.onMessageSend)

    if (!this.onMessageSend) {
      console.error('❌ No message sender callback set!')
      console.log('🔍 Service state:', {
        hasCallback: !!this.onMessageSend,
        callbackType: typeof this.onMessageSend,
        scheduledMessagesCount: this.scheduledMessages.length,
        intervalsCount: this.intervals.size,
        scheduledMessage: scheduledMessage
      })

      // Mark message as failed
      scheduledMessage.status = 'failed'
      return
    }

    try {
      // Call the callback with the scheduled message
      console.log('📤 Calling callback with message')
      this.onMessageSend(scheduledMessage)
      console.log('✅ Callback executed successfully')

      // Update status
      scheduledMessage.status = 'sent'
      scheduledMessage.sentAt = new Date()

      // Handle recurring messages
      if (scheduledMessage.isRecurring && scheduledMessage.recurrencePattern) {
        console.log('🔄 Scheduling next recurrence')
        this.scheduleNextRecurrence(scheduledMessage)
      } else {
        // Clean up the interval if it's not recurring
        if (this.intervals.has(scheduledMessage.id)) {
          clearTimeout(this.intervals.get(scheduledMessage.id)!)
          this.intervals.delete(scheduledMessage.id)
          console.log('🧹 Cleaned up timer for one-time message')
        }
      }
    } catch (error) {
      console.error('💥 Error executing scheduled message:', error)
      scheduledMessage.status = 'failed'
    }
  }

  /**
   * Schedule the next occurrence of a recurring message
   */
  private scheduleNextRecurrence(scheduledMessage: ScheduledMessage) {
    const nextTime = this.calculateNextRecurrence(
      scheduledMessage.scheduledTime,
      scheduledMessage.recurrencePattern!
    )

    console.log('🔄 Next recurrence:', nextTime.toISOString())

    // Create a new scheduled message for the next occurrence
    const nextMessage: ScheduledMessage = {
      ...scheduledMessage,
      id: `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scheduledTime: nextTime,
      status: 'pending',
      createdAt: new Date()
    }

    // Add to our list and set up timer
    this.scheduledMessages.push(nextMessage)
    this.setupMessageTimer(nextMessage)
  }

  /**
   * Calculate the next recurrence time based on the pattern
   */
  private calculateNextRecurrence(
    currentTime: Date,
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ): Date {
    const nextTime = new Date(currentTime)

    switch (pattern) {
      case 'daily':
        nextTime.setDate(nextTime.getDate() + 1)
        break
      case 'weekly':
        nextTime.setDate(nextTime.getDate() + 7)
        break
      case 'monthly':
        nextTime.setMonth(nextTime.getMonth() + 1)
        break
      case 'yearly':
        nextTime.setFullYear(nextTime.getFullYear() + 1)
        break
    }

    return nextTime
  }

  /**
   * Get all scheduled messages
   */
  getScheduledMessages(): ScheduledMessage[] {
    return this.scheduledMessages
  }

  /**
   * Get pending messages (not yet sent)
   */
  getPendingMessages(): ScheduledMessage[] {
    return this.scheduledMessages.filter(m => m.status === 'pending')
  }

  /**
   * Mark a message as sent (used by backup checking mechanism)
   */
  markMessageAsSent(messageId: string) {
    const message = this.scheduledMessages.find(m => m.id === messageId)
    if (message) {
      message.status = 'sent'
      message.sentAt = new Date()
      console.log('✅ Marked message as sent:', messageId)
    }
  }

  /**
   * Cancel a scheduled message
   */
  cancelMessage(messageId: string) {
    const index = this.scheduledMessages.findIndex(m => m.id === messageId)
    if (index !== -1) {
      // Clear the timer
      if (this.intervals.has(messageId)) {
        clearTimeout(this.intervals.get(messageId)!)
        this.intervals.delete(messageId)
      }

      // Remove from list
      this.scheduledMessages.splice(index, 1)
      console.log('🗑️ Cancelled scheduled message:', messageId)
    }
  }

  /**
   * Clear all scheduled messages
   */
  clearAll() {
    // Clear all timers
    this.intervals.forEach(timeout => clearTimeout(timeout))
    this.intervals.clear()

    // Clear messages
    this.scheduledMessages = []
    console.log('🗑️ Cleared all scheduled messages')
  }
}

// Export a singleton instance
export const schedulingService = new SchedulingService()
