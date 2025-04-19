'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCw } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import JobCard from '../JobCard';

const JobListing = () => {
  const [filters, setFilters] = useState({
    employmentType: {
      fullTime: false,
      partTime: true,
      remote: true,
      training: false
    },
    seniorityLevel: {
      student: true,
      entry: true,
      mid: false,
      senior: false,
      director: false,
      vp: false
    },
    salaryRange: [10000, 500000]
  });

  const [savedJobs, setSavedJobs] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
      description: "Create beautiful interfaces that delight users and drive business metrics."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <Button 
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full flex items-center justify-between"
            variant="outline"
          >
            <span>Filters</span>
            {mobileFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar - Desktop */}
          <motion.div 
            className="hidden lg:block w-full lg:w-72 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-semibold mb-6">Filters</h2>
              
              <FilterSection 
                title="Type of Employment"
                defaultOpen={true}
              >
                <div className="space-y-3 mt-3">
                  {[
                    { id: 'fullTime', label: 'Full Time Jobs', count: '1:59' },
                    { id: 'partTime', label: 'Part Time Jobs', count: '3:8' },
                    { id: 'remote', label: 'Remote Jobs', count: '5:0' },
                    { id: 'training', label: 'Training Jobs', count: '1:5' }
                  ].map((item) => (
                    <FilterCheckbox 
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      count={item.count}
                      checked={filters.employmentType[item.id]}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        employmentType: {
                          ...prev.employmentType,
                          [item.id]: !prev.employmentType[item.id]
                        }
                      }))}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection 
                title="Seniority Level"
                defaultOpen={true}
                className="mt-6"
              >
                <div className="space-y-3 mt-3">
                  {[
                    { id: 'student', label: 'Student Level', count: '4:8' },
                    { id: 'entry', label: 'Entry Level', count: '5:1' },
                    { id: 'mid', label: 'Mid Level', count: '1:50' },
                    { id: 'senior', label: 'Senior Level', count: '3:0' },
                    { id: 'director', label: 'Directors', count: '2:0' },
                    { id: 'vp', label: 'VP or Above', count: '1:5' }
                  ].map((item) => (
                    <FilterCheckbox 
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      count={item.count}
                      checked={filters.seniorityLevel[item.id]}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        seniorityLevel: {
                          ...prev.seniorityLevel,
                          [item.id]: !prev.seniorityLevel[item.id]
                        }
                      }))}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection 
                title="Salary Range"
                defaultOpen={true}
                className="mt-6"
              >
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>MIN: ${filters.salaryRange[0]}</span>
                    <span>MAX: ${filters.salaryRange[1]}</span>
                  </div>
                  <Slider 
                    value={filters.salaryRange}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      salaryRange: value
                    }))}
                    min={0}
                    max={200000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </FilterSection>

              <div className="flex gap-3 mt-8">
                <Button className="flex-1 bg-black text-white hover:bg-black/90">
                  APPLY
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setFilters({
                  employmentType: {
                    fullTime: false,
                    partTime: false,
                    remote: false,
                    training: false
                  },
                  seniorityLevel: {
                    student: false,
                    entry: false,
                    mid: false,
                    senior: false,
                    director: false,
                    vp: false
                  },
                  salaryRange: [0, 200000]
                })}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  RESET
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Mobile filters */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                className="lg:hidden w-full mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6">Filters</h2>
                  
                  <FilterSection 
                    title="Type of Employment"
                    defaultOpen={true}
                  >
                    <div className="space-y-3 mt-3">
                      {[
                        { id: 'fullTime', label: 'Full Time Jobs', count: '1:59' },
                        { id: 'partTime', label: 'Part Time Jobs', count: '3:8' },
                        { id: 'remote', label: 'Remote Jobs', count: '5:0' },
                        { id: 'training', label: 'Training Jobs', count: '1:5' }
                      ].map((item) => (
                        <FilterCheckbox 
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          count={item.count}
                          checked={filters.employmentType[item.id]}
                          onChange={() => setFilters(prev => ({
                            ...prev,
                            employmentType: {
                              ...prev.employmentType,
                              [item.id]: !prev.employmentType[item.id]
                            }
                          }))}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection 
                    title="Seniority Level"
                    defaultOpen={true}
                    className="mt-6"
                  >
                    <div className="space-y-3 mt-3">
                      {[
                        { id: 'student', label: 'Student Level', count: '4:8' },
                        { id: 'entry', label: 'Entry Level', count: '5:1' },
                        { id: 'mid', label: 'Mid Level', count: '1:50' },
                        { id: 'senior', label: 'Senior Level', count: '3:0' },
                        { id: 'director', label: 'Directors', count: '2:0' },
                        { id: 'vp', label: 'VP or Above', count: '1:5' }
                      ].map((item) => (
                        <FilterCheckbox 
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          count={item.count}
                          checked={filters.seniorityLevel[item.id]}
                          onChange={() => setFilters(prev => ({
                            ...prev,
                            seniorityLevel: {
                              ...prev.seniorityLevel,
                              [item.id]: !prev.seniorityLevel[item.id]
                            }
                          }))}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection 
                    title="Salary Range"
                    defaultOpen={true}
                    className="mt-6"
                  >
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>MIN: ${filters.salaryRange[0]}</span>
                        <span>MAX: ${filters.salaryRange[1]}</span>
                      </div>
                      <Slider 
                        value={filters.salaryRange}
                        onValueChange={(value) => setFilters(prev => ({
                          ...prev,
                          salaryRange: value
                        }))}
                        min={0}
                        max={200000}
                        step={1000}
                        className="w-full"
                      />
                    </div>
                  </FilterSection>

                  <div className="flex gap-3 mt-8">
                    <Button className="flex-1 bg-black text-white hover:bg-black/90">
                      APPLY
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setFilters({
                      employmentType: {
                        fullTime: false,
                        partTime: false,
                        remote: false,
                        training: false
                      },
                      seniorityLevel: {
                        student: false,
                        entry: false,
                        mid: false,
                        senior: false,
                        director: false,
                        vp: false
                      },
                      salaryRange: [0, 200000]
                    })}>
                      <RotateCw className="mr-2 h-4 w-4" />
                      RESET
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">{jobs.length} Jobs Found</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggleSave={toggleSaveJob}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable FilterSection component
const FilterSection = ({ title, children, defaultOpen = true, className = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full"
      >
        <h3 className="font-medium">{title}</h3>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && children}
    </div>
  );
};

// Reusable FilterCheckbox component
const FilterCheckbox = ({ id, label, count, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <Checkbox 
          id={id} 
          checked={checked}
          onCheckedChange={onChange}
          className="h-4 w-4 border-gray-300"
        />
        <span className="text-sm">{label}</span>
      </label>
      <span className="text-xs text-gray-500">{count}</span>
    </div>
  );
};

export default JobListing;