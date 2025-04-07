'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Briefcase, Clock, User } from 'lucide-react'
import {
  CareerTips,
  JobCard,
  MobileMenu,
  RecommendedJobs,
  Sideba,
  StatsGrid,
  WelcomeSection
} from '../../../components/common/dashboard'

const ModernDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Mock data
  const [stats] = useState([
    { id: 1, name: 'Profile Views', value: '1.2K', change: '+12%', icon: <User className="w-5 h-5" /> },
    { id: 2, name: 'Applications', value: '24', change: '+5%', icon: <Briefcase className="w-5 h-5" /> },
    { id: 3, name: 'Job Matches', value: '18', change: '+8%', icon: <Award className="w-5 h-5" /> },
    { id: 4, name: 'Avg. Response', value: '2.4d', change: '-0.5d', icon: <Clock className="w-5 h-5" /> }
  ])

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior UX Designer",
      company: "DesignHub",
      type: "Remote",
      salary: "$90K-$120K",
      posted: "2h ago",
      isSaved: false,
      logo: "/designhub.png"
    },
    // More jobs...
  ])

  const toggleSave = (id) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, isSaved: !job.isSaved } : job
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />

      <button
        className="md:hidden p-2          bg-white rounded-md hover:bg-gray-100 absolute top-28 left-4 z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sideba activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1">
       
            <WelcomeSection />
            <StatsGrid stats={stats} />
            <RecommendedJobs jobs={jobs} toggleSave={toggleSave} />
            <CareerTips />
          </main>
        </div>
      </div>
    </div>
  )
}

export default ModernDashboard