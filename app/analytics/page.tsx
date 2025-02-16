"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "../types/task"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const missedTasks = tasks.filter((task) => task.status === "missed").length

  const statusData = {
    labels: ["Completed", "Pending", "Missed"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [completedTasks, pendingTasks, missedTasks],
        backgroundColor: ["rgba(15, 164, 175, 0.8)", "rgba(175, 221, 229, 0.8)", "rgba(150, 71, 52, 0.8)"],
        borderColor: ["rgb(15, 164, 175)", "rgb(175, 221, 229)", "rgb(150, 71, 52)"],
        borderWidth: 1,
      },
    ],
  }

  const timeframeData = {
    labels: ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly", "Long-term"],
    datasets: [
      {
        label: "Tasks by Timeframe",
        data: [
          tasks.filter((t) => t.timeframe === "daily").length,
          tasks.filter((t) => t.timeframe === "weekly").length,
          tasks.filter((t) => t.timeframe === "monthly").length,
          tasks.filter((t) => t.timeframe === "quarterly").length,
          tasks.filter((t) => t.timeframe === "yearly").length,
          tasks.filter((t) => ["3years", "5years", "lifelong"].includes(t.timeframe)).length,
        ],
        borderColor: "rgb(15, 164, 175)",
        backgroundColor: "rgba(15, 164, 175, 0.5)",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#024950] dark:text-[#AFDDE5]">Task Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#AFDDE5] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#003135] dark:text-[#AFDDE5]">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#024950] dark:text-[#0FA4AF]">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#AFDDE5] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#003135] dark:text-[#AFDDE5]">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#024950] dark:text-[#0FA4AF]">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#AFDDE5] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#003135] dark:text-[#AFDDE5]">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#024950] dark:text-[#0FA4AF]">{pendingTasks}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#AFDDE5] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#003135] dark:text-[#AFDDE5]">Missed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#024950] dark:text-[#0FA4AF]">{missedTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#024950] dark:text-[#AFDDE5]">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Bar data={statusData} options={options} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#024950] dark:text-[#AFDDE5]">Tasks by Timeframe</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Line data={timeframeData} options={options} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#024950] dark:text-[#AFDDE5]">Task Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#0FA4AF] dark:text-[#AFDDE5]">
              {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <div className="text-sm text-[#024950] dark:text-[#AFDDE5] mt-1">Overall completion rate</div>
          </div>
          <div className="h-4 bg-[#AFDDE5] dark:bg-[#003135] rounded-full mt-4">
            <div
              className="h-4 bg-[#0FA4AF] dark:bg-[#024950] rounded-full"
              style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

