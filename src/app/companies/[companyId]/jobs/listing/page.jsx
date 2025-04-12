'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { JobTabs } from './components/JobTabs';
import { SearchAndFilter } from './components/SearchAndFilter';
import { JobListContainer } from './components/JobListContainer';
import { MobileMenu } from '../../dashboard/MobileMenu';
import { Sideba } from '../../dashboard/recruiter/Sideba';
import { Filter, Menu } from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    hire_number: 2,
    job_location_type: "Remote",
    job_type: "Full-Time",
    location: "Remote",
    salary_range: "70001+",
    category: 1,
    description: "Develop cutting-edge software solutions.",
    responsibilities: "Code, test, and deploy applications.",
    benefits: "Health insurance, 401k, remote work.",
    requirements: [1, 2, 3],
    level: "Expert",
    experience_levels: "5-10Years",
    weekly_ranges: "mondayToFriday",
    shifts: "dayShift",
    created_at: "2025-04-01T10:00:00Z",
    application_count: 12,
    hired_count: 1,
  },
  {
    id: 2,
    title: "Marketing Specialist",
    hire_number: 1,
    job_location_type: "On-site",
    job_type: "Part-Time",
    location: "New York",
    salary_range: "30000-50000",
    category: 2,
    description: "Create marketing campaigns.",
    responsibilities: "Plan and execute strategies.",
    benefits: "Flexible hours.",
    requirements: [4],
    level: "Mid",
    experience_levels: "1-3Years",
    weekly_ranges: "weekendsNeeded",
    shifts: "eveningShift",
    created_at: "2025-04-02T14:30:00Z",
    application_count: 8,
    hired_count: 0,
  },
  {
    id: 3,
    title: "Product Designer",
    hire_number: 3,
    job_location_type: "Hybrid",
    job_type: "Contract",
    location: "San Francisco",
    salary_range: "50001-70000",
    category: 3,
    description: "Design user-friendly interfaces.",
    responsibilities: "Wireframe and prototype designs.",
    benefits: "Stock options.",
    requirements: [5, 6],
    level: "Beginner",
    experience_levels: "under1Year",
    weekly_ranges: "rotatingWeekend",
    shifts: "morningShift",
    created_at: "2025-04-03T09:15:00Z",
    application_count: 5,
    hired_count: 2,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    hire_number: 1,
    job_location_type: "Remote",
    job_type: "Full-Time",
    location: "Remote",
    salary_range: "70001+",
    category: 4,
    description: "Manage cloud infrastructure.",
    responsibilities: "Automate deployments.",
    benefits: "Unlimited PTO.",
    requirements: [7],
    level: "Expert",
    experience_levels: "10+Years",
    weekly_ranges: "noneWeekend",
    shifts: "nightShift",
    created_at: "2025-04-04T16:45:00Z",
    application_count: 15,
    hired_count: 0,
  },
  {
    id: 5,
    title: "Customer Support Lead",
    hire_number: 2,
    job_location_type: "On-site",
    job_type: "Full-Time",
    location: "Chicago",
    salary_range: "30000-50000",
    category: 5,
    description: "Lead support team.",
    responsibilities: "Handle escalations.",
    benefits: "Health benefits.",
    requirements: [8],
    level: "Mid",
    experience_levels: "3-5Years",
    weekly_ranges: "weekendsOnly",
    shifts: "twelveHourShift",
    created_at: "2025-04-05T11:20:00Z",
    application_count: 3,
    hired_count: 1,
  },
];

export default function CompanyJobsListing() {
  const { companyId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [jobTypeFilters, setJobTypeFilters] = useState([]);
  const [salaryFilters, setSalaryFilters] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeTab, setActiveTab] = useState(`/companies/${companyId}/jobs/listing`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  useEffect(() => {
    let result = [...jobs];

    if (searchQuery) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (jobTypeFilters.length > 0) {
      result = result.filter((job) => jobTypeFilters.includes(job.job_type));
    }

    if (salaryFilters.length > 0) {
      result = result.filter((job) => salaryFilters.includes(job.salary_range));
    }

    if (locationFilter) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (keywordFilter) {
      result = result.filter(
        (job) =>
          job.description.toLowerCase().includes(keywordFilter.toLowerCase()) ||
          job.title.toLowerCase().includes(keywordFilter.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [searchQuery, jobTypeFilters, salaryFilters, locationFilter, keywordFilter, jobs]);

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      <Sideba activeTab={activeTab} setActiveTab={setActiveTab} companyId={companyId} />
      <div className="flex-1">
        <header className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Job Listings</h1>
          <Button
            variant="ghost"
            className="p-2 text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </header>
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          companyId={companyId}
        />
        <main>
          <JobTabs />
          <SearchAndFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <JobListContainer jobs={filteredJobs} companyId={companyId} />
        </main>
      </div>
    </div>
  );
}