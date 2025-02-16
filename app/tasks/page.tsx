"use client"
import { useState, useEffect } from "react"
import TaskList from "../components/TaskList"
import type { Task, TaskStatus } from "../types/task"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"all" | TaskStatus>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status,
            completedDate: status === "completed" ? new Date().toISOString() : undefined,
          }
        : task,
    )
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const filteredTasks = tasks
    .filter((task) => filter === "all" || task.status === filter)
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Task Management</h1>
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as "all" | TaskStatus)}>
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="missed">Missed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TaskList tasks={filteredTasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
        </TabsContent>
        <TabsContent value="pending">
          <TaskList tasks={filteredTasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
        </TabsContent>
        <TabsContent value="completed">
          <TaskList tasks={filteredTasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
        </TabsContent>
        <TabsContent value="missed">
          <TaskList tasks={filteredTasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

