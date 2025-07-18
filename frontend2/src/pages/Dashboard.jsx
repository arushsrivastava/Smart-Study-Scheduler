import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import StatCard from '../components/StatCard'
import TopicCard from '../components/TopicCard'
import ReviewItem from '../components/ReviewItem'
import Calendar from '../components/Calendar'
import { TopicFormModal, ConfirmModal } from '../components/Modal'
import { formatTime } from '../utils/date'

const Dashboard = () => {
  const { state, dispatch } = useContext(AppContext)
  const { topics, sessions, settings } = state

  const stats = useMemo(() => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todaySessions = sessions.filter(session => 
      new Date(session.completedAt) >= todayStart
    )
    const todayTime = todaySessions.reduce((total, session) => total + session.duration, 0)

    const totalTime = sessions.reduce((total, session) => total + session.duration, 0)
    const averageTime = sessions.length > 0 ? totalTime / sessions.length : 0

    // Calculate study streak
    let streak = 0
    let currentDate = new Date(today)
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

    return {
      totalTopics: topics.length,
      todayTime: Math.floor(todayTime / 60), // in minutes
      totalTime: Math.floor(totalTime / 60), // in minutes
      studyStreak: streak,
      averageSession: Math.floor(averageTime / 60) // in minutes
    }
  }, [topics, sessions])

  const upcomingReviews = useMemo(() => {
    return topics
      .filter(topic => topic.nextReview)
      .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview))
      .slice(0, 5)
  }, [topics])

  const recentTopics = useMemo(() => {
    return topics
      .filter(topic => topic.lastStudied)
      .sort((a, b) => new Date(b.lastStudied) - new Date(a.lastStudied))
      .slice(0, 3)
  }, [topics])

  const handleAddTopic = () => {
    dispatch({
      type: 'MODAL_OPEN',
      payload: { modal: 'topic-form' }
    })
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Welcome back! Here's your study overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Topics"
          value={stats.totalTopics}
          icon="📚"
          color="primary"
        />
        <StatCard
          title="Today's Study Time"
          value={`${stats.todayTime}m`}
          icon="⏱️"
          color="success"
        />
        <StatCard
          title="Study Streak"
          value={`${stats.studyStreak} days`}
          icon="🔥"
          color="warning"
        />
        <StatCard
          title="Total Study Time"
          value={`${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m`}
          icon="📈"
          color="primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        {/* Recent Topics */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Recent Topics</h2>
            <Link to="/topics" className="btn btn-sm btn-secondary">
              View All
            </Link>
          </div>

          {recentTopics.length > 0 ? (
            recentTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No topics yet. Start by adding your first topic!
              </p>
              <button className="btn btn-primary" onClick={handleAddTopic}>
                📚 Add Your First Topic
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Reviews */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Upcoming Reviews</h2>
            <Link to="/schedule" className="btn btn-sm btn-secondary">
              View Schedule
            </Link>
          </div>

          {upcomingReviews.length > 0 ? (
            upcomingReviews.map(topic => (
              <ReviewItem key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                No upcoming reviews. Great job staying on top of your studies!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Study Calendar</h2>
        <Calendar />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleAddTopic}>
            📚 Add New Topic
          </button>
          <Link to="/study" className="btn btn-success">
            ⏱️ Start Study Session
          </Link>
          <Link to="/analytics" className="btn btn-secondary">
            📊 View Analytics
          </Link>
          <Link to="/settings" className="btn btn-secondary">
            ⚙️ Settings
          </Link>
        </div>
      </div>

      {/* Modals */}
      <TopicFormModal />
      <ConfirmModal />
    </div>
  )
}

export default Dashboard