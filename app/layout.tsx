"use client"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Home, CheckSquare, BarChart, Flag, Calendar, Quote, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "react-responsive"
import MobileNav from "./components/MobileNav"
import { GlobalClockIn } from "./components/GlobalClockIn"

const inter = Inter({ subsets: ["latin"] })

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart },
  { href: "/milestones", label: "Milestones", icon: Flag },
  { href: "/habits", label: "Habits", icon: Calendar },
  { href: "/quotes", label: "Quotes", icon: Quote },
  { href: "/idea-bank", label: "Idea Bank", icon: Lightbulb },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode")
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "bg-gradient-to-br from-[#AFDDE5] to-[#0FA4AF] dark:from-[#003135] dark:to-[#024950]",
          "text-[#003135] dark:text-gray-100 transition-colors duration-300",
        )}
      >
        <div className="min-h-screen flex flex-col">
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-[#003135]/80 backdrop-blur-sm shadow-md sticky top-0 z-10"
          >
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="text-3xl font-bold bg-gradient-to-r from-[#024950] to-[#0FA4AF] dark:from-[#0FA4AF] dark:to-[#AFDDE5] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  Ignite
                </Link>
                {isMobile ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileNavOpen(true)}
                    className="text-[#024950] dark:text-[#AFDDE5]"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                ) : (
                  <nav className="flex items-center space-x-4">
                    <ul className="flex space-x-4">
                      {navItems.map(({ href, label, icon }) => (
                        <motion.li key={href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            href={href}
                            className="flex items-center gap-2 text-[#024950] hover:text-[#0FA4AF] dark:text-[#AFDDE5] dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#AFDDE5]/10 dark:hover:bg-[#0FA4AF]/10 transition-colors"
                          >
                            {React.createElement(icon, { className: "h-4 w-4" })}
                            {label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDarkMode(!darkMode)}
                        className="border-[#024950] dark:border-[#0FA4AF]"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={darkMode ? "dark" : "light"}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {darkMode ? (
                              <Sun className="h-[1.2rem] w-[1.2rem] text-[#0FA4AF]" />
                            ) : (
                              <Moon className="h-[1.2rem] w-[1.2rem] text-[#024950]" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </nav>
                )}
              </div>
            </div>
          </motion.header>
          <motion.main
            className="flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
          </motion.main>
          <motion.footer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-[#003135]/80 backdrop-blur-sm shadow-md mt-8"
          >
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-[#024950] dark:text-[#AFDDE5]">
                © {new Date().getFullYear()} Ignite. All rights reserved.
              </p>
            </div>
          </motion.footer>
        </div>
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          navItems={navItems}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <GlobalClockIn />
      </body>
    </html>
  )
}
