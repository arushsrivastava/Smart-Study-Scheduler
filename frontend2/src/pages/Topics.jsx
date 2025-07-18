import React, { useContext, useState, useMemo } from 'react'
import { AppContext } from '../context/AppContext'
import TopicCard from '../components/TopicCard'
import { TopicFormModal, ConfirmModal } from '../components/Modal'

const Topics = () => {
  const { state, dispatch } = useContext(AppContext)
  const { topics } = state

  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [sortBy, setSortBy] = useState('created') // created, title, progress, priority

  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(topics.map(topic => topic.subject))]
    return uniqueSubjects.sort()
  }, [topics])

  const filteredAndSortedTopics = useMemo(() => {
    let filtered = topics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           topic.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (topic.tags && topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))

      const matchesSubject = !filterSubject || topic.subject === filterSubject
      const matchesDifficulty = !filterDifficulty || topic.difficulty === filterDifficulty
      const matchesPriority = !filterPriority || topic.priority === filterPriority

      return matchesSearch && matchesSubject && matchesDifficulty && matchesPriority
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'progress':
          const progressA = a.estimatedTime > 0 ? (a.timeSpent / a.estimatedTime) : 0
          const progressB = b.estimatedTime > 0 ? (b.timeSpent / b.estimatedTime) : 0
          return progressB - progressA
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'created':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return filtered
  }, [topics, searchTerm, filterSubject, filterDifficulty, filterPriority, sortBy])

  const handleAddTopic = () => {
    dispatch({
      type: 'MODAL_OPEN',
      payload: { modal: 'topic-form' }
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterSubject('')
    setFilterDifficulty('')
    setFilterPriority('')
    setSortBy('created')
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Topics ({filteredAndSortedTopics.length})</h1>
          <button className="btn btn-primary" onClick={handleAddTopic}>
            ➕ Add New Topic
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Search Topics</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title, subject, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created">Recently Created</option>
                <option value="title">Title (A-Z)</option>
                <option value="progress">Progress</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-3" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {(searchTerm || filterSubject || filterDifficulty || filterPriority || sortBy !== 'created') && (
            <button className="btn btn-sm btn-secondary" onClick={clearFilters}>
              🗑️ Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Topics List */}
      {filteredAndSortedTopics.length > 0 ? (
        <div>
          {filteredAndSortedTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>No Topics Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Start building your study schedule by adding your first topic.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleAddTopic}>
            📚 Add Your First Topic
          </button>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>No Topics Match Your Filters</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Try adjusting your search terms or filters.
          </p>
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Modals */}
      <TopicFormModal />
      <ConfirmModal />
    </div>
  )
}

export default Topics