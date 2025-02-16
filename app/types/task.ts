export type TaskStatus = "pending" | "completed" | "missed"

export type Task = {
  id: string
  title: string
  description: string
  timeframe: string
  priority: number
  status: TaskStatus
  dueDate: string
  completedDate?: string
}

