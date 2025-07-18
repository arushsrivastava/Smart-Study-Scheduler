import React, { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContext'
import { getWeekDays, isSameDay, formatDate } from '../utils/date'

const Calendar = () => {
  const { state } = useContext(AppContext)
  const { sessions } = state

  const weekDays = useMemo(() => getWeekDays(), [])

  const getSessionsForDay = (date) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.completedAt), date)
    )
  }

  const getTotalTimeForDay = (date) => {
    const daySessions = getSessionsForDay(date)
    return daySessions.reduce((total, session) => total + session.duration, 0)
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3>This Week</h3>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {day}
          </div>
        ))}

        {weekDays.map((date, index) => {
          const sessionsCount = getSessionsForDay(date).length
          const totalTime = getTotalTimeForDay(date)
          const isToday = isSameDay(date, new Date())

          return (
            <div
              key={index}
              className={`calendar-day ${isToday ? 'today' : ''} ${sessionsCount > 0 ? 'has-session' : ''}`}
              title={`${date.getDate()} - ${sessionsCount} sessions (${formatDuration(totalTime)})`}
            >
              <div style={{ fontWeight: isToday ? 'bold' : 'normal' }}>
                {date.getDate()}
              </div>
              {sessionsCount > 0 && (
                <div style={{ fontSize: '0.625rem', marginTop: '0.125rem' }}>
                  {formatDuration(totalTime)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar