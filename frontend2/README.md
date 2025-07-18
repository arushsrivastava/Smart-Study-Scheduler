# Smart Study Scheduler

A comprehensive React-based study application featuring Pomodoro timer, spaced repetition system, and study analytics.

## Features

- 📚 **Topic Management**: Create, edit, and organize study topics with difficulty levels and priorities
- ⏱️ **Pomodoro Timer**: Customizable study sessions with automatic break intervals
- 🔄 **Spaced Repetition**: Intelligent review scheduling using SuperMemo algorithm
- 📊 **Analytics**: Track study progress, session statistics, and performance trends
- 📅 **Schedule View**: Visual calendar showing upcoming reviews and study sessions
- 🎨 **Dark/Light Theme**: Toggle between themes for comfortable studying
- 💾 **Data Management**: Export/import functionality for backup and data portability
- 🔔 **Notifications**: Browser notifications for session completion (optional)

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **State Management**: Context API + useReducer
- **Styling**: CSS with CSS variables for theming
- **Data Persistence**: localStorage
- **Build Tool**: Vite with SWC for fast compilation

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or extract the project files
2. Navigate to the project directory:
   ```bash
   cd smart-study-scheduler
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Getting Started
1. **Add Topics**: Start by adding study topics with subjects, difficulty levels, and estimated study time
2. **Study Sessions**: Use the study timer to focus on specific topics with Pomodoro technique
3. **Review Schedule**: Check the schedule page for upcoming reviews and overdue topics
4. **Track Progress**: Monitor your study statistics and progress in the analytics section

### Key Concepts

- **Spaced Repetition**: Topics are automatically scheduled for review based on your performance
- **Pomodoro Technique**: 25-minute focused study sessions followed by short breaks
- **Knowledge Strength**: Visual indicator of how well you know each topic
- **Study Streak**: Track consecutive days of studying to maintain momentum

## File Structure

```
smart-study-scheduler/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── src/
    ├── main.jsx            # Application entry point
    ├── App.jsx             # Main app component with routing
    ├── assets/
    │   └── style.css       # Global styles and CSS variables
    ├── context/
    │   ├── AppContext.jsx  # React Context provider
    │   └── reducer.js      # State management reducer
    ├── components/
    │   ├── Sidebar.jsx     # Navigation sidebar
    │   ├── NavItem.jsx     # Individual navigation item
    │   ├── StatCard.jsx    # Statistics display card
    │   ├── TopicCard.jsx   # Topic information card
    │   ├── ReviewItem.jsx  # Review schedule item
    │   ├── Calendar.jsx    # Study calendar component
    │   ├── Timer.jsx       # Pomodoro timer
    │   ├── Modal.jsx       # Modal dialogs and forms
    │   └── Notification.jsx # Toast notifications
    ├── pages/
    │   ├── Dashboard.jsx   # Main dashboard view
    │   ├── Topics.jsx      # Topic management page
    │   ├── Schedule.jsx    # Review schedule page
    │   ├── Analytics.jsx   # Study analytics page
    │   ├── Study.jsx       # Study session page
    │   └── Settings.jsx    # Application settings
    ├── hooks/
    │   ├── useLocalStorage.js # localStorage hook
    │   └── useTimer.js     # Timer management hook
    └── utils/
        ├── date.js         # Date formatting utilities
        └── srs.js          # Spaced repetition system logic
```

## Configuration

### Timer Settings
- Default study duration (15-120 minutes)
- Short break duration (1-30 minutes)
- Long break duration (1-60 minutes)
- Pomodoros until long break (2-10)

### App Settings
- Theme selection (light/dark)
- Daily study goal (15-480 minutes)
- Browser notifications (on/off)
- Auto-start breaks (on/off)

## Data Management

### Export
- Click "Export Data" in Settings to download a JSON backup
- Includes all topics, study sessions, and settings

### Import
- Use "Import Data" in Settings to restore from a backup file
- Supports JSON files exported from the application

### Clear Data
- "Clear All Data" permanently removes all information
- Use with caution - this action cannot be undone

## Contributing

This is a self-contained React application. To extend functionality:

1. Add new components in the `src/components/` directory
2. Create new pages in `src/pages/` and add routes in `App.jsx`
3. Extend the reducer in `src/context/reducer.js` for new state management
4. Add utility functions in `src/utils/` for reusable logic

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## License

This project is open source and available under the MIT License.
