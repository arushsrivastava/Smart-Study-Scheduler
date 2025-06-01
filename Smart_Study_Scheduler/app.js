// Smart Study Scheduler - Main Application

// Global application state
const appState = {
  topics: [],
  sessions: [],
  analytics: {
    dailyStats: [],
    weeklyStats: [],
    monthlyStats: []
  },
  categories: [
    "Mathematics",
    "Programming", 
    "Science",
    "Language",
    "History",
    "Literature",
    "Business",
    "Other"
  ],
  difficultyLevels: ["Easy", "Medium", "Hard"],
  qualityDescriptions: {
    "0": "Complete blackout - No recall",
    "1": "Incorrect response - Correct answer remembered",
    "2": "Incorrect response - Correct answer seemed easy",
    "3": "Correct response with serious difficulty",
    "4": "Correct response after hesitation",
    "5": "Perfect response - Immediate recall"
  },
  settings: {
    defaultStudyDuration: 25,
    dailyGoal: 120,
    theme: 'light'
  },
  currentStudyTopic: null,
  currentTimer: null,
  timerRunning: false,
  timerSeconds: 1500, // 25 minutes
  editingTopicId: null
};

// DOM Elements
const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  navItems: document.querySelectorAll('.nav-item'),
  pages: document.querySelectorAll('.page'),
  themeToggle: document.getElementById('theme-toggle'),
  topicModal: document.getElementById('topic-modal'),
  topicForm: document.getElementById('topic-form'),
  modalTitle: document.getElementById('modal-title'),
  modalClose: document.getElementById('modal-close'),
  cancelTopic: document.getElementById('cancel-topic'),
  notification: document.getElementById('notification'),
  notificationText: document.getElementById('notification-text'),
  notificationClose: document.getElementById('notification-close'),
  topicGrid: document.getElementById('topics-grid'),
  addTopicBtn: document.getElementById('add-topic-btn'),
  addTopicMain: document.getElementById('add-topic-main'),
  topicCategory: document.getElementById('topic-category'),
  categoryFilter: document.getElementById('category-filter'),
  difficultyFilter: document.getElementById('difficulty-filter'),
  searchTopics: document.getElementById('search-topics'),
  calendarGrid: document.getElementById('calendar-grid'),
  prevWeek: document.getElementById('prev-week'),
  nextWeek: document.getElementById('next-week'),
  calendarTitle: document.getElementById('calendar-title'),
  weeklyChart: document.getElementById('weekly-chart'),
  monthlyChart: document.getElementById('monthly-chart'),
  difficultyChart: document.getElementById('difficulty-chart'),
  avgScore: document.getElementById('avg-score'),
  completionRate: document.getElementById('completion-rate'),
  dailyAverage: document.getElementById('daily-average'),
  todayReviews: document.getElementById('today-reviews'),
  totalTopics: document.getElementById('total-topics'),
  dueReviews: document.getElementById('due-reviews'),
  studyStreak: document.getElementById('study-streak'),
  totalTime: document.getElementById('total-time'),
  timerDisplay: document.getElementById('timer-display'),
  startTimer: document.getElementById('start-timer'),
  pauseTimer: document.getElementById('pause-timer'),
  resetTimer: document.getElementById('reset-timer'),
  studyTopicSelect: document.getElementById('study-topic-select'),
  currentTopicTitle: document.getElementById('current-topic-title'),
  currentTopicDescription: document.getElementById('current-topic-description'),
  qualityRating: document.getElementById('quality-rating'),
  ratingButtons: document.querySelectorAll('.rating-btn'),
  defaultDuration: document.getElementById('default-duration'),
  dailyGoal: document.getElementById('daily-goal'),
  exportData: document.getElementById('export-data'),
  importData: document.getElementById('import-data'),
  clearData: document.getElementById('clear-data'),
  startStudyBtn: document.getElementById('start-study-btn')
};

// Initialize the application
function initApp() {
  loadDataFromStorage();
  setupEventListeners();
  populateCategoryOptions();
  renderTopics();
  updateDashboard();
  renderCalendar();
  renderAnalytics();
  updateStudyTopicSelect();
  applyTheme();
  
  // If there's no data, load sample data
  if (appState.topics.length === 0) {
    loadSampleData();
  }
}

