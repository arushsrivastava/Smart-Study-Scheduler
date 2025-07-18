import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import Timer from '../components/Timer'

const Study = () => {
  const { state, dispatch } = useContext(AppContext)
  const { topics, timer } = state

  const [selectedTopicId, setSelectedTopicId] = useState(timer.topicId || '')

  const currentTopic = topics.find(topic => topic.id === timer.topicId)
  const selectedTopic = topics.find(topic => topic.id === selectedTopicId)

  const handleTopicSelect = (topicId) => {
    setSelectedTopicId(topicId)
    if (!timer.running && !timer.paused) {
      dispatch({ type: 'TIMER_SET_TOPIC', payload: topicId })
    }
  }

  const upcomingReviews = topics
    .filter(topic => topic.nextReview && new Date(topic.nextReview) <= new Date(Date.now() + 86400000)) // next 24 hours
    .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview))
    .slice(0, 5)

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Study Session</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Focus on your studies with the Pomodoro technique.
        </p>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem' }}>
        {/* Timer Section */}
        <div className="card">
          <Timer />
        </div>

        {/* Topic Selection */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Select Study Topic</h3>

            {topics.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                No topics available. Add some topics first!
              </p>
            ) : (
              <div className="form-group">
                <select
                  className="form-select"
                  value={selectedTopicId}
                  onChange={(e) => handleTopicSelect(e.target.value)}
                  disabled={timer.running}
                >
                  <option value="">Select a topic...</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title} - {topic.subject}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedTopic && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--background-secondary)', borderRadius: '0.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{selectedTopic.title}</h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>{selectedTopic.subject}</span>
                  <span style={{ margin: '0 0.5rem' }}>•</span>
                  <span>Difficulty: {selectedTopic.difficulty}</span>
                  <span style={{ margin: '0 0.5rem' }}>•</span>
                  <span>Priority: {selectedTopic.priority}</span>
                </div>
                {selectedTopic.notes && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {selectedTopic.notes}
                  </p>
                )}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Progress: {Math.round((selectedTopic.timeSpent / selectedTopic.estimatedTime) * 100)}%
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, (selectedTopic.timeSpent / selectedTopic.estimatedTime) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Reviews */}
          {upcomingReviews.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>📅 Due for Review</h3>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Topics that need attention soon:
              </div>

              {upcomingReviews.map(topic => {
                const isOverdue = new Date(topic.nextReview) < new Date()
                return (
                  <div 
                    key={topic.id} 
                    style={{ 
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'var(--background-secondary)',
                      borderRadius: '0.5rem',
                      border: isOverdue ? '1px solid var(--error)' : '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleTopicSelect(topic.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          {topic.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {topic.subject} • {isOverdue ? '🔥 Overdue' : '⏰ Due soon'}
                        </div>
                      </div>
                      <button 
                        className={`btn btn-sm ${isOverdue ? 'btn-error' : 'btn-primary'}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTopicSelect(topic.id)
                        }}
                      >
                        Study
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Study Tips */}
      <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--background-secondary)' }}>
        <h3 style={{ marginBottom: '1rem' }}>🧠 Study Tips</h3>
        <div className="grid grid-2">
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Pomodoro Technique:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <li>25 minutes focused study</li>
              <li>5 minute short break</li>
              <li>Longer break after 4 sessions</li>
              <li>Eliminate distractions</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Effective Study:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <li>Review spaced repetition items first</li>
              <li>Take notes and summarize</li>
              <li>Test yourself regularly</li>
              <li>Stay hydrated and take breaks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Study