import React, { createContext, useReducer, useEffect } from 'react'
import reducer, { initialState } from './reducer'

export const AppContext = createContext()

// Sample data for first-time users
const sampleData = {
  topics: [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      subject: 'Programming',
      difficulty: 'medium',
      priority: 'high',
      estimatedTime: 120,
      timeSpent: 85,
      nextReview: new Date(Date.now() + 86400000).toISOString(),
      repetitions: 2,
      easeFactor: 2.5,
      interval: 3,
      tags: ['programming', 'web-development'],
      notes: 'Focus on closures and async/await',
      createdAt: new Date().toISOString(),
      lastStudied: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '2', 
      title: 'React Hooks',
      subject: 'Programming',
      difficulty: 'hard',
      priority: 'high',
      estimatedTime: 180,
      timeSpent: 45,
      nextReview: new Date(Date.now() + 43200000).toISOString(),
      repetitions: 1,
      easeFactor: 2.5,
      interval: 1,
      tags: ['react', 'hooks'],
      notes: 'useEffect dependency arrays are tricky',
      createdAt: new Date().toISOString(),
      lastStudied: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      title: 'Data Structures',
      subject: 'Computer Science',
      difficulty: 'hard',
      priority: 'medium',
      estimatedTime: 240,
      timeSpent: 180,
      nextReview: new Date(Date.now() + 259200000).toISOString(),
      repetitions: 3,
      easeFactor: 2.6,
      interval: 7,
      tags: ['algorithms', 'data-structures'],
      notes: 'Trees and graphs need more practice',
      createdAt: new Date().toISOString(),
      lastStudied: new Date(Date.now() - 432000000).toISOString()
    }
  ],
  sessions: [
    {
      id: '1',
      topicId: '1',
      duration: 25 * 60,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      type: 'study'
    },
    {
      id: '2',
      topicId: '2', 
      duration: 15 * 60,
      completedAt: new Date(Date.now() - 172800000).toISOString(),
      type: 'review'
    },
    {
      id: '3',
      topicId: '1',
      duration: 30 * 60,
      completedAt: new Date().toISOString(),
      type: 'study'
    }
  ]
}

export default function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    // Load from localStorage or use sample data
    const cached = localStorage.getItem('studySchedulerData')
    if (cached) {
      const parsed = JSON.parse(cached)
      return { ...init, ...parsed }
    } else {
      // First time user - initialize with sample data
      const withSampleData = { ...init, ...sampleData }
      localStorage.setItem('studySchedulerData', JSON.stringify({
        topics: withSampleData.topics,
        sessions: withSampleData.sessions,
        settings: withSampleData.settings
      }))
      return withSampleData
    }
  })

  // Persist to localStorage whenever relevant state changes
  useEffect(() => {
    const { topics, sessions, settings } = state
    const dataToSave = { topics, sessions, settings }
    localStorage.setItem('studySchedulerData', JSON.stringify(dataToSave))
  }, [state.topics, state.sessions, state.settings])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}