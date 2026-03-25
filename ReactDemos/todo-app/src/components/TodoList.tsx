import { useState, useEffect, useRef } from 'react'
import type { Todo } from '../types/todo'
import { dummyTodos } from '../data/todo'
import TodoItem from './TodoItem'
import AddTodoForm from './AddTodoForm'
function TodoList() {
  // State: the array of todos
  // Initialised from dummyTodos — every todo starts here
//   const [todos, setTodos] = useState<Todo[]>(dummyTodos)
 
  const [todos,     setTodos]     = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error,     setError]     = useState<string | null>(null)

  const renderCount = useRef<number>(0)
  renderCount.current += 1   // increment on every render, no re-render triggered
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setTodos(dummyTodos)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const deleteTodo = (id: number) => {
  // filter returns a NEW array with every todo EXCEPT the one with this id
  setTodos(todos.filter((todo) => todo.id !== id))
}

  const addTodo = (text: string) => {
      const newTodo: Todo = {
        id:        Date.now(),   // simple unique id: current timestamp as number
        text:      text,
        done:      false,        // all new todos start as not done
        createdAt: new Date(),   // current date and time — the default value
      }
      // Spread the existing array and append the new todo at the end
      setTodos([...todos, newTodo])
}

const toggleTodo = (id: number) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, done: !todo.done }  // this todo: flip done
        : todo                           // all others: unchanged
    )
  )
}


  // Runs once on mount — simulates a fetch call
  useEffect(() => {
    setIsLoading(true)
 
    // Simulate a 1-second network delay
    const timer = setTimeout(() => {
      try {
        throw new Error('soemthing is wrong')
        // In a real app: const data = await fetch("/api/todos")
        setTodos(dummyTodos)
        setIsLoading(false)
      } catch (e) {
        setError("Failed to load todos")
        setIsLoading(false)
      }
    }, 1000)
 
    // Cleanup: cancel the timer if the component unmounts early
    return () => clearTimeout(timer)
 
  }, []) // empty array = run once on mount
 
  // Render: show different UI for each state
  if (isLoading) return <p>Loading tasks...</p>
  if (error)     return <p style={{ color: "red" }}>{error}</p>

  return (
    <div>
      {/* <AddTodoForm onAdd={(text) => console.log("Will add:", text)} /> */}
      <p style={{ fontSize:"11px", color:"#cbd5e1", textAlign:"right" }}>
        renders: {renderCount.current}
      </p>

      <AddTodoForm onAdd={addTodo} />
      <h2>Tasks ({todos.length})</h2>
 
      {todos.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No tasks yet. Add one below.</p>
      )}
 
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
        />
      ))}
    </div>
  )
}
 
export default TodoList
