// SidebarNav.jsx
'use client'
import { motion } from 'framer-motion'
import { BarChart2, Briefcase, FileText, Home, Settings, Users } from 'lucide-react'

export const SidebarNav = ({ activeTab, setActiveTab }) => (
  <nav className="space-y-1">
    {[
      { icon: <Home className="w-5 h-5" />, label: "Dashboard" },
      { icon: <Users className="w-5 h-5" />, label: "Candidates" },
      { icon: <Briefcase className="w-5 h-5" />, label: "Jobs" },
      { icon: <FileText className="w-5 h-5" />, label: "Applications" },
      { icon: <BarChart2 className="w-5 h-5" />, label: "Analytics" },
      { icon: <Settings className="w-5 h-5" />, label: "Settings" },
    ].map((item, index) => (
      <motion.button
        key={index}
        whileHover={{ x: 5 }}
        className={`group flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
          activeTab === item.label.toLowerCase()
            ? 'bg-[#1e90ff]/10 text-[#1e90ff]'
            : 'text-gray-600 hover:bg-[#1e90ff]/10 hover:text-[#1e90ff]'
        }`}
        onClick={() => setActiveTab(item.label.toLowerCase())}
      >
        <span
          className={`${
            activeTab === item.label.toLowerCase()
              ? 'text-[#1e90ff]'
              : 'text-gray-600 group-hover:text-[#1e90ff]'
          } transition-colors duration-200`}
        >
          {item.icon}
        </span>
        <span className="ml-3 font-medium">{item.label}</span>
      </motion.button>
    ))}
  </nav>
)