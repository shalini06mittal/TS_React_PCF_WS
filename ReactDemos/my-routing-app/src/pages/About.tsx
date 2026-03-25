// src/pages/About.tsx
import './About.css'

export default function About() {
  const concepts = [
    {
      term: 'BrowserRouter',
      def: 'Wraps your entire app. Provides the routing context to every component in the tree via the React Context API.',
    },
    {
      term: 'Routes',
      def: 'The container that holds all your Route definitions. Only the first matching route renders — no fall-through.',
    },
    {
      term: 'Route',
      def: 'Maps a URL pattern (path) to a component (element). Supports exact strings, dynamic :params, and * wildcards.',
    },
    {
      term: 'Link',
      def: 'Renders an <a> tag that uses client-side navigation. No full page reload — React swaps the component instead.',
    },
    {
      term: 'NavLink',
      def: 'Like Link but adds an "active" class when the current URL matches the to prop. Perfect for navigation bars.',
    },
    {
      term: 'useParams()',
      def: 'Hook that returns the dynamic segments of the matched URL. e.g. on /users/42, useParams() gives { id: "42" }.',
    },
    {
      term: 'useNavigate()',
      def: 'Hook that returns a navigate function. Call navigate("/path") to programmatically push or replace routes.',
    },
    {
      term: 'useLocation()',
      def: 'Hook that returns the current location object — pathname, search, hash, and any state passed during navigation.',
    },
  ]

  const stack = [
    { label: 'React',              version: '18',   color: '#61dafb' },
    { label: 'TypeScript',         version: '5',    color: '#3178c6' },
    { label: 'Vite',               version: '5',    color: '#a78bfa' },
    { label: 'React Router',       version: '6',    color: '#2dd4bf' },
    { label: 'JSONPlaceholder',    version: 'API',  color: '#f59e0b' },
  ]

  return (
    <main className="page about-page">
      {/* Header */}
      <div className="about-header">
        <span className="badge badge-teal">Lab 08</span>
        <h1 className="about-title">About this lab</h1>
        <p className="about-sub">
          This project is a minimal but complete routing demonstration built with
          React, TypeScript, and Vite. Every page maps to a real route. User data
          is fetched live from{' '}
          <a
            href="https://jsonplaceholder.typicode.com"
            target="_blank"
            rel="noreferrer"
            className="about-link"
          >
            JSONPlaceholder
          </a>
          .
        </p>
      </div>

      {/* Tech stack */}
      <section className="about-section">
        <h2 className="about-section-title">Tech stack</h2>
        <div className="stack-pills">
          {stack.map(s => (
            <div className="stack-pill" key={s.label} style={{ '--pill-color': s.color } as React.CSSProperties}>
              <span className="stack-dot" />
              <span className="stack-label">{s.label}</span>
              <span className="stack-version">v{s.version}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Concepts */}
      <section className="about-section">
        <h2 className="about-section-title">Key concepts covered</h2>
        <div className="concepts-list">
          {concepts.map((c) => (
            <div className="concept-row" key={c.term}>
              <code className="concept-term">{c.term}</code>
              <p className="concept-def">{c.def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API note */}
      <section className="about-section">
        <div className="api-card">
          <div className="api-card-header">
            <span className="badge badge-amber">API</span>
            <h3>JSONPlaceholder</h3>
          </div>
          <p>
            User data is fetched from{' '}
            <code>https://jsonplaceholder.typicode.com/users</code>.
            It's a free, public REST API designed for testing and prototyping.
            No API key required.
          </p>
          <div className="api-endpoints">
            <div className="api-endpoint">
              <span className="method">GET</span>
              <code>/users</code>
              <span className="endpoint-desc">Returns all 10 users</span>
            </div>
            <div className="api-endpoint">
              <span className="method">GET</span>
              <code>/users/:id</code>
              <span className="endpoint-desc">Returns a single user</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
