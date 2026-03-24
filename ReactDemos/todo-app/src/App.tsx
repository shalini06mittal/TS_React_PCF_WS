import TodoItem from './components/TodoItem'
import TodoList from './components/TodoList'
import { dummyTodos } from './data/todo'


function App() {

  return (
    
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>My Todos</h1>
      {/* Render just the first todo to verify props work */}
      {/* <TodoItem todo={dummyTodos[0]} /> */}
      <TodoList/>
    </div>
  )
}

export default App
