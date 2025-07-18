import React, { useContext, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext'
import ReviewItem from '../components/ReviewItem'
import { formatDate, getTimeUntilReview } from '../utils/date'

const Schedule = () => {
  const { state } = useContext(AppContext)
  const { topics } = state

  const [viewMode, setViewMode] = useState('upcoming') // upcoming, overdue, all

  const reviewTopics = useMemo(() => {
    const now = new Date()

    const topicsWithReviews = topics.filter(topic => topic.nextReview)

    const categorized = {
      overdue: topicsWithReviews.filter(topic => new Date(topic.nextReview) < now),
      today: topicsWithReviews.filter(topic => {
        const reviewDate = new Date(topic.nextReview)
        const today = new Date()
        return reviewDate.toDateString() === today.toDateString()
      }),
      tomorrow: topicsWithReviews.filter(topic => {
        const reviewDate = new Date(topic.nextReview)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return reviewDate.toDateString() === tomorrow.toDateString()
      }),
      thisWeek: topicsWithReviews.filter(topic => {
        const reviewDate = new Date(topic.nextReview)
        const weekFromNow = new Date()
        weekFromNow.setDate(weekFromNow.getDate() + 7)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 2)
        return reviewDate > tomorrow && reviewDate <= weekFromNow
      }),
      later: topicsWithReviews.filter(topic => {
        const reviewDate = new Date(topic.nextReview)
        const weekFromNow = new Date()
        weekFromNow.setDate(weekFromNow.getDate() + 7)
        return reviewDate > weekFromNow
      })
    }

    // Sort each category by review date
    Object.keys(categorized).forEach(key => {
      categorized[key].sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview))
    })

    return categorized
  }, [topics])

  const getFilteredTopics = () => {
    switch (viewMode) {
      case 'overdue':
        return reviewTopics.overdue
      case 'upcoming':
        return [
          ...reviewTopics.overdue,
          ...reviewTopics.today,
          ...reviewTopics.tomorrow,
          ...reviewTopics.thisWeek
        ]
      case 'all':
      default:
        return [
          ...reviewTopics.overdue,
          ...reviewTopics.today,
          ...reviewTopics.tomorrow,
          ...reviewTopics.thisWeek,
          ...reviewTopics.later
        ]
    }
  }

  const stats = useMemo(() => {
    return {
      overdue: reviewTopics.overdue.length,
      today: reviewTopics.today.length,
      tomorrow: reviewTopics.tomorrow.length,
      thisWeek: reviewTopics.thisWeek.length,
      total: topics.filter(topic => topic.nextReview).length
    }
  }, [reviewTopics, topics])

  const renderSection = (title, topics, isOverdue = false) => {
    if (topics.length === 0) return null

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ 
          marginBottom: '1rem',
          color: isOverdue ? 'var(--error)' : 'var(--text-primary)'
        }}>
          {title} ({topics.length})
        </h3>
        {topics.map(topic => (
          <ReviewItem key={topic.id} topic={topic} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Study Schedule</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your review schedule and stay on track with spaced repetition.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--error)' }}>
            {stats.overdue}
          </div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {stats.today}
          </div>
          <div className="stat-label">Due Today</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {stats.tomorrow}
          </div>
          <div className="stat-label">Due Tomorrow</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            {stats.total}
          </div>
          <div className="stat-label">Total Scheduled</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)' }}>
          <button
            className={`btn ${viewMode === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('upcoming')}
            style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
          >
            Upcoming ({stats.overdue + stats.today + stats.tomorrow + stats.thisWeek})
          </button>
          <button
            className={`btn ${viewMode === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('overdue')}
            style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
          >
            Overdue ({stats.overdue})
          </button>
          <button
            className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('all')}
            style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
          >
            All ({stats.total})
          </button>
        </div>
      </div>

      {/* Schedule Content */}
      {topics.filter(topic => topic.nextReview).length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>No Scheduled Reviews</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Start studying topics to build your review schedule automatically using spaced repetition.
          </p>
        </div>
      ) : viewMode === 'upcoming' ? (
        <div>
          {renderSection('🔥 Overdue', reviewTopics.overdue, true)}
          {renderSection('📅 Due Today', reviewTopics.today)}
          {renderSection('⏰ Due Tomorrow', reviewTopics.tomorrow)}
          {renderSection('📋 This Week', reviewTopics.thisWeek)}

          {getFilteredTopics().length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>All Caught Up!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                No upcoming reviews. Great job staying on track!
              </p>
            </div>
          )}
        </div>
      ) : viewMode === 'overdue' ? (
        <div>
          {reviewTopics.overdue.length > 0 ? (
            renderSection('🔥 Overdue Reviews', reviewTopics.overdue, true)
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>No Overdue Reviews!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Excellent! You're staying on top of your review schedule.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {renderSection('🔥 Overdue', reviewTopics.overdue, true)}
          {renderSection('📅 Today', reviewTopics.today)}
          {renderSection('⏰ Tomorrow', reviewTopics.tomorrow)}
          {renderSection('📋 This Week', reviewTopics.thisWeek)}
          {renderSection('📆 Later', reviewTopics.later)}
        </div>
      )}

      {/* Study Tips */}
      <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--background-secondary)' }}>
        <h3 style={{ marginBottom: '1rem' }}>💡 Study Tips</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li>Focus on overdue items first - they're losing strength in memory</li>
          <li>Review items are scheduled using spaced repetition for optimal retention</li>
          <li>Consistent daily reviews are more effective than cramming</li>
          <li>Mark items as "hard" if you struggle to remember them</li>
        </ul>
      </div>
    </div>
  )
}

export default Schedule