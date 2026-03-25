import { Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import UserList from './pages/UserList'
import UserDetail from './pages/UserDetail'
import NotFound from './pages/NotFound'


function App() {
  return (
  <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/users"     element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
