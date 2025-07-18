// Spaced Repetition System (SRS) utilities based on SuperMemo algorithm

/**
 * Calculate the next review date using the SuperMemo SM-2 algorithm
 * @param {Object} topic - The topic object
 * @param {number} grade - Grade from 0-5 (0=fail, 5=perfect)
 * @returns {Object} Updated topic with new SRS values
 */
export function calculateNextReview(topic, grade) {
  const { repetitions = 0, easeFactor = 2.5, interval = 1 } = topic

  let newRepetitions = repetitions
  let newEaseFactor = easeFactor
  let newInterval = interval

  if (grade >= 3) {
    // Correct response
    if (newRepetitions === 0) {
      newInterval = 1
    } else if (newRepetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * easeFactor)
    }
    newRepetitions += 1
  } else {
    // Incorrect response - reset repetitions but keep some interval
    newRepetitions = 0
    newInterval = 1
  }

  // Update ease factor based on grade (only for grades 3 and above)
  if (grade >= 3) {
    newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)))
  }

  // Calculate next review date
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    ...topic,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    interval: newInterval,
    nextReview: nextReview.toISOString(),
    lastStudied: new Date().toISOString()
  }
}

/**
 * Get the recommended grade descriptions for user interface
 * @returns {Array} Array of grade objects with value and description
 */
export function getGradeDescriptions() {
  return [
    { value: 0, label: 'Complete blackout', description: 'No memory of the topic' },
    { value: 1, label: 'Incorrect response', description: 'Remembered something but got it wrong' },
    { value: 2, label: 'Incorrect response (easy)', description: 'Wrong but the correct answer seemed easy' },
    { value: 3, label: 'Correct response (difficult)', description: 'Correct but with serious difficulty' },
    { value: 4, label: 'Correct response (hesitation)', description: 'Correct after some hesitation' },
    { value: 5, label: 'Perfect response', description: 'Correct with perfect recall' }
  ]
}

/**
 * Simplified grading system for easier user interaction
 * @returns {Array} Array of simplified grade objects
 */
export function getSimpleGrades() {
  return [
    { value: 1, label: 'Hard', description: 'Difficult to remember', color: 'error' },
    { value: 3, label: 'Good', description: 'Remembered with effort', color: 'warning' },
    { value: 5, label: 'Easy', description: 'Easy to remember', color: 'success' }
  ]
}

/**
 * Calculate the retention rate for a topic based on its study history
 * @param {Object} topic - The topic object
 * @param {Array} sessions - Array of study sessions for this topic
 * @returns {number} Retention rate as a percentage (0-100)
 */
export function calculateRetentionRate(topic, sessions) {
  const topicSessions = sessions.filter(session => session.topicId === topic.id)

  if (topicSessions.length === 0) return 0

  // Simple retention calculation based on repetitions vs sessions
  const successfulReviews = topic.repetitions || 0
  const totalSessions = topicSessions.length

  return Math.round((successfulReviews / totalSessions) * 100)
}

/**
 * Get topics that are due for review
 * @param {Array} topics - Array of all topics
 * @param {Date} currentDate - Current date (defaults to now)
 * @returns {Array} Array of topics due for review, sorted by urgency
 */
export function getTopicsDueForReview(topics, currentDate = new Date()) {
  return topics
    .filter(topic => {
      if (!topic.nextReview) return false
      return new Date(topic.nextReview) <= currentDate
    })
    .sort((a, b) => {
      // Sort by review date (most overdue first)
      return new Date(a.nextReview) - new Date(b.nextReview)
    })
}

/**
 * Calculate the optimal study schedule for upcoming days
 * @param {Array} topics - Array of all topics
 * @param {number} daysAhead - Number of days to schedule ahead
 * @returns {Object} Schedule object with dates as keys and topics as values
 */
export function generateStudySchedule(topics, daysAhead = 7) {
  const schedule = {}
  const today = new Date()

  // Initialize schedule for each day
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = date.toISOString().split('T')[0]
    schedule[dateKey] = []
  }

  // Add topics to appropriate days
  topics.forEach(topic => {
    if (topic.nextReview) {
      const reviewDate = new Date(topic.nextReview)
      const dateKey = reviewDate.toISOString().split('T')[0]

      if (schedule[dateKey]) {
        schedule[dateKey].push(topic)
      }
    }
  })

  // Sort topics within each day by priority and difficulty
  Object.keys(schedule).forEach(dateKey => {
    schedule[dateKey].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]

      if (priorityDiff !== 0) return priorityDiff

      // If same priority, sort by difficulty (harder first)
      const difficultyOrder = { hard: 3, medium: 2, easy: 1 }
      return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
    })
  })

  return schedule
}

