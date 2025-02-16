"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Lightbulb, X } from "lucide-react"

type Idea = {
  id: string
  title: string
  description: string
}

export default function IdeaBankPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [newIdea, setNewIdea] = useState({ title: "", description: "" })

  useEffect(() => {
    const storedIdeas = localStorage.getItem("ideas")
    if (storedIdeas) {
      setIdeas(JSON.parse(storedIdeas))
    }
  }, [])

  const addIdea = () => {
    if (newIdea.title && newIdea.description) {
      const updatedIdeas = [...ideas, { id: Date.now().toString(), ...newIdea }]
      setIdeas(updatedIdeas)
      localStorage.setItem("ideas", JSON.stringify(updatedIdeas))
      setNewIdea({ title: "", description: "" })
    }
  }

  const deleteIdea = (id: string) => {
    const updatedIdeas = ideas.filter((idea) => idea.id !== id)
    setIdeas(updatedIdeas)
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#003135] dark:text-[#AFDDE5]">Idea Bank</h1>
      <Card className="bg-gradient-to-r from-[#024950] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950] shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center text-white">
            <Lightbulb className="mr-2" />
            Add New Idea
          </h2>
          <Input
            placeholder="Idea Title"
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
            className="bg-white/10 text-white placeholder-white/60 border-white/20"
          />
          <Textarea
            placeholder="Idea Description"
            value={newIdea.description}
            onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
            className="bg-white/10 text-white placeholder-white/60 border-white/20"
          />
          <Button onClick={addIdea} className="w-full bg-[#AFDDE5] hover:bg-white text-[#003135]">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Idea
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {ideas.map((idea) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-[#0FA4AF]/20 to-[#AFDDE5]/20 dark:from-[#024950]/40 dark:to-[#0FA4AF]/20 hover:shadow-lg transition-shadow relative overflow-hidden border border-[#0FA4AF]/20">
                <CardContent className="p-6 relative z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-[#024950]/50 hover:text-[#964734] dark:text-[#AFDDE5]/50 dark:hover:text-[#964734]"
                    onClick={() => deleteIdea(idea.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Lightbulb className="h-8 w-8 text-[#0FA4AF] dark:text-[#0FA4AF] mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2 text-[#003135] dark:text-[#AFDDE5]">{idea.title}</h3>
                  <p className="text-[#024950] dark:text-[#0FA4AF]">{idea.description}</p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 dark:to-black/20" />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

