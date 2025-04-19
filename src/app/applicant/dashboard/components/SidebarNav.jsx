'use client'
import { motion } from 'framer-motion'
import { BarChart2, Bookmark, Briefcase, ChevronRight, LayoutDashboard, Settings, User, FileText, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SidebarNav = ({ activeTab, setActiveTab }) => {
  const pathname = usePathname()

  const navItems = [
    { 
      icon: <User className="w-5 h-5" />, 
      label: "My Profile",
      path: "/applicant/profile",
      description: "Manage your personal information"
    },
    { 
      icon: <Briefcase className="w-5 h-5" />, 
      label: "Job Search",
      path: "/jobs",
      description: "Browse available job opportunities"
    },
    { 
      icon: <Bookmark className="w-5 h-5" />, 
      label: "Saved Positions",
      path: "/jobs?tab=saved",
      description: "Your shortlisted job opportunities"
    },
    { 
      icon: <ClipboardList className="w-5 h-5" />, 
      label: "My Applications",
      path: "/jobs?tab=applied",
      description: "Track your job applications"
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: "Resume Builder",
      path: "/applicant/resume",
      description: "Create and optimize your resume"
    },
    { 
      icon: <BarChart2 className="w-5 h-5" />, 
      label: "Career Insights",
      path: "/applicant/analytics",
      description: "Your job search statistics"
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: "Account Settings", 
      path: "/applicant/update_profile",
      description: "Update your account preferences"
    }
  ]

  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => {
        const isActive = pathname?.startsWith(item.path) || 
                         activeTab === item.label.toLowerCase()
        
        return (
          <Link 
            href={item.path} 
            key={index} 
            passHref 
            legacyBehavior
            title={item.description}
          >
            <motion.a
              whileHover={{ x: 5 }}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-brand font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(item.label.toLowerCase())}
              aria-label={item.description}
            >
              <span className={isActive ? 'text-brand' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className="ml-3">{item.label}</span>
              <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
            </motion.a>
          </Link>
        )
      })}
    </nav>
  )
}