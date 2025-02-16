"use client"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Car, Flag, ChevronDown, ChevronUp, Clock } from "lucide-react"
import type { Milestone } from "../types/milestone"
import type { Task } from "../types/task"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([])
  const [progressIncrement, setProgressIncrement] = useState<number>(10)
  const [countdowns, setCountdowns] = useState<{ [key: string]: ReturnType<typeof getCountdown> }>({})

  useEffect(() => {
    const storedMilestones = localStorage.getItem("milestones")
    const storedTasks = localStorage.getItem("tasks")
    if (storedMilestones) {
      setMilestones(JSON.parse(storedMilestones))
    }
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  const toggleMilestoneExpansion = (id: string) => {
    setExpandedMilestones((prev) => (prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]))
  }

  const incrementProgress = (id: string) => {
    const updatedMilestones = milestones.map((milestone) => {
      if (milestone.id === id) {
        const newProgress = Math.min(100, (milestone.progress || 0) + progressIncrement)
        return { ...milestone, progress: newProgress }
      }
      return milestone
    })
    setMilestones(updatedMilestones)
    localStorage.setItem("milestones", JSON.stringify(updatedMilestones))
    setProgressIncrement(10) // Reset to default value
  }

  const completeMilestone = (id: string) => {
    const updatedMilestones = milestones.map((milestone) =>
      milestone.id === id ? { ...milestone, completed: true, progress: 100 } : milestone,
    )
    setMilestones(updatedMilestones)
    localStorage.setItem("milestones", JSON.stringify(updatedMilestones))

    // Complete related tasks
    const completedMilestone = updatedMilestones.find((m) => m.id === id)
    if (completedMilestone) {
      const updatedTasks = tasks.map((task) => {
        if (task.title === completedMilestone.title && task.status !== "completed") {
          return { ...task, status: "completed", completedDate: new Date().toISOString() }
        }
        return task
      })
      setTasks(updatedTasks)
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    }
  }

  // Sort milestones by due date
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const completedCount = sortedMilestones.filter((m) => m.completed).length
  const progress = sortedMilestones.length ? (completedCount / sortedMilestones.length) * 100 : 0

  const getCountdown = useCallback(
    (dueDate: string): { days: number; hours: number; minutes: number; seconds: number } => {
      const now = new Date()
      const due = new Date(dueDate)
      const diff = due.getTime() - now.getTime()

      if (diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    },
    [],
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = sortedMilestones.reduce(
        (acc, milestone) => {
          acc[milestone.id] = getCountdown(milestone.dueDate)
          return acc
        },
        {} as { [key: string]: ReturnType<typeof getCountdown> },
      )
      setCountdowns(newCountdowns)
    }, 1000)

    return () => clearInterval(timer)
  }, [sortedMilestones, getCountdown])

  return (
    <div className="space-y-6 py-8 px-4">
      <div className="text-center space-y-4 relative">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#024950] to-[#0FA4AF] bg-clip-text text-transparent">
            Road to Success
          </h1>
          <p className="text-[#003135] dark:text-[#AFDDE5]">Your journey to achieving greatness</p>
        </motion.div>
      </div>

      {milestones.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[#024950] dark:text-[#AFDDE5] mt-8"
        >
          No milestones yet. Add long-term tasks to see them here.
        </motion.p>
      ) : (
        <div className="relative max-w-5xl mx-auto mt-16">
          {/* Progress Indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 bg-[#AFDDE5] dark:bg-[#003135] rounded-full p-4 shadow-lg z-20"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-[#024950] dark:text-[#0FA4AF]">{Math.round(progress)}%</p>
              <p className="text-sm text-[#003135] dark:text-[#AFDDE5]">Complete</p>
            </div>
          </motion.div>

          {/* Road Background */}
          <div className="relative">
            {/* Main Road */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-full">
              <div className="h-full w-full bg-[#024950] dark:bg-[#003135] rounded-lg overflow-hidden">
                {/* Road Texture */}
                <div className="h-full w-full opacity-20 bg-[radial-gradient(circle,_transparent_20%,_#AFDDE5_20%,_#AFDDE5_80%,_transparent_80%,_transparent),radial-gradient(circle,_transparent_20%,_#AFDDE5_20%,_#AFDDE5_80%,_transparent_80%,_transparent)_30px_30px] bg-[length:60px_60px]" />
                {/* Center Line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full">
                  <div
                    className="h-full w-full bg-[#0FA4AF] animate-pulse"
                    style={{
                      maskImage: "linear-gradient(to bottom, transparent 0%, #AFDDE5 50%, transparent 50%)",
                      maskSize: "100% 20px",
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #AFDDE5 50%, transparent 50%)",
                      WebkitMaskSize: "100% 20px",
                      animation: "moveDown 2s linear infinite",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Car Icon - Shows current progress */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 z-30"
              initial={{ y: 0 }}
              animate={{ y: `${progress}%` }}
              transition={{ duration: 1, type: "spring" }}
              style={{ top: "0%" }}
            >
              <div className="bg-[#0FA4AF] p-2 rounded-full shadow-lg">
                <Car className="w-6 h-6 text-[#AFDDE5]" />
              </div>
            </motion.div>

            {/* Milestones */}
            <div className="relative py-8 space-y-24">
              {sortedMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative flex ${index % 2 === 0 ? "justify-end pr-40" : "justify-start pl-40"}`}
                >
                  {/* Road Sign */}
                  <div
                    className={cn(
                      "absolute top-1/2 transform -translate-y-1/2",
                      index % 2 === 0 ? "right-28" : "left-28",
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={cn("w-4 h-16 rounded-full", milestone.completed ? "bg-[#0FA4AF]" : "bg-[#AFDDE5]")}
                    />
                  </div>

                  {/* Milestone Card */}
                  <motion.div
                    className={cn(
                      "w-80 rounded-lg shadow-lg p-6 transform transition-all duration-300",
                      milestone.completed
                        ? "bg-gradient-to-br from-[#AFDDE5] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950]"
                        : "bg-white dark:bg-[#003135] hover:shadow-xl",
                    )}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-[#024950] dark:text-[#AFDDE5]">
                          {milestone.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-[#0FA4AF] dark:text-[#AFDDE5]" />
                          <div className="text-sm font-medium text-[#003135] dark:text-[#0FA4AF]">
                            {countdowns[milestone.id] ? (
                              <>
                                {countdowns[milestone.id].days > 0 && (
                                  <span className="mr-1">{countdowns[milestone.id].days}d</span>
                                )}
                                {countdowns[milestone.id].hours > 0 && (
                                  <span className="mr-1">{countdowns[milestone.id].hours}h</span>
                                )}
                                {countdowns[milestone.id].minutes > 0 && (
                                  <span className="mr-1">{countdowns[milestone.id].minutes}m</span>
                                )}
                                <span>{countdowns[milestone.id].seconds}s</span>
                              </>
                            ) : (
                              "Calculating..."
                            )}
                          </div>
                        </div>
                      </div>
                      {milestone.completed ? (
                        <div className="flex items-center text-[#0FA4AF] dark:text-[#AFDDE5]">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-sm bg-[#0FA4AF] text-[#AFDDE5] hover:bg-[#024950] dark:bg-[#024950] dark:text-[#AFDDE5] dark:hover:bg-[#0FA4AF]"
                            >
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Progress</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Slider
                                defaultValue={[progressIncrement]}
                                max={100}
                                step={1}
                                onValueChange={(value) => setProgressIncrement(value[0])}
                              />
                              <p className="text-center mt-2">Increment: {progressIncrement}%</p>
                            </div>
                            <Button
                              onClick={() => {
                                incrementProgress(milestone.id)
                                ;(document.querySelector('button[data-state="open"]') as HTMLButtonElement)?.click()
                              }}
                            >
                              Increase Progress
                            </Button>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <p className="text-[#024950] dark:text-[#AFDDE5] text-sm">
                      {expandedMilestones.includes(milestone.id)
                        ? milestone.description
                        : `${milestone.description.slice(0, 100)}...`}
                    </p>
                    {milestone.description.length > 100 && (
                      <Button
                        variant="link"
                        onClick={() => toggleMilestoneExpansion(milestone.id)}
                        className="mt-2 p-0 h-auto text-[#0FA4AF] dark:text-[#AFDDE5]"
                      >
                        {expandedMilestones.includes(milestone.id) ? (
                          <>
                            Read Less <ChevronUp className="w-4 h-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Read More <ChevronDown className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </Button>
                    )}

                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-[#003135] dark:text-[#0FA4AF] mb-1">
                        <span>{milestone.completed ? "Completed" : `${milestone.progress || 0}% Complete`}</span>
                        <span>{milestone.completed ? "100%" : `${milestone.progress || 0}%`}</span>
                      </div>
                      <div className="h-2 bg-[#AFDDE5] dark:bg-[#003135] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${milestone.progress || 0}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-[#0FA4AF]"
                        />
                      </div>
                    </div>
                    {milestone.progress === 100 && !milestone.completed && (
                      <Button
                        onClick={() => completeMilestone(milestone.id)}
                        className="mt-4 w-full bg-[#0FA4AF] text-[#AFDDE5] hover:bg-[#024950]"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Final Destination */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-[#024950] to-[#0FA4AF] p-4 rounded-full shadow-lg z-20"
            >
              <Flag className="w-8 h-8 text-[#AFDDE5]" />
            </motion.div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes moveDown {
          from { background-position: 0 0; }
          to { background-position: 0 20px; }
        }
      `}</style>
    </div>
  )
}

