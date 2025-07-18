import React, { useContext, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { formatDate, getWeekDays } from '../utils/date'

const Analytics = () => {
  const { state } = useContext(AppContext)
  const { topics, sessions } = state

  const [timeRange, setTimeRange] = useState('week') // week, month, all

  const analytics = useMemo(() => {
    const now = new Date()
    let startDate

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'all':
      default:
        startDate = new Date(0) // Beginning of time
    }

    const filteredSessions = sessions.filter(session => 
      new Date(session.completedAt) >= startDate
    )

    // Total study time
    const totalTime = filteredSessions.reduce((total, session) => total + session.duration, 0)
    const totalHours = Math.floor(totalTime / 3600)
    const totalMinutes = Math.floor((totalTime % 3600) / 60)

    // Average session length
    const avgSessionLength = filteredSessions.length > 0 
      ? Math.floor((totalTime / filteredSessions.length) / 60) 
      : 0

    // Study streak
    let streak = 0
    let currentDate = new Date(now)
    while (true) {
      const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      const dayEnd = new Date(dayStart.getTime() + 86400000)
      const dayHasSessions = sessions.some(session => {
        const sessionDate = new Date(session.completedAt)
        return sessionDate >= dayStart && sessionDate < dayEnd
      })

      if (dayHasSessions) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    // Daily breakdown for chart
    const dailyData = {}
    filteredSessions.forEach(session => {
      const date = new Date(session.completedAt).toDateString()
      dailyData[date] = (dailyData[date] || 0) + session.duration
    })

    // Subject breakdown
    const subjectData = {}
    filteredSessions.forEach(session => {
      const topic = topics.find(t => t.id === session.topicId)
      if (topic) {
        const subject = topic.subject
        subjectData[subject] = (subjectData[subject] || 0) + session.duration
      }
    })

    // Difficulty breakdown
    const difficultyData = { easy: 0, medium: 0, hard: 0 }
    filteredSessions.forEach(session => {
      const topic = topics.find(t => t.id === session.topicId)
      if (topic) {
        difficultyData[topic.difficulty] += session.duration
      }
    })

    // Most studied topics
    const topicStats = {}
    filteredSessions.forEach(session => {
      const topic = topics.find(t => t.id === session.topicId)
      if (topic) {
        if (!topicStats[topic.id]) {
          topicStats[topic.id] = {
            title: topic.title,
            subject: topic.subject,
            time: 0,
            sessions: 0
          }
        }
        topicStats[topic.id].time += session.duration
        topicStats[topic.id].sessions += 1
      }
    })

    const topTopics = Object.values(topicStats)
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)

    return {
      totalTime: { hours: totalHours, minutes: totalMinutes },
      totalSessions: filteredSessions.length,
      avgSessionLength,
      streak,
      dailyData,
      subjectData,
      difficultyData,
      topTopics
    }
  }, [sessions, topics, timeRange])

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Simple bar chart component (in real app, use Chart.js)
  const SimpleBarChart = ({ data, title, color = 'var(--primary-color)' }) => {
    const maxValue = Math.max(...Object.values(data))

    return (
      <div className="card">
        <h4 style={{ marginBottom: '1rem' }}>{title}</h4>
        <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem', height: '200px' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{
                  width: '100%',
                  backgroundColor: color,
                  borderRadius: '4px 4px 0 0',
                  height: `${(value / maxValue) * 150}px`,
                  minHeight: value > 0 ? '4px' : '0px',
                  marginBottom: '0.5rem'
                }}
                title={`${key}: ${formatDuration(value)}`}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', wordBreak: 'break-word' }}>
                {key.length > 8 ? key.substring(0, 8) + '...' : key}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getWeeklyData = () => {
    const weekData = {}
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Initialize with zeros
    days.forEach(day => { weekData[day] = 0 })

    // Add actual data
    sessions.forEach(session => {
      const date = new Date(session.completedAt)
      const dayName = days[date.getDay()]
      weekData[dayName] += session.duration
    })

    return weekData
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Analytics</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('week')}
            >
              This Week
            </button>
            <button 
              className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('month')}
            >
              This Month
            </button>
            <button 
              className={`btn btn-sm ${timeRange === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            {analytics.totalTime.hours}h {analytics.totalTime.minutes}m
          </div>
          <div className="stat-label">Total Study Time</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {analytics.totalSessions}
          </div>
          <div className="stat-label">Study Sessions</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {analytics.avgSessionLength}m
          </div>
          <div className="stat-label">Avg Session</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--error)' }}>
            {analytics.streak}
          </div>
          <div className="stat-label">Study Streak</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        <SimpleBarChart 
          data={timeRange === 'week' ? getWeeklyData() : analytics.subjectData} 
          title={timeRange === 'week' ? 'Study Time by Day' : 'Study Time by Subject'}
          color="var(--primary-color)"
        />
        <SimpleBarChart 
          data={analytics.difficultyData} 
          title="Study Time by Difficulty"
          color="var(--success)"
        />
      </div>

      {/* Top Topics */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>🏆 Most Studied Topics</h3>
        {analytics.topTopics.length > 0 ? (
          <div>
            {analytics.topTopics.map((topic, index) => (
              <div key={topic.title} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                backgroundColor: index === 0 ? 'rgba(99, 102, 241, 0.1)' : 'var(--background-secondary)',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    #{index + 1} {topic.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {topic.subject} • {topic.sessions} sessions
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                    {formatDuration(topic.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No study data available for the selected time range.
          </p>
        )}
      </div>

      {/* Insights */}
      <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--background-secondary)' }}>
        <h3 style={{ marginBottom: '1rem' }}>💡 Insights</h3>
        <div className="grid grid-2">
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Study Patterns:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <li>Your average session is {analytics.avgSessionLength} minutes</li>
              <li>You've maintained a {analytics.streak}-day study streak</li>
              <li>Total of {analytics.totalSessions} study sessions</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Recommendations:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <li>Aim for consistent daily sessions</li>
              <li>Balance time across different subjects</li>
              <li>Challenge yourself with harder topics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics