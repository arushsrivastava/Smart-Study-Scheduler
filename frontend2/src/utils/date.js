// Date utility functions for the Smart Study Scheduler

/**
 * Format seconds into a readable time string
 * @param {number} seconds - The number of seconds
 * @param {boolean} includeSeconds - Whether to include seconds in the output
 * @returns {string} Formatted time string
 */
export function formatTime(seconds, includeSeconds = false) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (includeSeconds) {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
  } else {
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }
}

/**
 * Format a date into a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format a date into a short string (e.g., "Mar 15")
 * @param {Date|string} date - The date to format
 * @returns {string} Short formatted date string
 */
export function formatDateShort(date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get a human-readable string for time until review
 * @param {string|Date} reviewDate - The review date
 * @returns {string} Human-readable time until review
 */
export function getTimeUntilReview(reviewDate) {
  const now = new Date()
  const review = new Date(reviewDate)
  const diffMs = review - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays)
    if (overdueDays === 0) {
      return 'Overdue today'
    } else if (overdueDays === 1) {
      return '1 day overdue'
    } else {
      return `${overdueDays} days overdue`
    }
  } else if (diffDays === 0) {
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    if (diffHours <= 1) {
      return 'Due now'
    } else {
      return `Due in ${diffHours}h`
    }
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`
  } else if (diffDays <= 30) {
    const weeks = Math.ceil(diffDays / 7)
    return `Due in ${weeks} week${weeks > 1 ? 's' : ''}`
  } else {
    const months = Math.ceil(diffDays / 30)
    return `Due in ${months} month${months > 1 ? 's' : ''}`
  }
}

/**
 * Check if two dates are on the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are on the same day
 */
export function isSameDay(date1, date2) {
  return date1.toDateString() === date2.toDateString()
}

/**
 * Get an array of dates for the current week (Sunday to Saturday)
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {Date[]} Array of dates for the week
 */
export function getWeekDays(referenceDate = new Date()) {
  const date = new Date(referenceDate)
  const day = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  const diff = date.getDate() - day // Adjust to get Sunday

  const sunday = new Date(date.setDate(diff))
  const week = []

  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(sunday)
    weekDay.setDate(sunday.getDate() + i)
    week.push(weekDay)
  }

  return week
}

/**
 * Get the start and end of a given day
 * @param {Date} date - The date
 * @returns {Object} Object with start and end Date objects
 */
export function getDayBounds(date = new Date()) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

/**
 * Get the start and end of a given week
 * @param {Date} date - Reference date in the week
 * @returns {Object} Object with start and end Date objects
 */
export function getWeekBounds(date = new Date()) {
  const weekDays = getWeekDays(date)
  const start = getDayBounds(weekDays[0]).start
  const end = getDayBounds(weekDays[6]).end

  return { start, end }
}

/**
 * Get the start and end of a given month
 * @param {Date} date - Reference date in the month
 * @returns {Object} Object with start and end Date objects
 */
export function getMonthBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

  return { start, end }
}

/**
 * Calculate the number of days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of days between dates
 */
export function daysBetween(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Add days to a date
 * @param {Date} date - The original date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Convert minutes to milliseconds
 * @param {number} minutes - Number of minutes
 * @returns {number} Milliseconds
 */
export function minutesToMs(minutes) {
  return minutes * 60 * 1000
}

/**
 * Convert seconds to milliseconds
 * @param {number} seconds - Number of seconds
 * @returns {number} Milliseconds
 */
export function secondsToMs(seconds) {
  return seconds * 1000
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - The date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diffMs = target - now
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  const isPast = diffMs < 0
  const prefix = isPast ? '' : 'in '
  const suffix = isPast ? ' ago' : ''

  if (diffSeconds < 60) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${prefix}${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}${suffix}`
  } else if (diffHours < 24) {
    return `${prefix}${diffHours} hour${diffHours === 1 ? '' : 's'}${suffix}`
  } else if (diffDays < 30) {
    return `${prefix}${diffDays} day${diffDays === 1 ? '' : 's'}${suffix}`
  } else {
    return formatDate(target)
  }
}