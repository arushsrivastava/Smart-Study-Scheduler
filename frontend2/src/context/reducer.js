export const initialState = {
  topics: [],
  sessions: [],
  settings: {
    defaultDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    dailyGoal: 120, // minutes
    theme: 'light',
    notifications: true,
    autoStartBreaks: false,
    pomodorosUntilLongBreak: 4
  },
  timer: {
    running: false,
    paused: false,
    seconds: 25 * 60, // 25 minutes default
    topicId: null,
    type: 'study', // 'study', 'short-break', 'long-break'
    pomodoroCount: 0
  },
  notification: {
    show: false,
    message: '',
    type: 'success' // 'success', 'error', 'warning'
  },
  ui: {
    sidebarCollapsed: false,
    activeModal: null, // 'topic-form', 'confirm-delete', etc.
    modalData: null
  }
}

export default function reducer(state, action) {
  switch (action.type) {
    // Topic actions
    case 'TOPIC_ADD':
      return {
        ...state,
        topics: [...state.topics, action.payload]
      }

    case 'TOPIC_UPDATE':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.id ? action.payload : topic
        )
      }

    case 'TOPIC_DELETE':
      return {
        ...state,
        topics: state.topics.filter(topic => topic.id !== action.payload),
        sessions: state.sessions.filter(session => session.topicId !== action.payload)
      }

    // Session actions
    case 'SESSION_ADD':
      return {
        ...state,
        sessions: [...state.sessions, action.payload]
      }

    case 'SESSION_UPDATE':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        )
      }

    // Timer actions
    case 'TIMER_START':
      return {
        ...state,
        timer: {
          ...state.timer,
          running: true,
          paused: false,
          seconds: action.payload.seconds || state.timer.seconds,
          topicId: action.payload.topicId || state.timer.topicId,
          type: action.payload.type || state.timer.type
        }
      }

    case 'TIMER_PAUSE':
      return {
        ...state,
        timer: {
          ...state.timer,
          running: false,
          paused: true
        }
      }

    case 'TIMER_RESUME':
      return {
        ...state,
        timer: {
          ...state.timer,
          running: true,
          paused: false
        }
      }

    case 'TIMER_STOP':
      return {
        ...state,
        timer: {
          ...state.timer,
          running: false,
          paused: false,
          seconds: state.settings.defaultDuration * 60,
          topicId: null,
          type: 'study'
        }
      }

    case 'TIMER_TICK':
      const newSeconds = Math.max(0, state.timer.seconds - 1)
      return {
        ...state,
        timer: {
          ...state.timer,
          seconds: newSeconds
        }
      }

    case 'TIMER_COMPLETE':
      const newCount = state.timer.type === 'study' ? state.timer.pomodoroCount + 1 : state.timer.pomodoroCount
      const shouldLongBreak = newCount % state.settings.pomodorosUntilLongBreak === 0

      return {
        ...state,
        timer: {
          ...state.timer,
          running: false,
          pomodoroCount: newCount,
          type: state.timer.type === 'study' 
            ? (shouldLongBreak ? 'long-break' : 'short-break')
            : 'study',
          seconds: state.timer.type === 'study'
            ? (shouldLongBreak ? state.settings.longBreak : state.settings.shortBreak) * 60
            : state.settings.defaultDuration * 60
        }
      }

    case 'TIMER_SET_DURATION':
      return {
        ...state,
        timer: {
          ...state.timer,
          seconds: action.payload * 60
        }
      }

    case 'TIMER_SET_TOPIC':
      return {
        ...state,
        timer: {
          ...state.timer,
          topicId: action.payload
        }
      }

    // Settings actions
    case 'SETTINGS_UPDATE':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      }

    case 'THEME_TOGGLE':
      const newTheme = state.settings.theme === 'light' ? 'dark' : 'light'
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: newTheme
        }
      }

    // Notification actions
    case 'NOTIFICATION_SHOW':
      return {
        ...state,
        notification: {
          show: true,
          message: action.payload.message,
          type: action.payload.type || 'success'
        }
      }

    case 'NOTIFICATION_HIDE':
      return {
        ...state,
        notification: {
          ...state.notification,
          show: false
        }
      }

    // UI actions
    case 'SIDEBAR_TOGGLE':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed
        }
      }

    case 'MODAL_OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModal: action.payload.modal,
          modalData: action.payload.data || null
        }
      }

    case 'MODAL_CLOSE':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModal: null,
          modalData: null
        }
      }

    // Analytics actions
    case 'ANALYTICS_UPDATE':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload
        }
      }

    default:
      return state
  }
}