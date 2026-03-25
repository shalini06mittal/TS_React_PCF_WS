// src/pages/UserList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './UserList.css'

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string }
  address: { city: string }
}

// Generate a consistent avatar background from the user's id
function avatarColor(id: number): string {
  const palette = [
    '#2dd4bf', '#f59e0b', '#a78bfa', '#f87171',
    '#34d399', '#60a5fa', '#fb923c', '#e879f9',
    '#a3e635', '#38bdf8',
  ]
  return palette[(id - 1) % palette.length]
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export default function UserList() {
  const [users, setUsers]     = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<User[]>
      })
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch users')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="page">
        <div className="spinner-wrap">
          <div className="spinner" />
          <span className="spinner-label">fetching users…</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <div className="error-box">⚠ {error}</div>
      </main>
    )
  }

  return (
    <main className="page userlist-page">
      {/* Header */}
      <div className="userlist-header">
        <div>
          <span className="badge badge-teal">{users.length} users</span>
          <h1 className="userlist-title">User Directory</h1>
          <p className="userlist-sub">
            Data fetched live from{' '}
            <code className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>
              jsonplaceholder.typicode.com/users
            </code>
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="users-grid">
        {users.map(user => (
          <Link to={`/users/${user.id}`} key={user.id} className="user-card">
            {/* Avatar */}
            <div
              className="user-avatar"
              style={{ background: `${avatarColor(user.id)}22`, color: avatarColor(user.id) }}
            >
              {initials(user.name)}
            </div>

            {/* Info */}
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-username">@{user.username}</div>
            </div>

            {/* Meta */}
            <div className="user-meta">
              <span className="user-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {user.email}
              </span>
              <span className="user-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {user.address.city}
              </span>
            </div>

            <div className="user-company">{user.company.name}</div>

            <div className="user-arrow">→</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
