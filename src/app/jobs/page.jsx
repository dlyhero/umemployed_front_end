'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Bookmark, Briefcase, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from 'next-auth/react';
import { Filters } from './_components/Filters';
import JobCard from './_components/JobCard';
import { useJobs } from '@/src/hooks/useJob';
import { Spinner } from "@/components/ui/Spinner"; // Assuming you have a Spinner component

function JobListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'jobs';
  const { data: session } = useSession();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    savedJobs,
    appliedJobs,
    allJobs,
    filteredJobs,
    loading,
    error,
    filterOptions,
    toggleSaveJob,
    applyFilters,
    resetFilters
  } = useJobs();


  useEffect(() => {
    const tab = searchParams.get('tab') || 'jobs';
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.replace(`/jobs?tab=${tab}`, { scroll: false });
  };

  const getFilteredJobs = () => {
    const jobsToFilter = filteredJobs.length > 0 ? filteredJobs : allJobs;
    switch (activeTab) {
      case "saved":
        return jobsToFilter.filter(job => job.is_saved);
      case "applied":
        return jobsToFilter.filter(job => job.is_applied);
      default:
        return jobsToFilter;
    }
  };

  const jobs = getFilteredJobs();


  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filters Button */}
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

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters */}
          <motion.div
            className="hidden lg:block w-full lg:w-72 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Filters 
              options={filterOptions} 
              onFilterChange={applyFilters}
              onReset={resetFilters}
            />
          </motion.div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                className="lg:hidden w-full mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <Filters
                    options={filterOptions} 
                    onFilterChange={applyFilters}
                    onReset={resetFilters}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job Listings */}
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
                    Jobs {activeTab === 'jobs' && `(${loading ? '' : jobs.length})`}
                  </TabsTrigger>
                  {session && <TabsTrigger
                    value="saved"
                    className="whitespace-nowrap"
                    onClick={() => handleTabChange("saved")}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved ({loading && activeTab === 'saved' ? '' : savedJobs.length})
                  </TabsTrigger>}
                 {session && <TabsTrigger
                    value="applied"
                    className="whitespace-nowrap"
                    onClick={() => handleTabChange("applied")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Applied ({loading && activeTab === 'applied' ? '' : appliedJobs.length})
                  </TabsTrigger>}
                </TabsList>
              </ScrollArea>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">
                    {activeTab === "jobs" && `All Jobs (${loading ? '' : jobs.length})`}
                    {activeTab === "saved" && `Saved Jobs (${loading ? '' : jobs.length})`}
                    {activeTab === "applied" && `Applied Jobs (${loading ? '' : jobs.length})`}
                  </h2>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner className="h-8 w-8" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onToggleSave={() => toggleSaveJob(job.id)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">
                          {activeTab === "jobs" && "No jobs found matching your filters"}
                          {activeTab === "saved" && "You haven't saved any jobs yet"}
                          {activeTab === "applied" && "You haven't applied to any jobs yet"}
                        </p>
                        {activeTab === "jobs" && (
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={resetFilters}
                          >
                            Reset Filters
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🛠 Main JobListing Component
export default function JobListing() {
  return (
    <Suspense fallback={<div>Loading Jobs...</div>}>
      <JobListingContent />
    </Suspense>
  );
}