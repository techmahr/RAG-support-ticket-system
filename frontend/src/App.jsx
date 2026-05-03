import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

// ─────────────────────────────────────────
// Styles — all in one place
// ─────────────────────────────────────────
const styles = {
  // Layout
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Inter, sans-serif',
    padding: '24px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },

  // Header
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  headerSubtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
  },

  // Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    margin: '0 0 20px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0f0',
  },

  // Form
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
    resize: 'vertical',
    minHeight: '100px',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#ffffff',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },

  // Button
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    fontFamily: 'Inter, sans-serif',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  },

  // Analysis result
  suggestionBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #86efac',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  suggestionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#166534',
    marginBottom: '6px',
  },
  suggestionText: {
    fontSize: '14px',
    color: '#15803d',
    margin: 0,
  },

  // Steps
  stepsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 12px 0',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '10px',
  },
  stepNumber: {
    minWidth: '24px',
    height: '24px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
  },
  stepText: {
    fontSize: '14px',
    color: '#374151',
    paddingTop: '3px',
  },

  // Confidence bar
  confidenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
  },
  confidenceLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    minWidth: '80px',
  },
  confidenceBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  confidenceValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4f46e5',
    minWidth: '40px',
  },

  // Similar tickets
  similarTicket: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '10px',
  },
  similarTicketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  ticketId: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4f46e5',
    backgroundColor: '#ede9fe',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  similarityBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  similarTicketTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a2e',
    margin: '0 0 4px 0',
  },
  similarTicketResolution: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },

  // Feedback
  feedbackRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  feedbackBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s',
  },
  feedbackHelpful: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    borderColor: '#86efac',
  },
  feedbackNotHelpful: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderColor: '#fca5a5',
  },

  // Disclaimer
  disclaimer: {
    fontSize: '12px',
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: '16px',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },

  // Error
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '14px',
    color: '#991b1b',
    fontSize: '14px',
    marginBottom: '16px',
  },

  // Loading
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    fontSize: '15px',
  },

  // Session info
  sessionInfo: {
    fontSize: '12px',
    color: '#9ca3af',
    textAlign: 'right',
    marginBottom: '8px',
  },

  // Category badge
  categoryBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '2px 8px',
    borderRadius: '4px',
    marginLeft: '8px',
  },
}

