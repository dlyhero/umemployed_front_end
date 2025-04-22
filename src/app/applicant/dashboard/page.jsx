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
  
    const jobs = [
      {
        id: 1,
        title: "Senior UI Developer",
        company: { name: "PixelCraft Studios" },
        job_location_type: "Remote Job",
        location: "Remote • United States",
        salary_range: "120/hr",
        created_at: "24 March 2024",
        is_saved: savedJobs.includes(1),
        is_applied: false,
        description: "Lead the design system implementation for our flagship product with a focus on accessibility."
      },
      {
        id: 2,
        title: "Senior Backend Engineer",
        company: { name: "CloudNova Technologies" },
        job_location_type: "Full-Time",
        location: "San Francisco, CA",
        salary_range: "125-145/hr",
        created_at: "28 March 2024",
        is_saved: savedJobs.includes(2),
        is_applied: false,
        description: "Architect and scale our distributed systems to handle millions of concurrent users."
      },
      {
        id: 3,
        title: "UX/UI Designer",
        company: { name: "MAGIC UNICORN" },
        job_location_type: "Remote Job",
        location: "SSTONA, TALIAN",
        salary_range: "250/hr",
        created_at: "24 March 2024",
        is_saved: savedJobs.includes(3),
        is_applied: false,
        description: "Create beautiful interfaces that delight users and drive business metrics."
      }
    ];

  // Mock data
  const [stats] = useState([
    { id: 1, name: 'Profile Views', value: '1.2K', change: '+12%', icon: <User className="w-5 h-5" /> },
    { id: 2, name: 'Applications', value: '24', change: '+5%', icon: <Briefcase className="w-5 h-5" /> },
    { id: 3, name: 'Job Matches', value: '18', change: '+8%', icon: <Award className="w-5 h-5" /> },
    { id: 4, name: 'Avg. Response', value: '2.4d', change: '-0.5d', icon: <Clock className="w-5 h-5" /> }
  ])

  
  

  return (
    <div className="h-fit pb-2 bg-gray-50 ">
      <MobileMenu mobileMenuOpen={mobileMenuOpen} activeTab={activeTab} setActiveTab={setActiveTab} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1">

            <div className="flex justify-end mb-2 lg:hidden px-1">
              <button
                className=" p-2 flex items-center justify-end bg-gradient-to-r from-brand to-purple-600 py-2 px-4 rounded-md  text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                side menu
                <ChevronDoubleDownIcon className="w-4 h-4" />
              </button></div>
            <WelcomeSection />
            <StatsGrid stats={stats} />
            <RecommendedJobs/>
            <CareerTips />
          </main>
        </div>
      </div>
    </div>
  )
}

export default applicantDashBoard