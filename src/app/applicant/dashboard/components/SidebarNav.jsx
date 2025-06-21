'use client'
import { motion } from 'framer-motion'
import { 
  BarChart2, 
  Bookmark, 
  Briefcase, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  User, 
  FileText, 
  ClipboardList,
  MessageSquare,
  Bell,
  BookOpen,
  FileEdit,
  BookmarkCheck
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SidebarNav = ({ activeTab, setActiveTab }) => {
  const pathname = usePathname()

 
  const navItems = [
    { 
      id: "dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: "Dashboard",
    },
    { 
      id: "profile",
      icon: <User className="w-5 h-5" />, 
      label: "My Profile",
    },

    { 
      id: "saved-positions",
      icon: <Bookmark className="w-5 h-5" />, 
      label: "Saved Positions",
    },
    { 
      id: "my-applications",
      icon: <ClipboardList className="w-5 h-5" />, 
      label: "My Applications",
    },
   
    { 
      id: "resume-advisor",
      icon: <FileEdit className="w-5 h-5" />, 
      label: "Resume Advisor",
    },
   ,
    { 
      id: "messages",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Messages",
    },
    { 
      id: "shortlisted",
      icon: <BookmarkCheck className="w-5 h-5" />, 
      label: "Shortlisted Jobs", 
    },
    { 
      id: "perfect-job",
      icon: <BarChart2 className="w-5 h-5" />, 
      label: "Perfect Job Title",
    },
    { 
      id: "account-settings",
      icon: <Settings className="w-5 h-5" />, 
      label: "Account Settings", 
    }
  ]

  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => {
        const isActive = pathname?.startsWith(item.path) || 
            activeTab === item.label.toLowerCase()
        
        return (
          <div
            key={index} 
            passHref 
            legacyBehavior
            title={item.description}
          >
            <motion.a
              className={`flex items-center w-full p-3 rounded-lg transition-colors font-semibold cursor-pointer ${
                isActive 
                  ? 'bg-brand text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className={isActive ? 'text-white' : 'text-brand'}>
                {item.icon}
              </span>
              <span className={`ml-3 ${isActive ? 'text-white' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </motion.a>
          </div>
        )
      })}
    </nav>
  )
}