import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

const styles = {
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
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    backgroundColor: '#ffffff',
    padding: '6px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  tab: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    color: '#6b7280',
  },
  tabActive: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
  },
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
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  },
  buttonGray: {
    backgroundColor: '#6b7280',
  },
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
  },
  confidenceValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4f46e5',
    minWidth: '40px',
  },
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
  disclaimer: {
    fontSize: '12px',
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: '16px',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '14px',
    color: '#991b1b',
    fontSize: '14px',
    marginBottom: '16px',
  },
  success: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #86efac',
    borderRadius: '8px',
    padding: '14px',
    color: '#166534',
    fontSize: '14px',
    marginBottom: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    fontSize: '15px',
  },
  sessionInfo: {
    fontSize: '12px',
    color: '#9ca3af',
    textAlign: 'right',
    marginBottom: '8px',
  },
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

  // ── CSV Upload styles ──
  uploadArea: {
    border: '2px dashed #e5e7eb',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '16px',
  },
  uploadAreaActive: {
    border: '2px dashed #4f46e5',
    backgroundColor: '#ede9fe',
  },
  uploadIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  uploadTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '6px',
  },
  uploadSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
  },
  fileSelected: {
    backgroundColor: '#ede9fe',
    border: '1px solid #c4b5fd',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4f46e5',
  },
  fileSize: {
    fontSize: '12px',
    color: '#6b7280',
  },
  removeFile: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '0',
  },
  templateBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  templateTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  templateCode: {
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#6b7280',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  previewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '13px',
    color: '#374151',
  },
}

