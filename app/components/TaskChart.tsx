import { useEffect, useRef } from "react"
import type { Task } from "../types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type TaskChartProps = {
  tasks: Task[]
}

export default function TaskChart({ tasks }: TaskChartProps) {
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const missedTasks = tasks.filter((task) => task.status === "missed").length

  const data = {
    labels: ["Completed", "Pending", "Missed"],
    datasets: [
      {
        data: [completedTasks, pendingTasks, missedTasks],
        backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgb(16, 185, 129)", "rgb(245, 158, 11)", "rgb(239, 68, 68)"],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Task Status Overview",
        font: {
          size: 16,
          weight: "bold",
        },
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
    <Card className="h-[400px]">
      <CardContent className="p-4 h-full">
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  )
}

