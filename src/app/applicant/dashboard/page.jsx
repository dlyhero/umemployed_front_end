'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Briefcase, Clock, User } from 'lucide-react'
import {
  CareerTips,
  JobCard,
  StatsGrid,
} from '../../../components/common/dashboard'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import { WelcomeSection } from './components/WelcomeSection'
import { Sidebar } from './components/Sidebar'
import { MobileMenu } from './components/MobileMenu'
import { RecommendedJobs } from './components/RecommendedJobs'
import { useJobs } from '@/src/hooks/useJob'
import DashboardHeader from './header-dashoard'
import EnhancedResumePage from '../resume-enhancer/page'
import ResumeUploadPage from '../upload-resume/page'

const ApplicantDashBoard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [savedJobs, setSavedJobs] = useState([])
  
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    )
  }

  // Mock data
  const [stats] = useState([
    { id: 1, name: 'Profile Views', value: '1.2K', change: '+12%', icon: <User className="w-5 h-5" /> },
    { id: 2, name: 'Applications', value: '24', change: '+5%', icon: <Briefcase className="w-5 h-5" /> },
    { id: 3, name: 'Job Matches', value: '18', change: '+8%', icon: <Award className="w-5 h-5" /> },
    { id: 4, name: 'Avg. Response', value: '2.4d', change: '-0.5d', icon: <Clock className="w-5 h-5" /> }
  ])

  // Render the appropriate content based on activeTab
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            <WelcomeSection />
            <StatsGrid stats={stats} />
            <RecommendedJobs/>
            <CareerTips />
          </>
        )
      case 'shortlisted':
        return <EnhancedResumePage />
      case 'resume':
        return <ResumeUploadPage />
      // Add more cases for other tabs if needed
      default:
        return (
          <>
            <WelcomeSection />
            <StatsGrid stats={stats} />
            <RecommendedJobs/>
            <CareerTips />
          </>
        )
    }
  }

  return (
    <div className="h-fit pb-2">
      <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-2">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="relative flex-1 mx-auto md:ml-72">
            <div className='sticky top-0'> 
              <DashboardHeader onClick={() => setMobileMenuOpen(!mobileMenuOpen)}/>
            </div>

            <div className="mx-auto px-4 lg:px-6 bg-gray-100 rounded-xl shadow min-h-screen">                                                                                                                                                                                                                                
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ApplicantDashBoard