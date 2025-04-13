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
} from '../../../components/common/dashboard'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import { WelcomeSection } from './WelcomeSection'

const applicantDashBoard = () => {
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
    <div className="h-fit pb-2 bg-gray-50 ">
      <MobileMenu mobileMenuOpen={mobileMenuOpen} activeTab={activeTab} setActiveTab={setActiveTab} />


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sideba activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1">

            <div className="flex justify-end mb-2 md:hidden px-1">
              <button
                className=" p-2 flex items-center justify-end bg-gradient-to-r from-brand to-purple-600 py-2 px-4 rounded-md  text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                side menu
                <ChevronDoubleDownIcon className="w-4 h-4" />
              </button></div>
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

export default applicantDashBoard