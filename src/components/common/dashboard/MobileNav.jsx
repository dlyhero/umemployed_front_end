'use client'
import { Bookmark, Briefcase, LayoutDashboard, Settings, User } from 'lucide-react'

export const MobileNav = () => (
  <nav className="flex flex-col space-y-2">
    {[
      { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
      { icon: <Briefcase className="w-5 h-5" />, label: "Jobs" },
      { icon: <Bookmark className="w-5 h-5" />, label: "Saved" },
      { icon: <User className="w-5 h-5" />, label: "Profile" },
      { icon: <Settings className="w-5 h-5" />, label: "Settings" }
    ].map((item, index) => (
      <button
        key={index}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <span className="text-brand">{item.icon}</span>
        <span>{item.label}</span>
      </button>
    ))}
  </nav>
)