// Load sample data for demonstration
function loadSampleData() {
  // Sample topics
  appState.topics = [
    {
      id: "topic-1",
      title: "Linear Algebra Fundamentals",
      description: "Vector spaces, matrices, eigenvalues and eigenvectors",
      category: "Mathematics",
      difficulty: "Hard",
      easinessFactor: 2.3,
      interval: 4,
      repetitions: 2,
      nextReview: Date.now() + 4 * 86400000,
      lastReviewed: Date.now() - 2 * 86400000,
      totalReviews: 3,
      successRate: 67,
      studyTime: 5400,
      created: Date.now() - 7 * 86400000,
      completed: false
    },
    {
      id: "topic-2", 
      title: "React Hooks and Context",
      description: "useState, useEffect, useContext, custom hooks",
      category: "Programming",
      difficulty: "Medium",
      easinessFactor: 2.7,
      interval: 7,
      repetitions: 4,
      nextReview: Date.now() + 5 * 86400000,
      lastReviewed: Date.now() - 2 * 86400000,
      totalReviews: 5,
      successRate: 80,
      studyTime: 7200,
      created: Date.now() - 8 * 86400000,
      completed: false
    }
  ];

  // Sample sessions
  appState.sessions = [
    {id: "s1", topicId: "topic-1", date: Date.now() - 2 * 86400000, duration: 1800, quality: 4, type: "review"},
    {id: "s2", topicId: "topic-2", date: Date.now() - 3 * 86400000, duration: 2400, quality: 5, type: "review"},
    {id: "s3", topicId: "topic-1", date: Date.now() - 4 * 86400000, duration: 1500, quality: 3, type: "review"}
  ];

  // Sample analytics
  appState.analytics = {
    dailyStats: [
      {date: formatDate(Date.now() - 6 * 86400000), sessions: 3, studyTime: 4500, topics: 2},
      {date: formatDate(Date.now() - 5 * 86400000), sessions: 2, studyTime: 3600, topics: 2},
      {date: formatDate(Date.now() - 4 * 86400000), sessions: 4, studyTime: 5400, topics: 3},
      {date: formatDate(Date.now() - 3 * 86400000), sessions: 1, studyTime: 1800, topics: 1},
      {date: formatDate(Date.now() - 2 * 86400000), sessions: 3, studyTime: 4200, topics: 2},
      {date: formatDate(Date.now() - 1 * 86400000), sessions: 5, studyTime: 6000, topics: 3},
      {date: formatDate(Date.now()), sessions: 2, studyTime: 3000, topics: 2}
    ],
    weeklyStats: [
      {week: "Week 1", sessions: 25, studyTime: 32400, topics: 8},
      {week: "Week 2", sessions: 30, studyTime: 39600, topics: 10},
      {week: "Current Week", sessions: 28, studyTime: 36000, topics: 9}
    ],
    monthlyStats: [
      {month: "March", sessions: 95, studyTime: 120000, topics: 25},
      {month: "April", sessions: 110, studyTime: 142800, topics: 30},
      {month: "May", sessions: 125, studyTime: 162000, topics: 35}
    ]
  };

  saveDataToStorage();
  renderTopics();
  updateDashboard();
  renderCalendar();
  renderAnalytics();
  updateStudyTopicSelect();
  
  showNotification('Sample data loaded for demonstration');
}

// Event listeners setup
function setupEventListeners() {
  // Navigation
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetPage = item.getAttribute('data-page');
      navigateToPage(targetPage, item);
    });
  });

  // Sidebar toggle
  elements.sidebarToggle.addEventListener('click', () => {
    elements.sidebar.classList.toggle('open');
  });

  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Add topic buttons
  elements.addTopicBtn.addEventListener('click', showAddTopicModal);
  elements.addTopicMain.addEventListener('click', showAddTopicModal);

  // Modal close buttons
  elements.modalClose.addEventListener('click', closeModal);
  elements.cancelTopic.addEventListener('click', closeModal);

  // Topic form submission
  elements.topicForm.addEventListener('submit', handleTopicSubmit);

  // Notification close
  elements.notificationClose.addEventListener('click', closeNotification);

  // Topic filters
  elements.categoryFilter.addEventListener('change', filterTopics);
  elements.difficultyFilter.addEventListener('change', filterTopics);
  elements.searchTopics.addEventListener('input', filterTopics);

  // Calendar navigation
  elements.prevWeek.addEventListener('click', () => navigateCalendar(-7));
  elements.nextWeek.addEventListener('click', () => navigateCalendar(7));

  // Study controls
  elements.startTimer.addEventListener('click', startStudyTimer);
  elements.pauseTimer.addEventListener('click', pauseStudyTimer);
  elements.resetTimer.addEventListener('click', resetStudyTimer);
  elements.studyTopicSelect.addEventListener('change', selectStudyTopic);
  
  // Rating buttons
  elements.ratingButtons.forEach(btn => {
    btn.addEventListener('click', () => rateStudySession(parseInt(btn.getAttribute('data-quality'))));
  });

  // Settings controls
  elements.defaultDuration.addEventListener('change', saveSettings);
  elements.dailyGoal.addEventListener('change', saveSettings);
  elements.exportData.addEventListener('click', exportAppData);
  elements.importData.addEventListener('click', () => showNotification('Import functionality would be implemented here', 'info'));
  elements.clearData.addEventListener('click', confirmClearData);

  // Start study from dashboard
  elements.startStudyBtn.addEventListener('click', () => {
    navigateToPage('study', document.querySelector('[data-page="study"]'));
  });
}

