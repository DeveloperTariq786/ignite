"use client"
import { motion } from "framer-motion"
import Dashboard from "./components/Dashboard"
import { Card, CardContent } from "@/components/ui/card"

const fallbackQuote = {
  text: "The only way to do great work is to love what you do.",
  author: "Steve Jobs",
}

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-[#024950] dark:text-[#AFDDE5]">Task Dashboard</h1>
      <Card className="bg-gradient-to-r from-[#024950] to-[#0FA4AF] text-white overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center text-[#AFDDE5]">
            Light the Spark. Blaze the Trail. Conquer Your Goals.
          </h2>
        </CardContent>
      </Card>
      <Dashboard />
    </motion.div>
  )
}

