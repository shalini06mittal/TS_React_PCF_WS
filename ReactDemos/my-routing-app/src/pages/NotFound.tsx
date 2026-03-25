// src/pages/NotFound.tsx
import { Link, useLocation } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const location = useLocation()

  return (
    <main className="page notfound-page">
      <div className="notfound-inner">
        {/* Glitch number */}
        <div className="notfound-code" aria-hidden>
          <span className="notfound-code-main">404</span>
          <span className="notfound-code-ghost">404</span>
        </div>

        <h1 className="notfound-title">Route not found</h1>

        <p className="notfound-body">
          No route matched{' '}
          <code className="notfound-path">{location.pathname}</code>.
          The <code>path="*"</code> wildcard caught this request and rendered
          this fallback component.
        </p>

        {/* Educational note */}
        <div className="notfound-note">
          <span className="note-label">How this works</span>
          <p>
            In React Router, a{' '}
            <code>{'<Route path="*" element={<NotFound />} />'}</code>{' '}
            at the end of your route table catches every URL that didn't match
            any earlier route. It's your custom 404 handler.
          </p>
        </div>

        {/* Actions */}
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            ← Go home
          </Link>
          <Link to="/users" className="btn btn-ghost">
            Browse users
          </Link>
        </div>
      </div>
    </main>
  )
}
