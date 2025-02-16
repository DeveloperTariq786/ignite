"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, QuoteIcon, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Quote = {
  id: string
  text: string
  author: string
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [newQuote, setNewQuote] = useState({ text: "", author: "" })

  useEffect(() => {
    const storedQuotes = localStorage.getItem("quotes")
    if (storedQuotes) {
      setQuotes(JSON.parse(storedQuotes))
    }
  }, [])

  const addQuote = () => {
    if (newQuote.text && newQuote.author) {
      const updatedQuotes = [...quotes, { id: Date.now().toString(), ...newQuote }]
      setQuotes(updatedQuotes)
      localStorage.setItem("quotes", JSON.stringify(updatedQuotes))
      setNewQuote({ text: "", author: "" })
    }
  }

  const deleteQuote = (id: string) => {
    const updatedQuotes = quotes.filter((quote) => quote.id !== id)
    setQuotes(updatedQuotes)
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#003135] dark:text-[#AFDDE5]">Inspirational Quotes</h1>
      <Card className="bg-gradient-to-r from-[#024950] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950] shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center text-white">
            <QuoteIcon className="mr-2" />
            Add New Quote
          </h2>
          <Textarea
            placeholder="Enter quote text"
            value={newQuote.text}
            onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
            className="bg-white/10 text-white placeholder-white/60 border-white/20"
          />
          <Input
            placeholder="Enter author name"
            value={newQuote.author}
            onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
            className="bg-white/10 text-white placeholder-white/60 border-white/20"
          />
          <Button onClick={addQuote} className="w-full bg-[#AFDDE5] hover:bg-white text-[#003135]">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Quote
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {quotes.map((quote) => (
            <motion.div
              key={quote.id}
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
                    onClick={() => deleteQuote(quote.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <QuoteIcon className="h-8 w-8 text-[#0FA4AF] dark:text-[#0FA4AF] mb-4 opacity-50" />
                  <p className="text-lg italic mb-4 text-[#003135] dark:text-[#AFDDE5]">"{quote.text}"</p>
                  <p className="text-right text-[#024950] dark:text-[#0FA4AF]">- {quote.author}</p>
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

