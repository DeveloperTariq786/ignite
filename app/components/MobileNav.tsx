import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Moon, Sun, Home, CheckSquare, BarChart, Flag, Calendar, Quote, Lightbulb } from "lucide-react"
import type React from "react"

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
}

type MobileNavProps = {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, navItems, darkMode, setDarkMode }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#003135] shadow-lg z-50 flex flex-col"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6 text-[#024950] dark:text-[#AFDDE5]" />
        </Button>
        <h2 className="text-xl font-bold text-[#024950] dark:text-[#AFDDE5]">Menu</h2>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-2 p-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <motion.li key={href} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link
                href={href}
                className="flex items-center py-2 px-4 text-[#024950] dark:text-[#AFDDE5] hover:bg-[#AFDDE5]/10 dark:hover:bg-[#0FA4AF]/10 rounded-md transition-colors"
                onClick={onClose}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
          className="w-full justify-center border-[#024950] dark:border-[#0FA4AF]"
        >
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem] mr-2 text-[#0FA4AF]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] mr-2 text-[#024950]" />
          )}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </Button>
      </div>
    </motion.div>
  )
}

export default MobileNav

