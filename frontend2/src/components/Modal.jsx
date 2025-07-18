import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const Modal = ({ children, title, onClose, size = 'medium' }) => {
  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '600px' },
    large: { maxWidth: '800px' }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" style={sizeClasses[size]}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

// Topic Form Modal Component
export const TopicFormModal = () => {
  const { state, dispatch } = useContext(AppContext)
  const { activeModal, modalData } = state.ui

  const isEditing = modalData && modalData.id
  const [formData, setFormData] = React.useState({
    title: '',
    subject: '',
    difficulty: 'medium',
    priority: 'medium',
    estimatedTime: 60,
    notes: '',
    tags: ''
  })

  useEffect(() => {
    if (isEditing && modalData) {
      setFormData({
        title: modalData.title || '',
        subject: modalData.subject || '',
        difficulty: modalData.difficulty || 'medium',
        priority: modalData.priority || 'medium',
        estimatedTime: modalData.estimatedTime || 60,
        notes: modalData.notes || '',
        tags: modalData.tags ? modalData.tags.join(', ') : ''
      })
    }
  }, [isEditing, modalData])

  const handleSubmit = (e) => {
    e.preventDefault()

    const topicData = {
      ...formData,
      estimatedTime: parseInt(formData.estimatedTime),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      ...(isEditing 
        ? { id: modalData.id }
        : {
            id: Date.now().toString(),
            timeSpent: 0,
            nextReview: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            repetitions: 0,
            easeFactor: 2.5,
            interval: 1,
            createdAt: new Date().toISOString(),
            lastStudied: null
          }
      )
    }

    dispatch({
      type: isEditing ? 'TOPIC_UPDATE' : 'TOPIC_ADD',
      payload: topicData
    })

    dispatch({
      type: 'NOTIFICATION_SHOW',
      payload: {
        message: `Topic ${isEditing ? 'updated' : 'created'} successfully!`,
        type: 'success'
      }
    })

    dispatch({ type: 'MODAL_CLOSE' })
  }

  const handleClose = () => {
    dispatch({ type: 'MODAL_CLOSE' })
  }

  if (activeModal !== 'topic-form') return null

  return (
    <Modal title={isEditing ? 'Edit Topic' : 'Add New Topic'} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Subject *</label>
          <input
            type="text"
            className="form-input"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <select
              className="form-select"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Est. Time (min)</label>
            <input
              type="number"
              className="form-input"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-input"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g. programming, web development, javascript"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes about this topic..."
            rows="3"
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Topic' : 'Create Topic'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// Confirmation Modal Component
export const ConfirmModal = () => {
  const { state, dispatch } = useContext(AppContext)
  const { activeModal, modalData } = state.ui

  const handleConfirm = () => {
    if (modalData.type === 'topic') {
      dispatch({ type: 'TOPIC_DELETE', payload: modalData.id })
      dispatch({
        type: 'NOTIFICATION_SHOW',
        payload: {
          message: 'Topic deleted successfully!',
          type: 'success'
        }
      })
    }
    dispatch({ type: 'MODAL_CLOSE' })
  }

  const handleClose = () => {
    dispatch({ type: 'MODAL_CLOSE' })
  }

  if (activeModal !== 'confirm-delete' || !modalData) return null

  return (
    <Modal title="Confirm Delete" onClose={handleClose} size="small">
      <p style={{ marginBottom: '1.5rem' }}>
        Are you sure you want to delete "{modalData.title}"? This action cannot be undone.
      </p>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-error" onClick={handleConfirm}>
          Delete
        </button>
      </div>
    </Modal>
  )
}

export default Modal