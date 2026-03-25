import { useParams } from 'react-router-dom'

// Type the params for TypeScript safety
type UserParams = {
  id: string
}

const users = [
  { id: '1', name: 'Alice Chen',  role: 'Engineer' },
  { id: '2', name: 'Bob Tanaka',  role: 'Designer' },
  { id: '3', name: 'Priya Das',   role: 'Product'  },
]

export default function UserDetail() {
 // Extract :id from the current URL
  const { id } = useParams<UserParams>()

  const user = users.find(u => u.id === id)

  if (!user) return <p>User not found</p>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.role}</p>
      <p>URL param id: {id}</p>
    </div>
  )

}
