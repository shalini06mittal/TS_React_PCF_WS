import type { Todo } from '../types/todo'
 
export const dummyTodos: Todo[] = [
  {
    id:        1,
    text:      "Review quarterly portfolio report",
    done:      false,
    createdAt: new Date('2025-06-01'),
  },
  {
    id:        2,
    text:      "Schedule meeting with risk analyst",
    done:      true,
    createdAt: new Date('2025-06-02'),
  },
  {
    id:        3,
    text:      "Update asset allocation spreadsheet",
    done:      false,
    createdAt: new Date('2025-06-03'),
  },
]
