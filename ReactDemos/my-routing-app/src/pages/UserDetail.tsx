// src/pages/UserDetail.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './UserDetail.css'

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: { lat: string; lng: string }
  }
}

function avatarColor(id: number): string {
  const palette = [
    '#2dd4bf', '#f59e0b', '#a78bfa', '#f87171',
    '#34d399', '#60a5fa', '#fb923c', '#e879f9',
    '#a3e635', '#38bdf8',
  ]
  return palette[(id - 1) % palette.length]
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function UserDetail() {
  // ── Read :id from the URL ──────────────────────────────────────────
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`User not found (HTTP ${res.status})`)
        return res.json() as Promise<User>
      })
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch user')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="page">
        <div className="spinner-wrap">
          <div className="spinner" />
          <span className="spinner-label">loading user {id}…</span>
        </div>
      </main>
    )
  }

  if (error || !user) {
    return (
      <main className="page">
        <Link to="/users" className="back-link">← Back to users</Link>
        <div className="error-box" style={{ marginTop: 24 }}>⚠ {error}</div>
      </main>
    )
  }

  const color = avatarColor(user.id)

  return (
    <main className="page detail-page">
      {/* Back + breadcrumb */}
      <nav className="detail-breadcrumb">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <span className="breadcrumb-sep">/</span>
        <Link to="/users" className="breadcrumb-link">Users</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{user.name}</span>
      </nav>

      {/* Profile hero */}
      <div className="detail-hero">
        <div
          className="detail-avatar"
          style={{ background: `${color}20`, color }}
        >
          {initials(user.name)}
        </div>

        <div className="detail-hero-info">
          <h1 className="detail-name">{user.name}</h1>
          <div className="detail-handle">@{user.username}</div>
          <div className="detail-company">{user.company.name}</div>
        </div>

        {/* URL param highlight — for educational purposes */}
        <div className="param-box">
          <div className="param-box-label">useParams() returned</div>
          <code className="param-value">id: "{id}"</code>
          <div className="param-box-note">
            Extracted from the URL segment <code>:id</code>
          </div>
        </div>
      </div>

      {/* Detail sections */}
      <div className="detail-grid">

        {/* Contact */}
        <section className="detail-card">
          <h2 className="detail-card-title">Contact</h2>
          <dl className="detail-dl">
            <div className="dl-row">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${user.email}`} className="detail-link">
                  {user.email}
                </a>
              </dd>
            </div>
            <div className="dl-row">
              <dt>Phone</dt>
              <dd>{user.phone}</dd>
            </div>
            <div className="dl-row">
              <dt>Website</dt>
              <dd>
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-link"
                >
                  {user.website}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        {/* Address */}
        <section className="detail-card">
          <h2 className="detail-card-title">Address</h2>
          <dl className="detail-dl">
            <div className="dl-row">
              <dt>Street</dt>
              <dd>{user.address.street}, {user.address.suite}</dd>
            </div>
            <div className="dl-row">
              <dt>City</dt>
              <dd>{user.address.city}</dd>
            </div>
            <div className="dl-row">
              <dt>Zipcode</dt>
              <dd>{user.address.zipcode}</dd>
            </div>
            <div className="dl-row">
              <dt>Coordinates</dt>
              <dd className="mono" style={{ fontSize: 12 }}>
                {user.address.geo.lat}, {user.address.geo.lng}
              </dd>
            </div>
          </dl>
        </section>

        {/* Company */}
        <section className="detail-card detail-card--wide">
          <h2 className="detail-card-title">Company</h2>
          <div className="company-name">{user.company.name}</div>
          <p className="company-catchphrase">"{user.company.catchPhrase}"</p>
          <p className="company-bs">{user.company.bs}</p>
        </section>

      </div>

      {/* Navigation between users */}
      <div className="detail-nav">
        {user.id > 1 && (
          <Link to={`/users/${user.id - 1}`} className="detail-nav-btn">
            ← User {user.id - 1}
          </Link>
        )}
        <Link to="/users" className="detail-nav-btn detail-nav-btn--center">
          All users
        </Link>
        {user.id < 10 && (
          <Link to={`/users/${user.id + 1}`} className="detail-nav-btn detail-nav-btn--right">
            User {user.id + 1} →
          </Link>
        )}
      </div>
    </main>
  )
}