// Navigation
function navigateToPage(pageId, navItem) {
  // Update active navigation item
  elements.navItems.forEach(item => item.classList.remove('active'));
  navItem.classList.add('active');

  // Show the selected page
  elements.pages.forEach(page => page.classList.remove('active'));
  document.getElementById(`${pageId}-page`).classList.add('active');

  // Close sidebar on mobile
  if (window.innerWidth < 768) {
    elements.sidebar.classList.remove('open');
  }

  // Special actions for certain pages
  if (pageId === 'analytics') {
    renderAnalytics();
  } else if (pageId === 'schedule') {
    renderCalendar();
  } else if (pageId === 'dashboard') {
    updateDashboard();
  }
}

// Topic Management
function showAddTopicModal() {
  elements.modalTitle.textContent = 'Add New Topic';
  elements.topicForm.reset();
  elements.topicModal.classList.add('active');
  appState.editingTopicId = null;
}

function showEditTopicModal(topic) {
  elements.modalTitle.textContent = 'Edit Topic';
  
  // Populate form with topic data
  document.getElementById('topic-title').value = topic.title;
  document.getElementById('topic-description').value = topic.description;
  document.getElementById('topic-category').value = topic.category;
  document.getElementById('topic-difficulty').value = topic.difficulty;
  
  // Store ID of topic being edited
  appState.editingTopicId = topic.id;
  
  // Show modal
  elements.topicModal.classList.add('active');
}

function closeModal() {
  elements.topicModal.classList.remove('active');
  elements.topicForm.reset();
  appState.editingTopicId = null;
}

function handleTopicSubmit(e) {
  e.preventDefault();
  
  const topicData = {
    title: document.getElementById('topic-title').value,
    description: document.getElementById('topic-description').value,
    category: document.getElementById('topic-category').value,
    difficulty: document.getElementById('topic-difficulty').value
  };
  
  if (!topicData.title) {
    showNotification('Topic title is required', 'error');
    return;
  }
  
  if (appState.editingTopicId) {
    // Update existing topic
    updateTopic(appState.editingTopicId, topicData);
  } else {
    // Add new topic
    addNewTopic(topicData);
  }
  
  closeModal();
}

function addNewTopic(topicData) {
  const now = Date.now();
  const newTopic = {
    id: 'topic-' + now,
    title: topicData.title,
    description: topicData.description,
    category: topicData.category || 'Other',
    difficulty: topicData.difficulty || 'Medium',
    easinessFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: now,  // Due immediately
    lastReviewed: null,
    totalReviews: 0,
    successRate: 0,
    studyTime: 0,
    created: now,
    completed: false
  };
  
  appState.topics.push(newTopic);
  saveDataToStorage();
  renderTopics();
  updateDashboard();
  updateStudyTopicSelect();
  showNotification('Topic added successfully');
}

function updateTopic(topicId, topicData) {
  const index = appState.topics.findIndex(topic => topic.id === topicId);
  if (index !== -1) {
    // Update only the editable fields
    appState.topics[index].title = topicData.title;
    appState.topics[index].description = topicData.description;
    appState.topics[index].category = topicData.category;
    appState.topics[index].difficulty = topicData.difficulty;
    
    saveDataToStorage();
    renderTopics();
    updateDashboard();
    updateStudyTopicSelect();
    showNotification('Topic updated successfully');
  }
}

