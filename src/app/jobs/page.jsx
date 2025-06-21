'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Bookmark, Briefcase, CheckCircle, Filter, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from 'next-auth/react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from '@/components/ui/card';
import { Spinner } from "@/components/ui/Spinner";
import JobCard from './_components/JobCard';
import { useJobs } from '@/src/hooks/useJob';
import { Filters } from './_components/Filters';
import JobCardListing from './_components/JobCardListing';

function JobListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'jobs';
  const { data: session } = useSession();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isMobile, setIsMobile] = useState(false);

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

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Button */}
        {isMobile && (
          <div className="mb-6 flex justify-between items-center">
            <Button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        )}

        {/* Layout Container */}
        <div className="flex gap-8">
          {/* Desktop Filter Panel */}
          {!isMobile && (
            <div className="w-80 flex-shrink-0">
              <div className=" top-8">
                <Filters
                  options={filterOptions} 
                  onFilterChange={applyFilters}
                  onReset={resetFilters}
                  loading={loading}
                  isMobile={false}
                />
              </div>
            </div>
          )}

          {/* Mobile Filter Sidebar */}
          {isMobile && (
            <Filters
              options={filterOptions} 
              onFilterChange={applyFilters}
              onReset={resetFilters}
              loading={loading}
              isMobile={true}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} className="w-full">
              <ScrollArea className="w-full pb-4" orientation="horizontal">
                <TabsList className="flex w-full overflow-auto">
                  <TabsTrigger
                    value="jobs"
                    className="whitespace-nowrap"
                    onClick={() => handleTabChange("jobs")}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Jobs {activeTab === 'jobs' && `(${loading ? '' : jobs.length})`}
                  </TabsTrigger>
                  {session && (
                    <TabsTrigger
                      value="saved"
                      className="whitespace-nowrap"
                      onClick={() => handleTabChange("saved")}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Saved ({loading && activeTab === 'saved' ? '' : savedJobs.length})
                    </TabsTrigger>
                  )}
                  {session && (
                    <TabsTrigger
                      value="applied"
                      className="whitespace-nowrap"
                      onClick={() => handleTabChange("applied")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Applied ({loading && activeTab === 'applied' ? '' : appliedJobs.length})
                    </TabsTrigger>
                  )}
                </TabsList>
              </ScrollArea>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {activeTab === "jobs" && `All Jobs (${loading ? '' : jobs.length})`}
                    {activeTab === "saved" && `Saved Jobs (${loading ? '' : jobs.length})`}
                    {activeTab === "applied" && `Applied Jobs (${loading ? '' : jobs.length})`}
                  </h2>
                </div>

               
              
                  <div className="grid grid-cols-1">
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <JobCardListing
                          key={job.id}
                          job={job}
                          onToggleSave={() => toggleSaveJob(job.id)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">
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
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main JobListing Component
function JobListing() {
  return (
    <Suspense fallback={<div>Loading Jobs...</div>}>
      <JobListingContent />
    </Suspense>
  );
}

export default JobListing;