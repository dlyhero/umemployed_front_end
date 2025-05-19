"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, BarChart2, DollarSign, Clock } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useSession } from "next-auth/react"
import Loader from "@/src/components/common/Loader/Loader"
import baseUrl from "@/src/app/api/baseUrl"
import JobCard from "@/src/app/jobs/_components/JobCard"
import { useJobs } from "@/src/hooks/useJob"

const CompanyJobListings = ({ companyName }) => {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toggleSaveJob } = useJobs()

  const [activeFilter, setActiveFilter] = useState(null)
  const [filters, setFilters] = useState({
    location: "All",
    category: "All",
    level: "All",
    salary: "All",
    type: "All",

  })


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${baseUrl}/company/company/${params.id}/jobs/`, {
          
        })
        setJobs(response.data)
      } catch (err) {
        console.error("Error fetching jobs:", err.response || err.message)
        setError("Failed to load jobs. Please try again.")
      } finally {
        setLoading(false)
      }
    }

   
      fetchJobs()
  }, [params.id, session])

  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName)
  }

  const updateFilter = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value })
    setActiveFilter(null)
  }

  const filterOptions = {
    location: ["Remote", "San Francisco", "New York", "All"],
    category: ["Development", "Design", "Marketing", "All"],
    level: ["Junior", "Mid", "Senior", "All"],
    salary: ["$50k+", "$100k+", "$150k+", "All"],
    type: ["Full-time", "Part-time", "Contract", "All"],
  }

  // Apply filters to jobs
  const filteredJobs = jobs.filter((job) => {
    return (
      (filters.location === "All" || job.location === filters.location) &&
      (filters.category === "All" || job.category === filters.category) &&
      (filters.level === "All" || job.level === filters.level) &&
      (filters.salary === "All" || job.salary === filters.salary) &&
      (filters.type === "All" || job.type === filters.type)
    )
  })


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <section className="py-12">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white mb-8 flex justify-between items-center max-w-7xl mx-auto px-2 md:px-10"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Open Positions at {companyName}</h2>
          <p className="text-gray-600 mt-2">{filteredJobs.length} active roles • Last updated today</p>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <h3 className="font-bold text-lg mb-4">Filter Jobs</h3>

            {/* Location Filter */}
            <div className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFilter("location")}
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">Location</span>
                </div>
                <span className={`transition-transform ${activeFilter === "location" ? "rotate-180" : ""}`}>▼</span>
              </div>
              {activeFilter === "location" && (
                <div className="mt-2 pl-6 space-y-2">
                  {filterOptions.location.map((option) => (
                    <div
                      key={option}
                      className={`cursor-pointer ${filters.location === option ? "text-brand font-medium" : "text-gray-600"}`}
                      onClick={() => updateFilter("location", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFilter("category")}
              >
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">Category</span>
                </div>
                <span className={`transition-transform ${activeFilter === "category" ? "rotate-180" : ""}`}>▼</span>
              </div>
              {activeFilter === "category" && (
                <div className="mt-2 pl-6 space-y-2">
                  {filterOptions.category.map((option) => (
                    <div
                      key={option}
                      className={`cursor-pointer ${filters.category === option ? "text-brand font-medium" : "text-gray-600"}`}
                      onClick={() => updateFilter("category", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Level Filter */}
            <div className="mb-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilter("level")}>
                <div className="flex items-center">
                  <BarChart2 className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">Level</span>
                </div>
                <span className={`transition-transform ${activeFilter === "level" ? "rotate-180" : ""}`}>▼</span>
              </div>
              {activeFilter === "level" && (
                <div className="mt-2 pl-6 space-y-2">
                  {filterOptions.level.map((option) => (
                    <div
                      key={option}
                      className={`cursor-pointer ${filters.level === option ? "text-brand font-medium" : "text-gray-600"}`}
                      onClick={() => updateFilter("level", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Salary Filter */}
            <div className="mb-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilter("salary")}>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">Salary</span>
                </div>
                <span className={`transition-transform ${activeFilter === "salary" ? "rotate-180" : ""}`}>▼</span>
              </div>
              {activeFilter === "salary" && (
                <div className="mt-2 pl-6 space-y-2">
                  {filterOptions.salary.map((option) => (
                    <div
                      key={option}
                      className={`cursor-pointer ${filters.salary === option ? "text-brand font-medium" : "text-gray-600"}`}
                      onClick={() => updateFilter("salary", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Type Filter */}
            <div className="mb-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilter("type")}>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">Type</span>
                </div>
                <span className={`transition-transform ${activeFilter === "type" ? "rotate-180" : ""}`}>▼</span>
              </div>
              {activeFilter === "type" && (
                <div className="mt-2 pl-6 space-y-2">
                  {filterOptions.type.map((option) => (
                    <div
                      key={option}
                      className={`cursor-pointer ${filters.type === option ? "text-brand font-medium" : "text-gray-600"}`}
                      onClick={() => updateFilter("type", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 border-brand text-brand hover:bg-brand/10"
              onClick={() =>
                setFilters({
                  location: "All",
                  category: "All",
                  level: "All",
                  salary: "All",
                  type: "All",
                })
              }
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1">
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={{
                    id: job.id,
                    title: job.title,
                    type: job.employment_type,
                    location: job.location,
                    salary: job.salary_range,
                    posted: job.posted_at,
                    applicants: job.applicants_count,
                    isSaved: job.is_saved || false,
                  }}
                  onToggleSave={() => toggleSaveJob(job.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-600">No matching positions found</p>
            </div>
          )}

          {filteredJobs.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Button variant="ghost" className="text-brand hover:bg-brand/10">
                Show All {filteredJobs.length} Positions
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CompanyJobListings
