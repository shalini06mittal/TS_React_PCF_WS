import { useState, useEffect, useRef } from 'react'
 
interface AddTodoFormProps {
  onAdd: (text: string) => void   // called when user submits
}
 
function AddTodoForm({ onAdd }: AddTodoFormProps) {
  // Controlled input state
  const [text, setText] = useState<string>("")

      // 1. Create the ref — starts as null, will point to the <input> DOM node
  const inputRef = useRef<HTMLInputElement>(null)

   // 2. After mount, focus the input
  useEffect(() => {
    inputRef.current?.focus()   // ?. safely handles the null case
  }, [])                        // [] = run once on mount

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()             // stop the browser from refreshing the page
    if (!text.trim()) return        // do nothing if input is empty or whitespace
    onAdd(text.trim())             // send the trimmed text up to the parent
    setText("")                    // clear the input after submitting
  }
 
  return (
    <form
      onSubmit={handleSubmit}
      style={{ display:"flex", gap:"8px", marginBottom:"1.5rem" }}
    >
      <input
        ref={inputRef}      // 3. Attach ref to the DOM node
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          fontSize: "14px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#0D9488",
          color: "white",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Add
      </button>
    </form>
  )
}
 
export default AddTodoForm
