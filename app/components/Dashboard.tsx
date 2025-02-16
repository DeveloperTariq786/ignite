"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TaskForm from "./TaskForm"
import type { Task, TaskStatus } from "../types/task"
import { Button } from "@/components/ui/button"
import type { Milestone } from "../types/milestone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [filter, setFilter] = useState<"all" | TaskStatus>("all")
  const [searchTerm, setSearchTerm] = useState("")
  //const [darkMode, setDarkMode] = useState(false) // Removed darkMode state

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
    const storedMilestones = localStorage.getItem("milestones")
    if (storedMilestones) {
      setMilestones(JSON.parse(storedMilestones))
    }
    //const storedDarkMode = localStorage.getItem("darkMode")
    //if (storedDarkMode) {
    //  setDarkMode(JSON.parse(storedDarkMode))
    //}
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("milestones", JSON.stringify(milestones))
  }, [milestones])

  //useEffect(() => {
  //  localStorage.setItem("darkMode", JSON.stringify(darkMode))
  //  if (darkMode) {
  //    document.documentElement.classList.add("dark")
  //  } else {
  //    document.documentElement.classList.remove("dark")
  //  }
  //}, [darkMode])

  useEffect(() => {
    const checkMissedTasks = () => {
      const now = new Date()
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status === "pending") {
            const dueDate = new Date(task.dueDate)
            const dayAfterDue = new Date(dueDate)
            dayAfterDue.setDate(dayAfterDue.getDate() + 1)
            dayAfterDue.setHours(23, 59, 59)

            if (todayMidnight > dayAfterDue) {
              return { ...task, status: "missed" }
            }
          }
          return task
        }),
      )
    }

    checkMissedTasks()
    const interval = setInterval(checkMissedTasks, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const addTask = (task: Omit<Task, "id" | "status" | "completedDate">) => {
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const dayAfterDue = new Date(dueDate)
    dayAfterDue.setDate(dayAfterDue.getDate() + 1)
    dayAfterDue.setHours(23, 59, 59)

    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: now > dayAfterDue ? "missed" : "pending",
      completedDate: undefined,
    }
    setTasks([...tasks, newTask])

    // Add to milestones if the timeframe is more than a month
    if (["monthly", "quarterly", "yearly", "3years", "5years", "lifelong"].includes(task.timeframe)) {
      const newMilestone: Milestone = {
        id: `milestone-${newTask.id}`,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        completed: false,
      }
      setMilestones([...milestones, newMilestone])
    }
  }

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              completedDate: status === "completed" ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const filteredTasks = tasks
    .filter((task) => filter === "all" || task.status === filter)
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  //const exportTasks = () => {
  //  const worksheet = XLSX.utils.json_to_sheet(tasks)
  //  const workbook = XLSX.utils.book_new()
  //  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks")
  //  XLSX.writeFile(workbook, "tasks.xlsx")
  //}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm addTask={addTask} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

