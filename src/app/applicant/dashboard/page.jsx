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

const applicantDashBoard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
   const [savedJobs, setSavedJobs] = useState([]);
  
    const toggleSaveJob = (jobId) => {
      setSavedJobs(prev => 
        prev.includes(jobId) 
          ? prev.filter(id => id !== jobId) 
          : [...prev, jobId]
      );
    };
  
  // Mock data
  const [stats] = useState([
    { id: 1, name: 'Profile Views', value: '1.2K', change: '+12%', icon: <User className="w-5 h-5" /> },
    { id: 2, name: 'Applications', value: '24', change: '+5%', icon: <Briefcase className="w-5 h-5" /> },
    { id: 3, name: 'Job Matches', value: '18', change: '+8%', icon: <Award className="w-5 h-5" /> },
    { id: 4, name: 'Avg. Response', value: '2.4d', change: '-0.5d', icon: <Clock className="w-5 h-5" /> }
  ])

  
  

  return (
    <div className="h-fit pb-2 bg-gray-50 ">
      <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} activeTab={activeTab} setActiveTab={setActiveTab} />


      <div className=" pt-2">
        <div className="flex flex-col lg:flex-row gap-6 ">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="relative flex-1  mx-auto md:ml-72 rounded-xl">
            <div className='sticky top-0 '> <DashboardHeader  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}/></div>

           <div className=" mx-auto px-4 lg:px-6 bg-blue-50 rounded-xl">                                                                                                                                                                                                                                
           
            <WelcomeSection />
            <StatsGrid stats={stats} />
            <RecommendedJobs/>
            <CareerTips />
           </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default applicantDashBoard