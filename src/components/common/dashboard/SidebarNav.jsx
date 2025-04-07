'use client'
import { motion } from 'framer-motion'
import { BarChart2, Bookmark, Briefcase, ChevronRight, LayoutDashboard, Settings, User } from 'lucide-react'

export const SidebarNav = ({ activeTab, setActiveTab }) => (
  <nav className="space-y-1">
    {[
      { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
      { icon: <Briefcase className="w-5 h-5" />, label: "Job Board" },
      { icon: <Bookmark className="w-5 h-5" />, label: "Saved Jobs" },
      { icon: <BarChart2 className="w-5 h-5" />, label: "Analytics" },
      { icon: <User className="w-5 h-5" />, label: "My Profile" },
      { icon: <Settings className="w-5 h-5" />, label: "Settings" }
    ].map((item, index) => (
      <motion.button
        key={index}
        whileHover={{ x: 5 }}
        className={`flex items-center w-full p-3 rounded-lg ${activeTab === item.label.toLowerCase() ? 'bg-indigo-50 text-brand' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveTab(item.label.toLowerCase())}
      >
        <span className={`${activeTab === item.label.toLowerCase() ? 'text-brand' : 'text-gray-500'}`}>
          {item.icon}
        </span>
        <span className="ml-3 font-medium">{item.label}</span>
        <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
      </motion.button>
    ))}
  </nav>
)