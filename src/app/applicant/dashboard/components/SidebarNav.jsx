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
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: "Dashboard",
      path: "/applicant/dashboard",
      description: "Manage your personal information"
    },
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
      label: "Resume",
      path: "/applicant/upload-resume",
      description: "Upload and manage your resume"
    },
    { 
      icon: <FileEdit className="w-5 h-5" />, 
      label: "Resume Advisor",
      path: "/applicant/resume-advisor",
      description: "Create and optimize your resume"
    },
    { 
      icon: <Bell className="w-5 h-5" />, 
      label: "Notifications",
      path: "/notifications",
      description: "Check your notifications and alerts",
    },
    { 
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Messages",
      path: "/messages",
      description: "View your messages and notifications"
    },
    { 
      icon: <BookmarkCheck className="w-5 h-5" />, 
      label: "Shortlisted Jobs", 
      path: "/shortlisted-jobs",
      description: "View jobs you have shortlisted"
    },
    { 
      icon: <BarChart2 className="w-5 h-5" />, 
      label: "Perfect Job Title",
      path: "/applicant/perfect-job",
      description: "Your job search statistics"
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: "Account Settings", 
      path: "/settings",
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
              className={`flex items-center w-full p-3 rounded-lg transition-colors font-semibold ${
                isActive 
                  ? 'bg-brand text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(item.label.toLowerCase())}
              aria-label={item.description}
            >
              <span className={isActive ? 'text-white' : 'text-brand'}>
                {item.icon}
              </span>
              <span className={`ml-3 ${isActive ? 'text-white' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </motion.a>
          </Link>
        )
      })}
    </nav>
  )
}