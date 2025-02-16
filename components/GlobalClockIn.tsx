"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlayCircle, StopCircle } from "lucide-react"

export function GlobalClockIn() {
  const [isClockIn, setIsClockIn] = useState(false)
  const [time, setTime] = useState(0)
  const [lastClockOut, setLastClockOut] = useState(0)

  useEffect(() => {
    const storedTime = localStorage.getItem("clockInTime")
    const storedLastClockOut = localStorage.getItem("lastClockOut")
    if (storedTime) setTime(Number.parseInt(storedTime))
    if (storedLastClockOut) setLastClockOut(Number.parseInt(storedLastClockOut))
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isClockIn) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1
          localStorage.setItem("clockInTime", newTime.toString())
          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isClockIn])

  useEffect(() => {
    const midnightReset = setInterval(() => {
      const now = new Date()
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        setTime(0)
        localStorage.setItem("clockInTime", "0")
      }
    }, 1000)

    return () => clearInterval(midnightReset)
  }, [])

  const handleClockIn = () => {
    setIsClockIn(true)
    if (lastClockOut > 0) {
      setTime(lastClockOut)
    }
  }

  const handleClockOut = () => {
    setIsClockIn(false)
    setLastClockOut(time)
    localStorage.setItem("lastClockOut", time.toString())
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-[#024950] to-[#0FA4AF] text-white shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">{formatTime(time)}</div>
          <Button
            variant="outline"
            size="icon"
            onClick={isClockIn ? handleClockOut : handleClockIn}
            className={`rounded-full ${isClockIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            {isClockIn ? <StopCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

