import type { Todo } from '../types/todo'
 
// Props interface: what this component expects from its parent
interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => void   // new prop
  onToggle: (id: number) => void   // new prop
}
 
function TodoItem({ todo, onDelete, onToggle }: TodoItemProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      marginBottom: "8px",
      background: todo.done ? "#f8fafc" : "#ffffff",
    }}>
      {/* Checkbox — clicking it calls onToggle */}
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        style={{ width:"18px", height:"18px", cursor:"pointer", accentColor:"#0D9488" }}
      />
 
      <div style={{ flex: 1 }}>
      <p style={{
        margin: '0 0 4px',
        textDecoration: todo.done ? "line-through" : "none",
        color: todo.done ? '#94a3b8' : '#1a2b4a',
        fontWeight: '500',
      }}>
        {todo.text}
      </p>
      <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
        Created: {todo.createdAt.toLocaleDateString()}
      </p>
      </div>
            {/* Delete button — calls onDelete with this todo id */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          border: "none",
          background: "transparent",
          color: "#ef4444",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        ✕
      </button>

    </div>
    
  )
}
 
export default TodoItem
