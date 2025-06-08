'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import baseUrl from '@/src/app/api/baseUrl';
import { Suitcase } from '@phosphor-icons/react';
import { Spinner } from '@/components/ui/Spinner';
import { levelMap, experienceLevelsMap, weeklyRangesMap, cleanDescription, getInitials, CompanyLogo, formatDate } from '@/src/utils/jobFormater';

const RetakeRequestForm = ({ jobId, onClose }) => {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast.error('Please provide a reason for retaking');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `/job/${jobId}/report-test/`,
        { reason },
        {
          baseURL: baseUrl,
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          }
        }
      );

      if (response.status === 200) {
        toast.success(
          <div className="space-y-1">
            <p className="font-medium">Retake request submitted!</p>
            <p className="text-sm">We'll review your request shortly.</p>
          </div>
        );
        onClose();
      } else {
        throw new Error(response.data?.message || 'Request failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to submit request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Request Assessment Retake</h2>
        <p className="text-muted-foreground">
          Please explain why you need to retake this assessment.
        </p>
      </div>

      <div className="space-y-2">
        <textarea
          autoFocus
          className="w-full min-h-[200px] p-4 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Example: I experienced technical issues during my previous attempt..."
          required
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-brand hover:bg-brand/90 text-white"
          disabled={isSubmitting || !reason.trim()}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

const RetakeModal = ({ jobId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <RetakeRequestForm jobId={jobId} onClose={onClose} />
      </div>
    </div>
  );
};

const MobileRetakePage = ({ jobId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          className="mb-4 gap-1.5 px-0 hover:bg-transparent"
          onClick={onClose}
        >
          <ChevronLeft className="h-5 w-5" />
          Back to job
        </Button>
        <div className="max-w-md mx-auto">
          <RetakeRequestForm jobId={jobId} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};


const JobDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const jobId = params?.id;

  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(true);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);


  useEffect(() => {
    // Check if mobile view on component mount
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (!jobId) {
      toast.error('Invalid job ID');
      router.push('/jobs');
      return;
    }

    const fetchPublicDaetail = async () => {
      try {
        setIsLoading(true);
        const cachedJob = localStorage.getItem(`job-${jobId}`);
        if (cachedJob) {
          const parsed = JSON.parse(cachedJob);
          setJob(parsed.job);
          setIsSaved(parsed.isSaved);
          setSimilarJobs(parsed.similarJobs || []);

        }

        const jobRes = await axios.get(`/job/jobs/${jobId}/`, {
          baseURL: baseUrl,
        })
        if (!jobRes.data) {
          toast.error('Job not found');
          router.push('/jobs');
          return;
        }

        const formattedJob = {
          ...jobRes.data,
          created_at: formatDate(jobRes.data.created_at),
          description: cleanDescription(jobRes.data.description || ''),
          responsibilities: jobRes.data.responsibilities
            ? cleanDescription(jobRes.data.responsibilities).split('. ').filter(Boolean)
            : [],
          requirements: Array.isArray(jobRes.data.requirements)
            ? jobRes.data.requirements
            : cleanDescription(jobRes.data.requirements || '').split('. ').filter(Boolean),
          benefits: jobRes.data.benefits
            ? cleanDescription(jobRes.data.benefits).split('. ').filter(Boolean)
            : [],
          level: levelMap[jobRes.data.level] || '',
          experience_level: experienceLevelsMap[jobRes.data.experience_levels] || jobRes.data.level || '',
          weekly_ranges: weeklyRangesMap[jobRes.data.weekly_ranges]|| '',
          hire_number: jobRes.data.hire_number || 1
        };

        setJob(formattedJob);
        // Cache data
        localStorage.setItem(
          `job-${jobId}`,
          JSON.stringify({
            job: formattedJob,

          })
        );


      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setIsLoading(false);
      }
    }


    const fetchJobData = async () => {
      try {
        setIsLoading(true);
        const api = axios.create({
          baseURL: baseUrl,
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          }
        });

        // Check cache first
        const cachedJob = localStorage.getItem(`job-${jobId}`);
        if (cachedJob) {
          const parsed = JSON.parse(cachedJob);
          setJob(parsed.job);
          setIsSaved(parsed.isSaved);
          setSimilarJobs(parsed.similarJobs || []);
        }

        // Fetch fresh data in background
        const [jobRes, savedRes, appliedRes] = await Promise.all([
          api.get(`/job/jobs/${jobId}/`).catch(() => ({ data: null })),
          api.get('/job/saved-jobs/').catch(() => ({ data: [] })),
          api.get('/job/applied-jobs/').catch(() => ({ data: [] }))
        ]);

        if (!jobRes.data) {
          toast.error('Job not found');
          router.push('/jobs');
          return;
        }

        const formattedJob = {
          ...jobRes.data,
          created_at: formatDate(jobRes.data.created_at),
          description: cleanDescription(jobRes.data.description || ''),
          responsibilities: jobRes.data.responsibilities
            ? cleanDescription(jobRes.data.responsibilities).split('. ').filter(Boolean)
            : [],
          requirements: Array.isArray(jobRes.data.requirements)
            ? jobRes.data.requirements
            : cleanDescription(jobRes.data.requirements || '').split('. ').filter(Boolean),
          benefits: jobRes.data.benefits
            ? cleanDescription(jobRes.data.benefits).split('. ').filter(Boolean)
            : [],
          level: levelMap[jobRes.data.level]|| '',
          experience_level: experienceLevelsMap[jobRes.data.experience_levels] || jobRes.data.level || '',
          weekly_ranges: weeklyRangesMap[jobRes.data.weekly_ranges] || '',
          hire_number: jobRes.data.hire_number || 1
        };

        const isJobSaved = savedRes.data.some(job => job.id == jobId);
        const isJobApplied = appliedRes.data.some(job => job.id == jobId);

        // Fetch similar jobs
        let similar = [];
        try {
          const similarRes = await api.get('/job/job-options/');
          similar = similarRes.data.jobs
            ?.filter(j => j.id != jobId)
            ?.slice(0, 3)
            ?.map(j => ({
              ...j,
              created_at: formatDate(j.created_at),
              description: cleanDescription(j.description || '')
            })) || [];
        } catch {
          similar = [];
        }

        // Update state
        setJob(formattedJob);
        setIsSaved(isJobSaved);
        setSimilarJobs(similar);

        // Cache data
        localStorage.setItem(
          `job-${jobId}`,
          JSON.stringify({
            job: formattedJob,
            isSaved: isJobSaved,
            similarJobs: similar
          })
        );
      } catch (err) {
        console.error('Error fetching job:', err);
        router.push('/jobs');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchJobData();
    }
    else fetchPublicDaetail()
  }, [session, jobId, router]);

 

  const toggleSave = async () => {
    try {
      const api = axios.create({
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      });

      // Optimistic update
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);

      // Update cache
      if (job) {
        const cachedJob = localStorage.getItem(`job-${jobId}`);
        if (cachedJob) {
          const parsed = JSON.parse(cachedJob);
          localStorage.setItem(
            `job-${jobId}`,
            JSON.stringify({
              ...parsed,
              isSaved: newSavedState
            })
          );
        }
      }

      // Make API call
      await api.post(`/job/jobs/${jobId}/save/`);

      toast.success(newSavedState ? 'Job saved successfully' : 'Job unsaved successfully');
    } catch (err) {
      // Revert on error
      setIsSaved(!isSaved);
      toast.error(err.response?.data?.message || 'Failed to update saved status');
    }
  };

  const handleApply = async () => {
    router.push(`/jobs/${jobId}/assessment`);
  };

  const handleRetakeRequest = () => {
    setShowRetakeModal(true);
  };

 



  if (!job) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 gap-1.5 px-0 hover:bg-transparent"
            onClick={() => router.push('/jobs')}
          >
            <ChevronLeft className="h-5 w-5" />
            Back to jobs
          </Button>
          <div className="text-center py-12">
            <p className="text-gray-500">Job not found</p>
          </div>
        </div>
      </div>
    );
  }





  return (
    <div className="min-h-screen bg-white pb-8 pt-2">
       {showRetakeModal && (
        isMobileView ? 
          <MobileRetakePage jobId={jobId} onClose={() => setShowRetakeModal(false)} /> 
          : <RetakeModal jobId={jobId} onClose={() => setShowRetakeModal(false)} />
      )}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="md:mb-6 gap-1.5 px-0 hover:bg-transparent"
          onClick={() => router.push(`/jobs`)}
        >
          <ArrowLeft className="h-5 w-5" />
          Back to jobs
        </Button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <Card className={`border-none`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100  p-3 flex items-center justify-center">
                      {CompanyLogo(job.company)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{job.company?.name || 'Company'}</h3>
                      <p className="text-muted-foreground text-sm">
                        {job.company?.industry || 'Industry not specified'} • {job.company?.size || 'N/A'} employees
                      </p>
                    </div>
                  </div>
                  {session && <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSave}
                    aria-label={isSaved ? 'Unsave job' : 'Save job'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-5 w-5 text-brand fill-brand" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>}
                </div>
              </CardHeader>

              <CardContent className={`border pb-6 rounded-lg `}>
                <div className="py-6 mb-6 space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {job.title || 'Job Title'}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <div variant="secondary" className={` flex items-center gap-2 text-gray-800 border p-2 rounded-lg py-1 text-md`}>
                      {job.job_location_type || "Location not specified"}
                    </div>
                  
                    <div variant="secondary" className={` flex items-center gap-2 text-gray-800 border p-2 rounded-lg py-1 text-md`}>
                      {job.experience_level || "Experience not specified"}
                    </div>
                    {job.job_type && (
                      <div variant="secondary" className={` flex items-center gap-2 text-gray-800 border p-2 rounded-lg py-1 text-md`}>
                        {job.job_type}
                      </div>
                    )}
                    {job.weekly_ranges && (
                      <div variant="secondary" className={` flex items-center gap-2 text-gray-800 border p-2 rounded-lg py-1 text-md`}>
                        {job.weekly_ranges}
                      </div>
                    )}
                    {job.hire_number > 1 && (
                      <div variant="secondary" className={` flex items-center gap-2 text-gray-800 border p-2 rounded-lg py-1 text-md`}>
                        Hiring {job.hire_number} people
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-semibold">
                    ${job.salary_range || 'Salary not specified'}/year
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Posted {job.created_at || 'Date not available'}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex border-b mb-6">
                    <Button
                      variant="ghost"
                      className={`rounded-none ${activeTab === 'details' ? 'border-b-2 border-brand' : 'text-muted-foreground'}`}
                      onClick={() => setActiveTab('details')}
                    >
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      className={`rounded-none ${activeTab === 'company' ? 'border-b-2 border-brand' : 'text-muted-foreground'}`}
                      onClick={() => setActiveTab('company')}
                    >
                      Company
                    </Button>
                  </div>

                  {activeTab === 'details' ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Job Description</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {job.description || 'No description available'}
                        </p>
                      </div>

                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Responsibilities</h3>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {job.responsibilities.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}



                      {job.requirements.length > 0 ?
                        (
                          <div>
                            <h3 className="text-lg font-bold mb-3">Requirements</h3>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                              {job.requirements.map((item, index) => (
                                <li key={item.id}>{item.name}</li>
                              ))}
                            </ul>
                          </div>
                        ) : <div>
                          <h3 className="text-lg font-bold mb-3">Requirements</h3>
                          <p className='text-muted-foreground'>No Requirements</p>
                        </div>}



                      {job.benefits && job.benefits.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Benefits</h3>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {job.benefits.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">About {job.company?.name || 'the company'}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {job.company?.description || 'No company description available'}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-3">Company Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                          <div>
                            <p className="font-medium">Industry</p>
                            <p>{job.company?.industry || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="font-medium">Company Size</p>
                            <p>{job.company?.employees || 'N/A'} employees</p>
                          </div>
                          {job.company?.website && (
                            <div>
                              <p className="font-medium">Website</p>
                              <a
                                href={job.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand hover:underline"
                              >
                                {job.company.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {session && (isLoading ? <Spinner /> : <div className="flex flex-col sm:flex-row gap-4">
                  {job.has_started ? (
                    <Button
                      className="flex-1 text-white bg-brand hover:bg-brand hover:text-white"
                      onClick={handleRetakeRequest}
                    >
                      Request Retake
                    </Button>
                  ) : job.is_applied ? isLoading : (
                    <Button
                      className="flex-1 text-white bg-brand hover:bg-brand hover:text-white"
                      onClick={handleApply}
                    >
                      Apply
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1 border-brand text-brand hover:border-brand hover:text-brand"
                    onClick={toggleSave}
                  >
                    {isSaved ? 'Saved' : 'Save for Later'}
                  </Button>
                </div>)}
              </CardContent>
            </Card>
          </div>

          {session && <div className="lg:w-1/3">
            <Card className="sticky top-6">
              <CardHeader>
                <h2 className="text-xl font-bold">Similar Jobs</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarJobs.length > 0 ? (
                  similarJobs.map((similarJob) => (
                    <div
                      key={similarJob.id}
                      className="border rounded-lg p-4 cursor-pointer hover:border-brand"
                      onClick={() => router.push(`/jobs/${similarJob.id}`)}
                    >
                      <h3 className="font-semibold">{similarJob.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {similarJob.company?.name || 'Company'} • {similarJob.location || 'Location not specified'}
                      </p>
                      <p className="text-sm mt-2 line-clamp-2">
                        {similarJob.description || 'No description available'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No similar jobs found</p>
                )}
              </CardContent>
            </Card>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage; 