function deleteTopic(topicId) {
  if (confirm('Are you sure you want to delete this topic?')) {
    appState.topics = appState.topics.filter(topic => topic.id !== topicId);
    
    // Also remove associated study sessions
    appState.sessions = appState.sessions.filter(session => session.topicId !== topicId);
    
    saveDataToStorage();
    renderTopics();
    updateDashboard();
    updateStudyTopicSelect();
    showNotification('Topic deleted successfully');
  }
}

function renderTopics() {
  const filteredTopics = getFilteredTopics();
  elements.topicGrid.innerHTML = '';

  if (filteredTopics.length === 0) {
    elements.topicGrid.innerHTML = `
      <div class="empty-state">
        <h3>No topics found</h3>
        <p>Add a topic to get started or adjust your filters.</p>
      </div>
    `;
    return;
  }

  filteredTopics.forEach(topic => {
    const topicEl = document.createElement('div');
    topicEl.className = 'topic-card';
    
    const difficultyClass = topic.difficulty.toLowerCase();
    const isOverdue = new Date(topic.nextReview) < new Date() && !topic.completed;
    
    // Calculate progress based on repetitions (simplified)
    const progress = Math.min(100, topic.repetitions * 20);
    
    const timeStudied = formatTimeSpent(topic.studyTime);
    
    // Format the next review date
    const nextReviewText = topic.completed 
      ? 'Completed' 
      : formatReviewDate(topic.nextReview);
    
    topicEl.innerHTML = `
      <div class="topic-header">
        <div>
          <h3 class="topic-title">${topic.title}</h3>
          <span class="topic-category">${topic.category}</span>
        </div>
        <span class="difficulty ${difficultyClass}">${topic.difficulty}</span>
      </div>
      <p class="topic-description">${topic.description || 'No description provided'}</p>
      <div class="topic-stats">
        <div class="stat">
          <span class="stat-value">${topic.totalReviews}</span>
          <span class="stat-label">Reviews</span>
        </div>
        <div class="stat">
          <span class="stat-value">${topic.successRate}%</span>
          <span class="stat-label">Success</span>
        </div>
        <div class="stat">
          <span class="stat-value">${timeStudied}</span>
          <span class="stat-label">Studied</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="topic-actions">
        <button class="btn btn--primary study-btn" data-id="${topic.id}">
          <span class="material-icons">play_arrow</span> Study
        </button>
        <button class="btn btn--secondary edit-btn" data-id="${topic.id}">
          <span class="material-icons">edit</span> Edit
        </button>
        <button class="btn btn--outline delete-btn" data-id="${topic.id}">
          <span class="material-icons">delete</span> Delete
        </button>
        <div class="next-review ${isOverdue ? 'overdue' : ''}">
          ${nextReviewText}
        </div>
      </div>
    `;
    
    elements.topicGrid.appendChild(topicEl);
    
    // Attach event listeners
    const studyBtn = topicEl.querySelector('.study-btn');
    const editBtn = topicEl.querySelector('.edit-btn');
    const deleteBtn = topicEl.querySelector('.delete-btn');
    
    studyBtn.addEventListener('click', () => {
      // Navigate to study page with this topic
      appState.currentStudyTopic = topic.id;
      resetStudyTimer();
      selectStudyTopic();
      navigateToPage('study', document.querySelector('[data-page="study"]'));
    });
    
    editBtn.addEventListener('click', () => {
      showEditTopicModal(topic);
    });
    
    deleteBtn.addEventListener('click', () => {
      deleteTopic(topic.id);
    });
  });
}

// Filter topics based on user selection
function getFilteredTopics() {
  const categoryFilter = elements.categoryFilter.value;
  const difficultyFilter = elements.difficultyFilter.value;
  const searchFilter = elements.searchTopics.value.toLowerCase();
  
  return appState.topics.filter(topic => {
    // Apply category filter
    if (categoryFilter && topic.category !== categoryFilter) {
      return false;
    }
    
    // Apply difficulty filter
    if (difficultyFilter && topic.difficulty !== difficultyFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchFilter && 
        !topic.title.toLowerCase().includes(searchFilter) && 
        !topic.description.toLowerCase().includes(searchFilter)) {
      return false;
    }
    
    return true;
  });
}

