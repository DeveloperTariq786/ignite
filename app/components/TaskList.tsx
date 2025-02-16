import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, XCircle } from "lucide-react"
import type { Task, TaskStatus } from "../types/task"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

type TaskListProps = {
  tasks: Task[]
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  deleteTask: (taskId: string) => void
}

export default function TaskList({ tasks, updateTaskStatus, deleteTask }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority)

  const getGradientColor = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "from-[#0FA4AF]/20 to-[#AFDDE5]/20 dark:from-[#0FA4AF]/20 dark:to-[#024950]/20"
      case "missed":
        return "from-[#964734]/20 to-[#964734]/10 dark:from-[#964734]/20 dark:to-[#964734]/10"
      default:
        return "from-[#024950]/20 to-[#0FA4AF]/20 dark:from-[#003135]/40 dark:to-[#024950]/40"
    }
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`bg-gradient-to-br ${getGradientColor(
              task.status,
            )} shadow-md hover:shadow-lg transition-shadow border border-[#0FA4AF]/20 dark:border-[#0FA4AF]/20`}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3
                  className={`font-semibold text-[#003135] dark:text-[#AFDDE5] ${
                    task.status === "completed" ? "line-through opacity-70" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-[#024950] dark:text-[#0FA4AF] mt-1">{task.description}</p>
                <p className="text-sm text-[#024950] dark:text-[#0FA4AF] mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                  {task.completedDate && ` | Completed: ${new Date(task.completedDate).toLocaleDateString()}`}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="bg-[#0FA4AF]/20 text-[#024950] dark:text-[#AFDDE5]">
                    {task.timeframe}
                  </Badge>
                  <Badge variant="outline" className="border-[#0FA4AF]/30 text-[#024950] dark:text-[#AFDDE5]">
                    Priority: {task.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                {task.status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateTaskStatus(task.id, "completed")}
                      className="text-[#0FA4AF] hover:text-[#024950] hover:bg-[#0FA4AF]/20 dark:text-[#0FA4AF] dark:hover:text-[#AFDDE5] dark:hover:bg-[#0FA4AF]/20"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateTaskStatus(task.id, "missed")}
                      className="text-[#964734] hover:text-[#964734] hover:bg-[#964734]/20 dark:text-[#964734] dark:hover:text-[#964734] dark:hover:bg-[#964734]/20"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="text-[#964734] hover:text-[#964734] hover:bg-[#964734]/20 dark:text-[#964734] dark:hover:text-[#964734] dark:hover:bg-[#964734]/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

