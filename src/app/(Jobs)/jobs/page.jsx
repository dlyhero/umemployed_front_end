'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCw, Bookmark, Briefcase, CheckCircle } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import JobCard from '../components/JobCard';
import Filters from '../components/Filters';

const JobListing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'jobs';



  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab state with URL
  useEffect(() => {
    const tab = searchParams.get('tab') || 'jobs';
    setActiveTab(tab);
  }, [searchParams]);

  // Load saved/applied jobs from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setSavedJobs(saved);
    setAppliedJobs(applied);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.replace(`/jobs?tab=${tab}`, { scroll: false });
  };

  const toggleSaveJob = (jobId, isSaved) => {
    setSavedJobs(prev => {
      const newSavedJobs = isSaved
        ? [...prev, jobId]
        : prev.filter(id => id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return newSavedJobs;
    });
  };

  const handleApplyJob = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs(prev => {
        const newAppliedJobs = [...prev, jobId];
        localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
        return newAppliedJobs;
      });
    }
  };

  // Sample job data
  const allJobs = [
    {
      id: 1,
      title: "Senior UI Developer",
      company: { name: "PixelCraft Studios", logo: null },
      job_location_type: "Remote",
      location: "Remote • United States",
      salary_range: "120",
      created_at: "2 days ago",
      description: "Lead the design system implementation for our flagship product with a focus on accessibility."
    },
    {
      id: 2,
      title: "Senior Backend Engineer",
      company: { name: "CloudNova Technologies", logo: null },
      job_location_type: "Full-Time",
      location: "San Francisco, CA",
      salary_range: "125-145",
      created_at: "1 week ago",
      description: "Architect and scale our distributed systems to handle millions of concurrent users."
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: { name: "MAGIC UNICORN", logo: null },
      job_location_type: "Remote",
      location: "SSTONA, TALIAN",
      salary_range: "250",
      created_at: "24 March 2024",
      description: "Create beautiful interfaces that delight users and drive business metrics."
    }
  ];

  // Filter jobs based on tab
  const getFilteredJobs = () => {
    switch (activeTab) {
      case "saved":
        return allJobs.filter(job => savedJobs.includes(job.id));
      case "applied":
        return allJobs.filter(job => appliedJobs.includes(job.id));
      default:
        return allJobs;
    }
  };

  const jobs = getFilteredJobs().map(job => ({
    ...job,
    is_saved: savedJobs.includes(job.id),
    is_applied: appliedJobs.includes(job.id)
  }));




  return (
    <div className="  bg-white">
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
            <Filters />
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
                <div className="bg-white rounded-lg border border-gray-200  shadow-sm">
                  {/* Same filter content as desktop */}
                  <Filters />                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content area */}
          <div className="flex-1">
            <Tabs value={activeTab} className="w-full">
              <ScrollArea className="w-full pb-4" orientation="horizontal">
                <TabsList className="flex w-[98%] mx-auto overflow-auto">
                  <TabsTrigger
                    value="jobs"
                    className="whitespace-nowrap"
                    onClick={() => handleTabChange("jobs")}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className="whitespace-nowrap"
                    onClick={() => handleTabChange("saved")}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved ({savedJobs.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="applied"
                    className="whitespace-nowrap"
                    onClick={() => handleTabChange("applied")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Applied ({appliedJobs.length})
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">
                    {activeTab === "jobs" && "All Jobs"}
                    {activeTab === "saved" && "Saved Jobs"}
                    {activeTab === "applied" && "Applied Jobs"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onToggleSave={toggleSaveJob}
                        onApplyJob={handleApplyJob}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">
                        {activeTab === "jobs" && "No jobs found matching your filters"}
                        {activeTab === "saved" && "You haven't saved any jobs yet"}
                        {activeTab === "applied" && "You haven't applied to any jobs yet"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;