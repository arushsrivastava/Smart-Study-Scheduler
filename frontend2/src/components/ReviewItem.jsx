import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { getTimeUntilReview } from '../utils/date'

const ReviewItem = ({ topic }) => {
  const { dispatch } = useContext(AppContext)

  const handleStartReview = () => {
    dispatch({
      type: 'TIMER_SET_TOPIC',
      payload: topic.id
    })
  }

  const timeUntil = getTimeUntilReview(topic.nextReview)
  const isOverdue = new Date(topic.nextReview) < new Date()

  return (
    <div className={`card ${isOverdue ? 'border-error' : ''}`} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>{topic.title}</h4>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <span>{topic.subject}</span>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <span className={isOverdue ? 'text-error' : ''}>
              {isOverdue ? 'Overdue' : timeUntil}
            </span>
          </div>
        </div>
        <button 
          className={`btn btn-sm ${isOverdue ? 'btn-error' : 'btn-primary'}`}
          onClick={handleStartReview}
        >
          {isOverdue ? '🔥 Review Now' : '📖 Review'}
        </button>
      </div>
    </div>
  )
}

export default ReviewItem