/**
 * Estimate the knowledge strength of a topic based on SRS data
 * @param {Object} topic - The topic object
 * @returns {number} Knowledge strength from 0-100
 */
export function calculateKnowledgeStrength(topic) {
  const { repetitions = 0, easeFactor = 2.5, interval = 1, lastStudied } = topic

  if (repetitions === 0) return 0

  // Base strength from repetitions (more repetitions = stronger)
  let strength = Math.min(50, repetitions * 10)

  // Boost from ease factor (easier topics = stronger knowledge)
  strength += Math.min(25, (easeFactor - 1.3) * 20)

  // Decay based on time since last studied
  if (lastStudied) {
    const daysSinceStudied = (new Date() - new Date(lastStudied)) / (1000 * 60 * 60 * 24)
    const decay = Math.max(0, (daysSinceStudied - interval) / interval * 0.3)
    strength -= decay * 25
  }

  return Math.max(0, Math.min(100, Math.round(strength)))
}

/**
 * Get recommended study time for a topic based on difficulty and progress
 * @param {Object} topic - The topic object
 * @returns {number} Recommended study time in minutes
 */
export function getRecommendedStudyTime(topic) {
  const { difficulty, repetitions = 0, timeSpent = 0, estimatedTime = 60 } = topic

  const baseTime = {
    easy: 15,
    medium: 25,
    hard: 35
  }[difficulty] || 25

  // Adjust based on repetitions (fewer reps = more time needed)
  const repetitionMultiplier = repetitions === 0 ? 1.5 : repetitions < 3 ? 1.2 : 1.0

  // Adjust based on progress (less progress = more time needed)
  const progress = Math.min(1, timeSpent / estimatedTime)
  const progressMultiplier = progress < 0.3 ? 1.3 : progress < 0.7 ? 1.1 : 1.0

  return Math.round(baseTime * repetitionMultiplier * progressMultiplier)
}

/**
 * Calculate study statistics for analytics
 * @param {Array} topics - Array of all topics
 * @param {Array} sessions - Array of all study sessions
 * @returns {Object} Statistics object
 */
export function calculateStudyStats(topics, sessions) {
  const stats = {
    totalTopics: topics.length,
    totalSessions: sessions.length,
    totalStudyTime: 0,
    averageRetention: 0,
    topicsNeedingReview: 0,
    overdueTopics: 0,
    knowledgeStrengthAverage: 0
  }

  // Calculate total study time
  stats.totalStudyTime = sessions.reduce((total, session) => total + session.duration, 0)

  // Calculate topics needing review
  const now = new Date()
  stats.topicsNeedingReview = topics.filter(topic => 
    topic.nextReview && new Date(topic.nextReview) <= now
  ).length

  // Calculate overdue topics
  stats.overdueTopics = topics.filter(topic => 
    topic.nextReview && new Date(topic.nextReview) < now
  ).length

  // Calculate average retention and knowledge strength
  if (topics.length > 0) {
    const totalRetention = topics.reduce((sum, topic) => 
      sum + calculateRetentionRate(topic, sessions), 0
    )
    stats.averageRetention = Math.round(totalRetention / topics.length)

    const totalKnowledge = topics.reduce((sum, topic) => 
      sum + calculateKnowledgeStrength(topic), 0
    )
    stats.knowledgeStrengthAverage = Math.round(totalKnowledge / topics.length)
  }

  return stats
}

/**
 * Export SRS data for backup or analysis
 * @param {Array} topics - Array of all topics
 * @param {Array} sessions - Array of all study sessions
 * @returns {Object} Exportable SRS data
 */
export function exportSRSData(topics, sessions) {
  return {
    topics: topics.map(topic => ({
      id: topic.id,
      title: topic.title,
      subject: topic.subject,
      repetitions: topic.repetitions,
      easeFactor: topic.easeFactor,
      interval: topic.interval,
      nextReview: topic.nextReview,
      lastStudied: topic.lastStudied,
      knowledgeStrength: calculateKnowledgeStrength(topic),
      retentionRate: calculateRetentionRate(topic, sessions)
    })),
    sessions: sessions.map(session => ({
      id: session.id,
      topicId: session.topicId,
      duration: session.duration,
      completedAt: session.completedAt,
      type: session.type
    })),
    exportedAt: new Date().toISOString(),
    stats: calculateStudyStats(topics, sessions)
  }
}