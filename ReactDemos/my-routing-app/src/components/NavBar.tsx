import React from 'react'

import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav>
      {/* NavLink adds 'active' class when route matches */}
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/users">Users</NavLink>

      {/* Link is a plain anchor - no active state */}
      <Link to="/about">Learn more</Link>
    </nav>

  )
}