// ─────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────
export default function App() {
  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Authentication',
    priority: 'medium',
  })

  // App state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [feedbackGiven, setFeedbackGiven] = useState(false)

  // ─────────────────────────────────────
  // Handle form input changes
  // ─────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ─────────────────────────────────────
  // Submit ticket for analysis
  // ─────────────────────────────────────
  const handleSubmit = async () => {
    // Basic validation
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in both title and description')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setFeedbackGiven(false)

    try {
      const response = await axios.post(`${API_URL}/api/ticket/analyze`, {
        ...form,
        sessionId, // send existing sessionId for conversation memory
      })

      setResult(response.data)
      setSessionId(response.data.sessionId) // save for follow up questions

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─────────────────────────────────────
  // Submit feedback
  // ─────────────────────────────────────
  const handleFeedback = async (helpful) => {
    try {
      await axios.post(`${API_URL}/api/feedback`, {
        ticketId: sessionId,
        helpful,
        comment: helpful ? 'Marked helpful from UI' : 'Marked not helpful from UI',
      })
      setFeedbackGiven(true)
    } catch (err) {
      console.error('Feedback error:', err)
    }
  }

  // ─────────────────────────────────────
  // Reset for new ticket
  // ─────────────────────────────────────
  const handleNewTicket = () => {
    setForm({ title: '', description: '', category: 'Authentication', priority: 'medium' })
    setResult(null)
    setError(null)
    setSessionId(null)
    setFeedbackGiven(false)
  }

  // ─────────────────────────────────────
  // Render
  // ─────────────────────────────────────
  return (
    <div style={styles.app}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>🎫 Support Ticket AI Assistant</h1>
          <p style={styles.headerSubtitle}>
            Describe your issue and get AI-powered solutions based on past resolved tickets
          </p>
        </div>

        {/* Ticket Form */}
        <div style={styles.card}>
          <p style={styles.cardTitle}>📝 Submit a Ticket</p>

          {/* Session info */}
          {sessionId && (
            <p style={styles.sessionInfo}>
              Session: {sessionId.slice(0, 8)}... (follow-up questions will remember context)
            </p>
          )}

          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. User cannot login after password reset"
            />
          </div>

          {/* Category and Priority */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select style={styles.select} name="category" value={form.category} onChange={handleChange}>
                <option>Authentication</option>
                <option>Payment</option>
                <option>Email</option>
                <option>Performance</option>
                <option>API</option>
                <option>Export</option>
                <option>Mobile</option>
                <option>General</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Priority</label>
              <select style={styles.select} name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              style={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
            />
          </div>

          {/* Error */}
          {error && <div style={styles.error}>⚠️ {error}</div>}

          {/* Submit */}
          <button
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '🔍 Analyzing...' : '🚀 Analyze Ticket'}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.card}>
            <div style={styles.loading}>
              🤖 Searching knowledge base and generating solution...
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={styles.card}>
            <p style={styles.cardTitle}>
              💡 AI Suggestion
              <span style={styles.categoryBadge}>{result.ticket.category}</span>
            </p>

            {/* Suggestion */}
            <div style={styles.suggestionBox}>
              <p style={styles.suggestionTitle}>Suggested Solution</p>
              <p style={styles.suggestionText}>{result.analysis.suggestion}</p>
            </div>

            {/* Confidence */}
            <div style={styles.confidenceRow}>
              <span style={styles.confidenceLabel}>Confidence</span>
              <div style={styles.confidenceBar}>
                <div
                  style={{
                    ...styles.confidenceFill,
                    width: `${result.analysis.confidence}%`,
                  }}
                />
              </div>
              <span style={styles.confidenceValue}>{result.analysis.confidence}%</span>
            </div>

            {/* Steps */}
            <p style={styles.stepsTitle}>📋 Resolution Steps</p>
            {result.analysis.steps.map((step, index) => (
              <div key={index} style={styles.stepItem}>
                <div style={styles.stepNumber}>{index + 1}</div>
                <p style={styles.stepText}>{step}</p>
              </div>
            ))}

            {/* Similar Tickets */}
            <p style={{ ...styles.stepsTitle, marginTop: '20px' }}>
              🔍 Similar Past Tickets
            </p>
            {result.similarTickets.map((ticket) => (
              <div key={ticket.ticketId} style={styles.similarTicket}>
                <div style={styles.similarTicketHeader}>
                  <span style={styles.ticketId}>{ticket.ticketId}</span>
                  <span style={styles.similarityBadge}>{ticket.similarityScore}% match</span>
                </div>
                <p style={styles.similarTicketTitle}>{ticket.title}</p>
                <p style={styles.similarTicketResolution}>
                  {ticket.resolution.slice(0, 120)}...
                </p>
              </div>
            ))}

            {/* Disclaimer */}
            <p style={styles.disclaimer}>
              ⚠️ {result.analysis.disclaimer}
            </p>

            {/* Feedback */}
            {!feedbackGiven ? (
              <div style={styles.feedbackRow}>
                <button
                  style={{ ...styles.feedbackBtn, ...styles.feedbackHelpful }}
                  onClick={() => handleFeedback(true)}
                >
                  👍 This helped
                </button>
                <button
                  style={{ ...styles.feedbackBtn, ...styles.feedbackNotHelpful }}
                  onClick={() => handleFeedback(false)}
                >
                  👎 Not helpful
                </button>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '16px' }}>
                ✅ Thanks for your feedback!
              </p>
            )}

            {/* New Ticket Button */}
            <button
              style={{ ...styles.button, marginTop: '16px', backgroundColor: '#6b7280' }}
              onClick={handleNewTicket}
            >
              + New Ticket
            </button>
          </div>
        )}

      </div>
    </div>
  )
}