"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Line } from "react-chartjs-2"
import { Flame, Trophy, TrendingUp } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

type HabitEntry = {
  date: Date
  completed: boolean
}

type Habit = {
  id: string
  name: string
  entries: HabitEntry[]
  streak: number
  longestStreak: number
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitName, setNewHabitName] = useState("")
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [timeRange, setTimeRange] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    const storedHabits = localStorage.getItem("habits")
    if (storedHabits) {
      setHabits(
        JSON.parse(storedHabits, (key, value) => {
          if (key === "date") return new Date(value)
          return value
        }),
      )
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        entries: [],
        streak: 0,
        longestStreak: 0,
      }
      setHabits([...habits, newHabit])
      setNewHabitName("")
    }
  }

  const toggleHabitCompletion = (date: Date) => {
    if (selectedHabit) {
      const updatedHabits = habits.map((habit) => {
        if (habit.id === selectedHabit.id) {
          const existingEntry = habit.entries.find((entry) => entry.date.toDateString() === date.toDateString())
          let newEntries
          if (existingEntry) {
            newEntries = habit.entries.map((entry) =>
              entry.date.toDateString() === date.toDateString() ? { ...entry, completed: !entry.completed } : entry,
            )
          } else {
            newEntries = [...habit.entries, { date, completed: true }]
          }

          // Calculate new streak
          const sortedEntries = newEntries.sort((a, b) => b.date.getTime() - a.date.getTime())
          let newStreak = 0
          for (const entry of sortedEntries) {
            if (entry.completed) {
              newStreak++
            } else {
              break
            }
          }

          return {
            ...habit,
            entries: newEntries,
            streak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
          }
        }
        return habit
      })
      setHabits(updatedHabits)
      setSelectedHabit(updatedHabits.find((h) => h.id === selectedHabit.id) || null)
    }
  }

  const getCompletionData = () => {
    if (!selectedHabit) return { labels: [], datasets: [] }

    const today = new Date()
    let labels: string[]
    let data: number[]

    if (timeRange === "monthly") {
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      data = labels.map((_, index) => {
        const month = index
        const year = today.getFullYear()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const completedDays = selectedHabit.entries.filter(
          (entry) => entry.completed && entry.date.getFullYear() === year && entry.date.getMonth() === month,
        ).length
        return completedDays / daysInMonth
      })
    } else {
      // yearly
      const currentYear = today.getFullYear()
      const startYear = currentYear - 4
      labels = Array.from({ length: 5 }, (_, i) => (startYear + i).toString())
      data = labels.map((year) => {
        const yearStart = new Date(Number.parseInt(year), 0, 1)
        const yearEnd = new Date(Number.parseInt(year), 11, 31)
        const daysInYear = (yearEnd.getTime() - yearStart.getTime()) / (1000 * 3600 * 24) + 1
        const completedDays = selectedHabit.entries.filter(
          (entry) => entry.completed && entry.date.getFullYear() === Number.parseInt(year),
        ).length
        return completedDays / daysInYear
      })
    }

    return {
      labels,
      datasets: [
        {
          label: "Habit Completion Rate",
          data,
          borderColor: "rgb(15, 164, 175)",
          backgroundColor: "rgba(15, 164, 175, 0.2)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "rgb(15, 164, 175)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#024950",
        },
      },
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: (value) => `${Math.round(value * 100)}%`,
          color: "#024950",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
            return `Completion rate: ${(value * 100).toFixed(2)}%`
          },
        },
      },
    },
  }

  const calculateProgress = (habit: Habit) => {
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)
    const completedDays = habit.entries.filter((entry) => entry.completed && entry.date >= last30Days).length
    return Math.round((completedDays / 30) * 100)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-[#024950] dark:text-[#AFDDE5]">Habit Tracker</h1>

      <Card className="bg-gradient-to-r from-[#024950] to-[#0FA4AF]">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center text-[#AFDDE5] mb-4">Build Better Habits, One Day at a Time</h2>
          <div className="flex space-x-4">
            <Input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter new habit name"
              className="flex-grow bg-white/10 text-[#AFDDE5] placeholder-[#AFDDE5]/60 border-[#AFDDE5]/20"
            />
            <Button onClick={addHabit} className="bg-[#AFDDE5] text-[#024950] hover:bg-white hover:text-[#0FA4AF]">
              Add Habit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#024950] dark:text-[#AFDDE5]">Your Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`p-4 rounded-lg transition-colors ${
                    selectedHabit?.id === habit.id
                      ? "bg-[#0FA4AF]/20 dark:bg-[#0FA4AF]/40"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Button
                      onClick={() => setSelectedHabit(habit)}
                      variant="ghost"
                      className="text-lg font-semibold text-[#024950] dark:text-[#AFDDE5] hover:text-[#0FA4AF] dark:hover:text-[#0FA4AF]"
                    >
                      {habit.name}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Flame className="text-orange-500" />
                      <span className="text-sm font-medium text-[#024950] dark:text-[#AFDDE5]">
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>
                  <Progress value={calculateProgress(habit)} className="h-2" />
                  <div className="flex justify-between mt-2 text-sm text-[#024950] dark:text-[#AFDDE5]">
                    <span>Progress: {calculateProgress(habit)}%</span>
                    <span>
                      <Trophy className="inline-block w-4 h-4 mr-1 text-yellow-500" />
                      Longest streak: {habit.longestStreak} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#024950] dark:text-[#AFDDE5]">Mark Habit Completion</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedHabit ? (
              <>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    completed: (date) =>
                      selectedHabit.entries.some(
                        (entry) => entry.date.toDateString() === date.toDateString() && entry.completed,
                      ),
                  }}
                  modifiersClassNames={{
                    completed: "bg-[#0FA4AF] text-[#AFDDE5]",
                  }}
                  components={{
                    DayContent: ({ date }) => (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        onClick={() => toggleHabitCompletion(date)}
                      >
                        <span className="cursor-pointer">{date.getDate()}</span>
                      </div>
                    ),
                  }}
                />
                <div className="mt-4 text-center">
                  <p className="text-[#024950] dark:text-[#AFDDE5] font-medium">
                    Current Streak: {selectedHabit.streak} days
                  </p>
                  <p className="text-[#024950] dark:text-[#AFDDE5] text-sm">
                    Keep it up! You're building a great habit.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center text-[#024950] dark:text-[#AFDDE5]">Select a habit to mark completion</p>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedHabit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#024950] dark:text-[#AFDDE5] flex items-center">
              <TrendingUp className="mr-2" />
              {selectedHabit.name} - {timeRange === "monthly" ? "Monthly" : "Yearly"} Completion History
            </CardTitle>
            <div className="flex space-x-2 mt-2">
              <Button variant={timeRange === "monthly" ? "default" : "outline"} onClick={() => setTimeRange("monthly")}>
                Monthly
              </Button>
              <Button variant={timeRange === "yearly" ? "default" : "outline"} onClick={() => setTimeRange("yearly")}>
                Yearly
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Line data={getCompletionData()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

