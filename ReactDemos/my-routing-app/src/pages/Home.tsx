// src/pages/Home.tsx
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <main className="page home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="badge badge-teal">React Router v6 Lab</span>
        </div>

        <h1 className="hero-title">
          Client-side routing,
          <br />
          <em>demystified.</em>
        </h1>

        <p className="hero-sub">
          A hands-on lab covering routes, dynamic segments, and navigation
          patterns in React&nbsp;+&nbsp;TypeScript. Real users fetched from a live API.
        </p>

        <div className="hero-actions">
          <Link to="/users" className="btn btn-primary">
            Browse Users →
          </Link>
          <Link to="/about" className="btn btn-ghost">
            About this lab
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>Route Table</h3>
          <p>
            Define all routes in one place with <code>&lt;Routes&gt;</code> and{' '}
            <code>&lt;Route&gt;</code>. Each path maps to exactly one component.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3>Dynamic Segments</h3>
          <p>
            Use <code>:id</code> in a path to match anything. Read it back with{' '}
            <code>useParams()</code> inside the matched component.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Client-side Nav</h3>
          <p>
            <code>&lt;Link&gt;</code> and <code>&lt;NavLink&gt;</code> swap
            components without a full page reload — instant transitions.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3>useNavigate</h3>
          <p>
            Trigger navigation from code — after a form submit, a timeout,
            or any async action — using the <code>useNavigate()</code> hook.
          </p>
        </div>
      </section>

      {/* Route map */}
      <section className="route-map">
        <h2 className="section-title">Routes in this project</h2>
        <div className="route-list">
          {[
            { path: '/',           label: 'Home',        type: 'exact',    desc: 'This page' },
            { path: '/about',      label: 'About',       type: 'exact',    desc: 'Lab overview' },
            { path: '/users',      label: 'UserList',    type: 'exact',    desc: 'All users from API' },
            { path: '/users/:id',  label: 'UserDetail',  type: 'dynamic',  desc: 'Single user by ID' },
            { path: '*',           label: 'NotFound',    type: 'fallback', desc: 'Unmatched paths' },
          ].map(r => (
            <div className="route-row" key={r.path}>
              <code className="route-path">{r.path}</code>
              <span className={`badge ${r.type === 'dynamic' ? 'badge-amber' : r.type === 'fallback' ? 'badge-fallback' : 'badge-teal'}`}>
                {r.type}
              </span>
              <span className="route-component">{r.label}</span>
              <span className="route-desc">{r.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
