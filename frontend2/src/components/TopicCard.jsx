import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { formatTime, getTimeUntilReview } from '../utils/date'

const TopicCard = ({ topic }) => {
  const { dispatch } = useContext(AppContext)

  const handleEdit = () => {
    dispatch({
      type: 'MODAL_OPEN',
      payload: {
        modal: 'topic-form',
        data: topic
      }
    })
  }

  const handleDelete = () => {
    dispatch({
      type: 'MODAL_OPEN',
      payload: {
        modal: 'confirm-delete',
        data: { id: topic.id, title: topic.title, type: 'topic' }
      }
    })
  }

  const handleStartStudy = () => {
    dispatch({
      type: 'TIMER_SET_TOPIC',
      payload: topic.id
    })
    // Navigate to study page would be handled by parent component
  }

  const progress = Math.min(100, (topic.timeSpent / topic.estimatedTime) * 100)
  const timeUntilReview = getTimeUntilReview(topic.nextReview)

  const difficultyColors = {
    easy: 'success',
    medium: 'warning', 
    hard: 'error'
  }

  const priorityColors = {
    low: 'text-secondary',
    medium: 'warning',
    high: 'error'
  }

  return (
    <div className="card topic-card">
      <div className="topic-header">
        <h3 className="topic-title">{topic.title}</h3>
        <div className="topic-actions">
          <button className="btn btn-sm btn-primary" onClick={handleStartStudy}>
            ⏱️ Study
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleEdit}>
            ✏️ Edit
          </button>
          <button className="btn btn-sm btn-error" onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="topic-meta">
        <span>Subject: {topic.subject}</span>
        <span className={`difficulty-${topic.difficulty}`}>
          Difficulty: 
          <span style={{ color: `var(--${difficultyColors[topic.difficulty]})` }}>
            {topic.difficulty}
          </span>
        </span>
        <span className={`priority-${topic.priority}`}>
          Priority: 
          <span style={{ color: `var(--${priorityColors[topic.priority]})` }}>
            {topic.priority}
          </span>
        </span>
      </div>

      <div className="topic-meta">
        <span>Time: {formatTime(topic.timeSpent)} / {formatTime(topic.estimatedTime)}</span>
        <span>Next Review: {timeUntilReview}</span>
        <span>Repetitions: {topic.repetitions}</span>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {topic.notes && (
        <div className="topic-notes" style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {topic.notes}
        </div>
      )}

      {topic.tags && topic.tags.length > 0 && (
        <div className="topic-tags" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {topic.tags.map((tag, index) => (
            <span 
              key={index}
              style={{
                padding: '0.125rem 0.5rem',
                backgroundColor: 'var(--border)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopicCard