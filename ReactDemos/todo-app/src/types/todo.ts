export interface Todo {
  id:        number         // unique identifier for each todo
  text:      string         // the todo description
  done:      boolean        // false = pending, true = completed
  createdAt: Date           // when was it created
}