function filterTopics() {
  renderTopics();
}

// Populate category options
function populateCategoryOptions() {
  // Populate category filter
  appState.categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    elements.categoryFilter.appendChild(option);
  });
  
  // Populate category select in topic form
  appState.categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    elements.topicCategory.appendChild(option);
  });
}

// Calendar and Schedule
function renderCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start date is the beginning of the current week (Sunday)
  const startDate = new Date(today);
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  startDate.setDate(today.getDate() - currentDay);
  
  elements.calendarTitle.textContent = `Week of ${formatDate(startDate)}`;
  elements.calendarGrid.innerHTML = '';
  
  // Create 7 days starting from startDate
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const isToday = isSameDay(currentDate, today);
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()];
    const formattedDate = currentDate.getDate();
    
    // Find reviews due on this day
    const dueTopics = appState.topics.filter(topic => {
      const reviewDate = new Date(topic.nextReview);
      return isSameDay(reviewDate, currentDate) && !topic.completed;
    });
    
    const dayEl = document.createElement('div');
    dayEl.className = `calendar-day ${isToday ? 'today' : ''}`;
    
    dayEl.innerHTML = `
      <div class="day-header">
        <strong>${dayName}</strong> ${formattedDate}
      </div>
      <div class="day-events">
        ${
          dueTopics.length > 0 
            ? dueTopics.map(topic => `
              <div class="calendar-event">${topic.title}</div>
            `).join('') 
            : '<div class="no-events">No reviews due</div>'
        }
      </div>
    `;
    
    elements.calendarGrid.appendChild(dayEl);
  }
}

function navigateCalendar(daysToAdd) {
  // Get current displayed week's start date
  const currentWeekTitle = elements.calendarTitle.textContent;
  const currentStartDateStr = currentWeekTitle.replace('Week of ', '');
  const [month, day, year] = currentStartDateStr.split('/');
  
  // Create a date object for the start date
  const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  // Add or subtract days
  startDate.setDate(startDate.getDate() + daysToAdd);
  
  // Update calendar title and re-render
  elements.calendarTitle.textContent = `Week of ${formatDate(startDate)}`;
  
  // Re-render the calendar with the new start date
  renderCalendar();
}

