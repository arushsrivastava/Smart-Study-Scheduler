import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import useTimer from '../hooks/useTimer'
import { formatTime } from '../utils/date'

const Timer = () => {
  const { state, dispatch } = useContext(AppContext)
  const { timer, topics, settings } = state

  const currentTopic = topics.find(topic => topic.id === timer.topicId)

  const handleTick = () => {
    if (timer.seconds > 0) {
      dispatch({ type: 'TIMER_TICK' })
    } else {
      // Timer completed
      dispatch({ type: 'TIMER_COMPLETE' })

      // Add session record
      if (timer.type === 'study' && timer.topicId) {
        const session = {
          id: Date.now().toString(),
          topicId: timer.topicId,
          duration: settings.defaultDuration * 60,
          completedAt: new Date().toISOString(),
          type: 'study'
        }
        dispatch({ type: 'SESSION_ADD', payload: session })

        // Update topic time spent
        if (currentTopic) {
          const updatedTopic = {
            ...currentTopic,
            timeSpent: currentTopic.timeSpent + (settings.defaultDuration),
            lastStudied: new Date().toISOString()
          }
          dispatch({ type: 'TOPIC_UPDATE', payload: updatedTopic })
        }
      }

      // Show notification
      const message = timer.type === 'study' 
        ? 'Study session completed! Time for a break.'
        : 'Break time over! Ready to study?'

      dispatch({
        type: 'NOTIFICATION_SHOW',
        payload: { message, type: 'success' }
      })

      // Browser notification if supported
      if (settings.notifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Smart Study Scheduler', { body: message })
      }
    }
  }

  useTimer(timer.running, handleTick)

  const handleStart = () => {
    if (timer.paused) {
      dispatch({ type: 'TIMER_RESUME' })
    } else {
      dispatch({ 
        type: 'TIMER_START',
        payload: {
          seconds: timer.seconds,
          topicId: timer.topicId,
          type: timer.type
        }
      })
    }

    // Request notification permission
    if (settings.notifications && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const handlePause = () => {
    dispatch({ type: 'TIMER_PAUSE' })
  }

  const handleStop = () => {
    dispatch({ type: 'TIMER_STOP' })
  }

  const handleSetDuration = (minutes) => {
    if (!timer.running) {
      dispatch({ type: 'TIMER_SET_DURATION', payload: minutes })
    }
  }

  const progress = timer.type === 'study' 
    ? ((settings.defaultDuration * 60 - timer.seconds) / (settings.defaultDuration * 60)) * 100
    : timer.type === 'short-break'
    ? ((settings.shortBreak * 60 - timer.seconds) / (settings.shortBreak * 60)) * 100
    : ((settings.longBreak * 60 - timer.seconds) / (settings.longBreak * 60)) * 100

  const getTimerColor = () => {
    if (timer.type === 'study') return 'var(--primary-color)'
    if (timer.type === 'short-break') return 'var(--success)'
    return 'var(--warning)'
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {currentTopic && (
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {currentTopic.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {currentTopic.subject}
          </p>
        </div>
      )}

      <div className="timer-circle" style={{ 
        borderColor: getTimerColor(),
        background: `conic-gradient(${getTimerColor()} ${progress * 3.6}deg, var(--border) 0deg)`
      }}>
        <div className="timer-time">
          {formatTime(timer.seconds, true)}
        </div>
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
        {timer.type === 'study' ? '📚 Study Time' : 
         timer.type === 'short-break' ? '☕ Short Break' : 
         '🍕 Long Break'}
      </div>

      <div className="timer-controls">
        {!timer.running && !timer.paused && (
          <button className="btn btn-primary" onClick={handleStart}>
            ▶️ Start
          </button>
        )}
        {timer.running && (
          <button className="btn btn-warning" onClick={handlePause}>
            ⏸️ Pause
          </button>
        )}
        {timer.paused && (
          <button className="btn btn-success" onClick={handleStart}>
            ▶️ Resume
          </button>
        )}
        {(timer.running || timer.paused) && (
          <button className="btn btn-error" onClick={handleStop}>
            ⏹️ Stop
          </button>
        )}
      </div>

      {!timer.running && !timer.paused && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Quick Settings:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${timer.seconds === 15 * 60 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSetDuration(15)}
            >
              15m
            </button>
            <button 
              className={`btn btn-sm ${timer.seconds === 25 * 60 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSetDuration(25)}
            >
              25m
            </button>
            <button 
              className={`btn btn-sm ${timer.seconds === 45 * 60 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSetDuration(45)}
            >
              45m
            </button>
            <button 
              className={`btn btn-sm ${timer.seconds === 60 * 60 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSetDuration(60)}
            >
              60m
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Pomodoro #{timer.pomodoroCount + 1} • 
        Next: {timer.type === 'study' 
          ? (timer.pomodoroCount + 1) % settings.pomodorosUntilLongBreak === 0 ? 'Long Break' : 'Short Break'
          : 'Study Session'}
      </div>
    </div>
  )
}

export default Timer