// ─────────────────────────────────────────
// Tab 1 — Analyze Ticket
// ─────────────────────────────────────────
function AnalyzeTab() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Authentication',
    priority: 'medium',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [feedbackGiven, setFeedbackGiven] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
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
        sessionId,
      })
      setResult(response.data)
      setSessionId(response.data.sessionId)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

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

  const handleNewTicket = () => {
    setForm({ title: '', description: '', category: 'Authentication', priority: 'medium' })
    setResult(null)
    setError(null)
    setSessionId(null)
    setFeedbackGiven(false)
  }

  return (
    <>
      <div style={styles.card}>
        <p style={styles.cardTitle}>📝 Submit a Ticket</p>
        {sessionId && (
          <p style={styles.sessionInfo}>
            Session: {sessionId.slice(0, 8)}... (follow-up questions remember context)
          </p>
        )}
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
        {error && <div style={styles.error}>⚠️ {error}</div>}
        <button
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '🔍 Analyzing...' : '🚀 Analyze Ticket'}
        </button>
      </div>

      {loading && (
        <div style={styles.card}>
          <div style={styles.loading}>
            🤖 Searching knowledge base and generating solution...
          </div>
        </div>
      )}

      {result && !loading && (
        <div style={styles.card}>
          <p style={styles.cardTitle}>
            💡 AI Suggestion
            <span style={styles.categoryBadge}>{result.ticket.category}</span>
          </p>
          <div style={styles.suggestionBox}>
            <p style={styles.suggestionTitle}>Suggested Solution</p>
            <p style={styles.suggestionText}>{result.analysis.suggestion}</p>
          </div>
          <div style={styles.confidenceRow}>
            <span style={styles.confidenceLabel}>Confidence</span>
            <div style={styles.confidenceBar}>
              <div style={{ ...styles.confidenceFill, width: `${result.analysis.confidence}%` }} />
            </div>
            <span style={styles.confidenceValue}>{result.analysis.confidence}%</span>
          </div>
          <p style={styles.stepsTitle}>📋 Resolution Steps</p>
          {result.analysis.steps.map((step, index) => (
            <div key={index} style={styles.stepItem}>
              <div style={styles.stepNumber}>{index + 1}</div>
              <p style={styles.stepText}>{step}</p>
            </div>
          ))}
          <p style={{ ...styles.stepsTitle, marginTop: '20px' }}>🔍 Similar Past Tickets</p>
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
          <p style={styles.disclaimer}>⚠️ {result.analysis.disclaimer}</p>
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
          <button
            style={{ ...styles.button, marginTop: '16px', ...styles.buttonGray }}
            onClick={handleNewTicket}
          >
            + New Ticket
          </button>
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────
// Tab 2 — Upload CSV
// ─────────────────────────────────────────
function UploadTab() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Only CSV files are allowed')
      return
    }
    setFile(selectedFile)
    setError(null)
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    handleFileSelect(dropped)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    // FormData is used to send files via HTTP
    // It creates a multipart/form-data request
    const formData = new FormData()
    formData.append('file', file) // 'file' must match upload.single('file') in backend

    try {
      const response = await axios.post(`${API_URL}/api/ingest/csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(response.data)
      setFile(null)
    } catch (err) {
      const errData = err.response?.data
      if (errData?.details) {
        setError(`Validation errors:\n${errData.details.join('\n')}`)
      } else {
        setError(errData?.error || 'Upload failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const csvTemplate = `id,title,description,category,priority,resolution,resolvedAt
T-3001,Example ticket title,Detailed description of the issue,Authentication,high,How the issue was resolved,2024-03-01`

  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>📁 Upload Tickets CSV</p>

      {/* CSV Template */}
      <div style={styles.templateBox}>
        <p style={styles.templateTitle}>📋 Required CSV Format:</p>
        <p style={styles.templateCode}>{csvTemplate}</p>
      </div>

      {/* Required columns info */}
      <div style={{ ...styles.templateBox, marginBottom: '20px' }}>
        <p style={styles.templateTitle}>Required columns:</p>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
          <strong>id, title, description, category, resolution</strong> — required
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>priority, resolvedAt</strong> — optional
        </p>
      </div>

      {/* Drop zone */}
      {!file && (
        <div
          style={{
            ...styles.uploadArea,
            ...(dragging ? styles.uploadAreaActive : {}),
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('csvInput').click()}
        >
          <div style={styles.uploadIcon}>📂</div>
          <p style={styles.uploadTitle}>
            {dragging ? 'Drop it here!' : 'Drag & drop your CSV file here'}
          </p>
          <p style={styles.uploadSubtitle}>or click to browse files</p>
          <input
            id="csvInput"
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>
      )}

      {/* File selected */}
      {file && (
        <div style={styles.fileSelected}>
          <div>
            <p style={styles.fileName}>📄 {file.name}</p>
            <p style={styles.fileSize}>{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <button style={styles.removeFile} onClick={() => setFile(null)}>✕</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ ...styles.error, whiteSpace: 'pre-line' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {result && (
        <div style={styles.success}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
            ✅ {result.message}
          </p>
          {result.preview && (
            <>
              <p style={{ margin: '8px 0 4px 0', fontSize: '13px', fontWeight: '500' }}>
                Preview of ingested tickets:
              </p>
              {result.preview.map((t, i) => (
                <div key={i} style={styles.previewItem}>
                  <span style={styles.ticketId}>{t.id}</span>
                  <span>{t.title}</span>
                  <span style={styles.categoryBadge}>{t.category}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Upload button */}
      <button
        style={{
          ...styles.button,
          ...(loading || !file ? styles.buttonDisabled : {}),
        }}
        onClick={handleUpload}
        disabled={loading || !file}
      >
        {loading ? '⏳ Uploading & Ingesting...' : '🚀 Upload & Ingest'}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────
// Main App
// ─────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('analyze')

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>🎫 Support Ticket AI Assistant</h1>
          <p style={styles.headerSubtitle}>
            AI-powered support ticket system using RAG architecture
          </p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { id: 'analyze', label: '🤖 Analyze Ticket' },
            { id: 'upload', label: '📁 Upload Tickets' },
          ].map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'analyze' && <AnalyzeTab />}
        {activeTab === 'upload' && <UploadTab />}

      </div>
    </div>
  )
}