// Analytics and Charts
function renderAnalytics() {
  // Weekly performance chart
  const weeklyCtx = elements.weeklyChart.getContext('2d');
  new Chart(weeklyCtx, {
    type: 'line',
    data: {
      labels: appState.analytics.dailyStats.map(day => day.date),
      datasets: [{
        label: 'Study Sessions',
        data: appState.analytics.dailyStats.map(day => day.sessions),
        backgroundColor: 'rgba(33, 128, 141, 0.2)',
        borderColor: 'rgb(33, 128, 141)',
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });

  // Monthly progress chart
  const monthlyCtx = elements.monthlyChart.getContext('2d');
  new Chart(monthlyCtx, {
    type: 'bar',
    data: {
      labels: appState.analytics.monthlyStats.map(month => month.month),
      datasets: [{
        label: 'Topics Studied',
        data: appState.analytics.monthlyStats.map(month => month.topics),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });

  // Topic difficulty distribution chart
  const difficultyData = {
    Easy: 0,
    Medium: 0,
    Hard: 0
  };
  
  // Count topics by difficulty
  appState.topics.forEach(topic => {
    difficultyData[topic.difficulty]++;
  });
  
  const difficultyCtx = elements.difficultyChart.getContext('2d');
  new Chart(difficultyCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(difficultyData),
      datasets: [{
        data: Object.values(difficultyData),
        backgroundColor: [
          'rgba(76, 175, 80, 0.6)',  // Green for Easy
          'rgba(255, 152, 0, 0.6)',  // Orange for Medium
          'rgba(244, 67, 54, 0.6)'   // Red for Hard
        ],
        borderColor: [
          'rgb(76, 175, 80)',
          'rgb(255, 152, 0)',
          'rgb(244, 67, 54)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });

  // Update performance metrics
  updatePerformanceMetrics();
}

function updatePerformanceMetrics() {
  // Calculate average score
  let totalQuality = 0;
  let totalSessions = appState.sessions.length;
  
  if (totalSessions > 0) {
    appState.sessions.forEach(session => {
      totalQuality += session.quality;
    });
    
    const avgScore = Math.round((totalQuality / totalSessions) * 20); // Convert from 0-5 to 0-100 scale
    elements.avgScore.textContent = `${avgScore}%`;
  } else {
    elements.avgScore.textContent = 'N/A';
  }
  
  // Calculate completion rate
  const completedTopics = appState.topics.filter(topic => topic.completed).length;
  const totalTopics = appState.topics.length;
  
  if (totalTopics > 0) {
    const completionRate = Math.round((completedTopics / totalTopics) * 100);
    elements.completionRate.textContent = `${completionRate}%`;
  } else {
    elements.completionRate.textContent = 'N/A';
  }
  
  // Calculate daily average
  const totalDailyStudySessions = appState.analytics.dailyStats.reduce((sum, day) => sum + day.sessions, 0);
  const daysCount = appState.analytics.dailyStats.length;
  
  if (daysCount > 0) {
    const dailyAverage = Math.round(totalDailyStudySessions / daysCount * 10) / 10;
    elements.dailyAverage.textContent = dailyAverage;
  } else {
    elements.dailyAverage.textContent = 'N/A';
  }
}

// Dashboard Updates
function updateDashboard() {
  // Update total topics
  elements.totalTopics.textContent = appState.topics.length;
  
  // Update due reviews
  const now = new Date();
  const dueTopics = appState.topics.filter(topic => new Date(topic.nextReview) <= now && !topic.completed);
  elements.dueReviews.textContent = dueTopics.length;
  
  // Update study streak (placeholder - would be calculated based on daily activity)
  elements.studyStreak.textContent = '7'; // Sample value
  
  // Update total study time
  const totalSeconds = appState.sessions.reduce((total, session) => total + session.duration, 0);
  elements.totalTime.textContent = formatTimeSpent(totalSeconds);
  
  // Update today's reviews list
  renderTodayReviews();
}

function renderTodayReviews() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dueTopics = appState.topics.filter(topic => {
    const reviewDate = new Date(topic.nextReview);
    return reviewDate >= today && reviewDate < tomorrow && !topic.completed;
  });
  
  elements.todayReviews.innerHTML = '';
  
  if (dueTopics.length === 0) {
    elements.todayReviews.innerHTML = '<p>No reviews scheduled for today</p>';
    return;
  }
  
  dueTopics.forEach(topic => {
    const reviewEl = document.createElement('div');
    reviewEl.className = 'review-item';
    
    const difficultyClass = topic.difficulty.toLowerCase();
    
    reviewEl.innerHTML = `
      <h4>${topic.title}</h4>
      <span class="difficulty ${difficultyClass}">${topic.difficulty}</span>
    `;
    
    // Add click event to navigate to study
    reviewEl.addEventListener('click', () => {
      appState.currentStudyTopic = topic.id;
      resetStudyTimer();
      selectStudyTopic();
      navigateToPage('study', document.querySelector('[data-page="study"]'));
    });
    
    elements.todayReviews.appendChild(reviewEl);
  });
}

// Study Session and SM-2 Algorithm
function updateStudyTopicSelect() {
  elements.studyTopicSelect.innerHTML = '<option value="">Choose a topic...</option>';
  
  appState.topics.filter(topic => !topic.completed).forEach(topic => {
    const option = document.createElement('option');
    option.value = topic.id;
    option.textContent = topic.title;
    
    if (topic.id === appState.currentStudyTopic) {
      option.selected = true;
    }
    
    elements.studyTopicSelect.appendChild(option);
  });
}

function selectStudyTopic() {
  const topicId = elements.studyTopicSelect.value || appState.currentStudyTopic;
  
  if (!topicId) {
    elements.currentTopicTitle.textContent = 'Select a topic to start studying';
    elements.currentTopicDescription.textContent = '';
    return;
  }
  
  const topic = appState.topics.find(t => t.id === topicId);
  if (topic) {
    appState.currentStudyTopic = topicId;
    elements.currentTopicTitle.textContent = topic.title;
    elements.currentTopicDescription.textContent = topic.description || 'No description provided';
    
    resetStudyTimer();
    elements.qualityRating.style.display = 'none';
  }
}

function startStudyTimer() {
  if (!appState.currentStudyTopic) {
    showNotification('Please select a topic to study', 'warning');
    return;
  }
  
  if (appState.timerRunning) return;
  
  appState.timerRunning = true;
  
  elements.timerDisplay.classList.add('active');
  elements.startTimer.disabled = true;
  
  appState.currentTimer = setInterval(() => {
    appState.timerSeconds--;
    
    if (appState.timerSeconds <= 0) {
      completeStudySession();
    }
    
    updateTimerDisplay();
  }, 1000);
  
  updateTimerDisplay();
}

function pauseStudyTimer() {
  if (!appState.timerRunning) return;
  
  clearInterval(appState.currentTimer);
  appState.timerRunning = false;
  elements.startTimer.disabled = false;
  
  elements.timerDisplay.classList.remove('active');
}

function resetStudyTimer() {
  pauseStudyTimer();
  appState.timerSeconds = appState.settings.defaultStudyDuration * 60;
  updateTimerDisplay();
  elements.qualityRating.style.display = 'none';
}

function updateTimerDisplay() {
  const minutes = Math.floor(appState.timerSeconds / 60);
  const seconds = appState.timerSeconds % 60;
  
  elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function completeStudySession() {
  pauseStudyTimer();
  
  // Show quality rating options
  elements.qualityRating.style.display = 'block';
  
  // Scroll to rating
  elements.qualityRating.scrollIntoView({ behavior: 'smooth' });
}

function rateStudySession(quality) {
  if (!appState.currentStudyTopic) return;
  
  const topic = appState.topics.find(t => t.id === appState.currentStudyTopic);
  if (!topic) return;
  
  // Record the study session
  const session = {
    id: 'session-' + Date.now(),
    topicId: appState.currentStudyTopic,
    date: Date.now(),
    duration: appState.settings.defaultStudyDuration * 60 - appState.timerSeconds,
    quality: quality,
    type: topic.repetitions === 0 ? 'new' : 'review'
  };
  
  appState.sessions.push(session);
  
  // Update the topic's statistics
  topic.lastReviewed = Date.now();
  topic.totalReviews++;
  topic.studyTime += session.duration;
  
  // Calculate success rate
  const successfulReviews = appState.sessions.filter(
    s => s.topicId === topic.id && s.quality >= 3
  ).length;
  
  topic.successRate = Math.round((successfulReviews / topic.totalReviews) * 100);
  
  // Apply SM-2 algorithm
  const result = calculateNextReview(quality, topic.easinessFactor, topic.interval, topic.repetitions);
  
  topic.easinessFactor = result.easinessFactor;
  topic.interval = result.interval;
  topic.repetitions = result.repetitions;
  topic.nextReview = Date.now() + (result.interval * 86400000); // Convert days to milliseconds
  
  // If the user rates it as 5, check if the topic should be completed
  if (quality === 5 && topic.repetitions >= 5) {
    topic.completed = true;
  }
  
  // Hide quality rating
  elements.qualityRating.style.display = 'none';
  
  // Update analytics
  updateAnalytics(session);
  
  saveDataToStorage();
  updateDashboard();
  renderCalendar();
  renderTopics();
  
  showNotification('Study session completed!');
  resetStudyTimer();
}

// SM-2 algorithm implementation
function calculateNextReview(quality, easinessFactor, interval, repetitions) {
  // Quality: 0-5 rating
  // EasinessFactor: starts at 2.5
  // Interval: days until next review
  // Repetitions: number of successful reviews
  
  if (quality < 3) {
    // Failed review - reset
    return {
      easinessFactor: Math.max(1.3, easinessFactor - 0.2),
      interval: 1,
      repetitions: 0
    };
  }
  
  // Adjust easiness factor
  const newEF = Math.max(1.3, easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  
  // Calculate new interval
  let newInterval;
  if (repetitions === 0) {
    newInterval = 1;
  } else if (repetitions === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEF);
  }
  
  return {
    easinessFactor: newEF,
    interval: newInterval,
    repetitions: repetitions + 1
  };
}

// Update analytics when a study session is completed
function updateAnalytics(session) {
  const today = formatDate(new Date(session.date));
  
  // Update daily stats
  let dayIndex = appState.analytics.dailyStats.findIndex(day => day.date === today);
  
  if (dayIndex !== -1) {
    appState.analytics.dailyStats[dayIndex].sessions += 1;
    appState.analytics.dailyStats[dayIndex].studyTime += session.duration;
    
    // Check if topic has been studied today already
    const topicAlreadyStudied = appState.sessions.some(s => 
      s.topicId === session.topicId && 
      s.id !== session.id && 
      formatDate(new Date(s.date)) === today
    );
    
    if (!topicAlreadyStudied) {
      appState.analytics.dailyStats[dayIndex].topics += 1;
    }
  } else {
    // Create new day entry
    appState.analytics.dailyStats.push({
      date: today,
      sessions: 1,
      studyTime: session.duration,
      topics: 1
    });
    
    // Ensure only the last 7 days are kept
    if (appState.analytics.dailyStats.length > 7) {
      appState.analytics.dailyStats.shift();
    }
  }
  
  // Weekly and monthly stats would be updated similarly
  // This is simplified for the demo
}

// Settings and Theme
function toggleTheme() {
  const currentTheme = appState.settings.theme === 'dark' ? 'light' : 'dark';
  appState.settings.theme = currentTheme;
  
  applyTheme();
  saveDataToStorage();
}

function applyTheme() {
  document.documentElement.setAttribute('data-color-scheme', appState.settings.theme);
  
  const themeIcon = elements.themeToggle.querySelector('.material-icons');
  if (themeIcon) {
    themeIcon.textContent = appState.settings.theme === 'dark' ? 'light_mode' : 'dark_mode';
  }
}

function saveSettings() {
  appState.settings.defaultStudyDuration = parseInt(elements.defaultDuration.value) || 25;
  appState.settings.dailyGoal = parseInt(elements.dailyGoal.value) || 120;
  
  saveDataToStorage();
  showNotification('Settings saved successfully');
}

// Notifications
function showNotification(message, type = 'success') {
  elements.notificationText.textContent = message;
  elements.notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    elements.notification.classList.remove('show');
  }, 3000);
}

function closeNotification() {
  elements.notification.classList.remove('show');
}

// Data Import/Export
function exportAppData() {
  const dataToExport = {
    topics: appState.topics,
    sessions: appState.sessions,
    analytics: appState.analytics,
    settings: appState.settings
  };
  
  const dataStr = JSON.stringify(dataToExport);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportLink = document.createElement('a');
  exportLink.setAttribute('href', dataUri);
  exportLink.setAttribute('download', 'study_scheduler_data.json');
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
  
  showNotification('Data exported successfully');
}

function confirmClearData() {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    appState.topics = [];
    appState.sessions = [];
    appState.analytics = {
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: []
    };
    
    saveDataToStorage();
    renderTopics();
    updateDashboard();
    renderCalendar();
    renderAnalytics();
    updateStudyTopicSelect();
    
    showNotification('All data has been cleared');
  }
}

// Storage Functions
function saveDataToStorage() {
  try {
    localStorage.setItem('studySchedulerData', JSON.stringify({
      topics: appState.topics,
      sessions: appState.sessions,
      analytics: appState.analytics,
      settings: appState.settings
    }));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

function loadDataFromStorage() {
  try {
    const savedData = localStorage.getItem('studySchedulerData');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      appState.topics = parsedData.topics || [];
      appState.sessions = parsedData.sessions || [];
      appState.analytics = parsedData.analytics || {
        dailyStats: [],
        weeklyStats: [],
        monthlyStats: []
      };
      appState.settings = parsedData.settings || {
        defaultStudyDuration: 25,
        dailyGoal: 120,
        theme: 'light'
      };
      
      // Ensure default settings are set
      if (!appState.settings.defaultStudyDuration) {
        appState.settings.defaultStudyDuration = 25;
      }
      if (!appState.settings.dailyGoal) {
        appState.settings.dailyGoal = 120;
      }
      if (!appState.settings.theme) {
        appState.settings.theme = 'light';
      }
      
      // Update UI settings
      elements.defaultDuration.value = appState.settings.defaultStudyDuration;
      elements.dailyGoal.value = appState.settings.dailyGoal;
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }
}

// Helper Functions
function formatDate(date) {
  date = new Date(date);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function formatTimeSpent(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}

function formatReviewDate(timestamp) {
  const reviewDate = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (reviewDate < today) {
    return 'Overdue';
  } else if (isSameDay(reviewDate, today)) {
    return 'Today';
  } else if (isSameDay(reviewDate, tomorrow)) {
    return 'Tomorrow';
  } else {
    return formatDate(reviewDate);
  }
}

function isSameDay(date1, date2) {
  date1 = new Date(date1);
  date2 = new Date(date2);
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);