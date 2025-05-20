"use client"
import { useState, useEffect } from "react"
import { Bookmark, BookmarkCheck, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { useSession } from "next-auth/react"
import baseUrl from "@/src/app/api/baseUrl"
import { Skeleton } from "@/components/ui/skeleton"
import { Suitcase } from "@phosphor-icons/react"

const JobDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const jobId = params?.id

  const [job, setJob] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [similarJobs, setSimilarJobs] = useState([])
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(true)
  const [showRetakeModal, setShowRetakeModal] = useState(false)
  const [retakeReason, setRetakeReason] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Component definitions
  const RetakeModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <RetakeRequestForm 
            onClose={() => setShowRetakeModal(false)}
            retakeReason={retakeReason}
            setRetakeReason={setRetakeReason}
            submitRetakeRequest={submitRetakeRequest}
            isSaved={isSaved}
            toggleSave={toggleSave}
            isSaving={isSaving}
          />
        </div>
      </div>
    )
  }

  const RetakeRequestForm = ({ 
    onClose, 
    retakeReason, 
    setRetakeReason, 
    submitRetakeRequest,
    isSaved,
    toggleSave,
    isSaving
  }) => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Request Assessment Retake</h2>
        <p className="text-muted-foreground">
          Please explain why you need to retake this assessment. We'll review your request and get back to you.
        </p>

        <textarea
          className="w-full border rounded-lg p-4 min-h-[200px]"
          value={retakeReason}
          onChange={(e) => setRetakeReason(e.target.value)}
          placeholder="Enter your reasons here..."
        />

        <div className="flex gap-4">
          <Button className="border-brand text-brand hover:text-brand flex-1" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-brand hover:bg-brand/80 text-white"
            onClick={submitRetakeRequest}
            disabled={!retakeReason.trim()}
          >
            Submit Request
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full border-brand text-brand hover:border-brand hover:text-brand"
          onClick={toggleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-gray-300 border-t-brand rounded-full animate-spin" />
              {isSaved ? "Unsaving..." : "Saving..."}
            </span>
          ) : isSaved ? "Saved" : "Save for Later"}
        </Button>
      </div>
    )
  }

  const MobileRetakePage = () => {
    return (
      <div className="fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            className="mb-4 gap-1.5 px-0 hover:bg-transparent"
            onClick={() => setShowRetakeModal(false)}
          >
            <ChevronLeft className="h-5 w-5" />
            Back to job
          </Button>
          <div className="max-w-md mx-auto">
            <RetakeRequestForm 
              onClose={() => setShowRetakeModal(false)}
              retakeReason={retakeReason}
              setRetakeReason={setRetakeReason}
              submitRetakeRequest={submitRetakeRequest}
              isSaved={isSaved}
              toggleSave={toggleSave}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    if (!jobId) {
      toast.error("Invalid job ID")
      router.push("/jobs")
      return
    }
    const fetchJobData = async () => {
      try {
        setIsLoading(true);
        const api = axios.create({
          baseURL: baseUrl,
        });
    
        const jobRes = await api.get(`/job/jobs/${jobId}/`);
    
        if (!jobRes.data) {
          toast.error("Job not found");
          router.push("/jobs");
          return;
        }
    
        // ... (your existing job formatting code)

        const formattedJob = {
          ...jobRes.data,
          created_at: formatDate(jobRes.data.created_at),
          description: cleanDescription(jobRes.data.description || ""),
          responsibilities: jobRes.data.responsibilities
            ? cleanDescription(jobRes.data.responsibilities).split(". ").filter(Boolean)
            : [],
          requirements: Array.isArray(jobRes.data.requirements)
            ? jobRes.data.requirements
            : cleanDescription(jobRes.data.requirements || "")
                .split(". ")
                .filter(Boolean),
          benefits: jobRes.data.benefits ? cleanDescription(jobRes.data.benefits).split(". ").filter(Boolean) : [],
          level: jobRes.data.level || "",
          experience_level: jobRes.data.experience_levels || jobRes.data.level || "",
          weekly_ranges: jobRes.data.weekly_ranges || "",
          hire_number: jobRes.data.hire_number || 1,
        }
    
        setJob(formattedJob);
    
        if (session?.accessToken) {
          const authApi = axios.create({
            baseURL: baseUrl,
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });
    
          const [savedRes, appliedRes] = await Promise.all([
            authApi.get("/job/saved-jobs/").catch(() => ({ data: [] })),
            authApi.get("/job/applied-jobs/").catch(() => ({ data: [] })),
          ]);
    
          // This is the critical part for saved state
          const isJobSaved = savedRes.data.some((job) => job.id == jobId);
          setIsSaved(isJobSaved);
          setIsApplied(appliedRes.data.some((job) => job.id == jobId));
          setHasStarted(jobRes.data.has_started || false);
    
          // ... (rest of your code)
          let similar = []
          try {
            const similarRes = await authApi.get("/job/job-options/")
            similar =
              similarRes.data.jobs
                ?.filter((j) => j.id != jobId)
                ?.slice(0, 3)
                ?.map((j) => ({
                  ...j,
                  created_at: formatDate(j.created_at),
                  description: cleanDescription(j.description || ""),
                })) || []
          } catch {
            similar = []
          }
          setSimilarJobs(similar)
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        toast.error(err.response?.data?.message || "Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    

    fetchJobData()
  }, [session, jobId, router])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const cleanDescription = (html) => {
    if (!html || typeof html !== "string") return ""

    const tmp = document.createElement("div")
    tmp.innerHTML = html

    const text = tmp.textContent || tmp.innerText || ""

    return text
      .replace(/<[^>]*>/g, " ")
      .replace(/[*_-]/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/[ \t\r\n]+/g, " ")
      .replace(/^[ \t]+/g, "")
      .replace(/[ \t]+$/g, "")
      .trim()
  }

  const toggleSave = async () => {
    if (!session?.accessToken) {
      toast.error("Please login to save jobs");
      return;
    }
  
    try {
      setIsSaving(true);
      const authApi = axios.create({
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
  
      // Optimistic update
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
  
      // API call - always POST since it's a toggle endpoint
      await authApi.post(`/job/jobs/${jobId}/save/`);
      toast.success(`Job ${newSavedState ? 'saved' : 'unsaved'} successfully`);
  
      // Update the saved jobs list without full refresh
      const savedRes = await authApi.get("/job/saved-jobs/");
      const isJobSaved = savedRes.data.some((job) => job.id == jobId);
      setIsSaved(isJobSaved);
    } catch (err) {
      // Revert optimistic update
      setIsSaved(!isSaved);
      toast.error(err.response?.data?.message || "Failed to update saved status");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleApply = async () => {
    router.push(`/jobs/${jobId}/assessment`)
  }

  const handleRetakeRequest = () => {
    setShowRetakeModal(true)
  }

  const submitRetakeRequest = async () => {
    try {
      const api = axios.create({
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })

      await api.post(`/job/${jobId}/report-test/`, {
        reason: retakeReason,
      })

      toast.success(
        <div className="space-y-1">
          <p className="font-medium">Retake request submitted successfully</p>
          <p className="text-sm">We'll review your request and get back to you shortly.</p>
        </div>,
      )
      setShowRetakeModal(false)
      setRetakeReason("")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit retake request")
    }
  }

  // Loading and empty states remain the same as your original code
  // ... [rest of your component code remains unchanged]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-8 pt-2">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="w-32 h-4 mb-6" />

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-14 h-14 rounded-lg" />
                      <div>
                        <Skeleton className="w-40 h-4 mb-2" />
                        <Skeleton className="w-52 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="border-t border-b py-6 mb-6 space-y-4">
                    <Skeleton className="w-3/4 h-6" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-28 rounded" />
                      ))}
                    </div>
                    <Skeleton className="w-1/2 h-5" />
                    <Skeleton className="w-1/3 h-3" />
                  </div>

                  <div>
                    <div className="flex border-b mb-6">
                      <Skeleton className="h-10 w-24 mr-2" />
                      <Skeleton className="h-10 w-24" />
                    </div>

                    <div className="space-y-4">
                      <Skeleton className="w-40 h-5" />
                      <Skeleton className="w-full h-20 rounded" />
                      <Skeleton className="w-32 h-5 mt-6" />
                      <ul className="space-y-2 pl-5">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-3 w-64" />
                        ))}
                      </ul>
                      <Skeleton className="w-32 h-5 mt-6" />
                      <ul className="space-y-2 pl-5">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-3 w-64" />
                        ))}
                      </ul>
                      <Skeleton className="w-32 h-5 mt-6" />
                      <ul className="space-y-2 pl-5">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-3 w-64" />
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Skeleton className="h-10 w-full sm:w-1/2 rounded" />
                    <Skeleton className="h-10 w-full sm:w-1/2 rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-1/3">
              <Card className="sticky top-6">
                <CardHeader>
                  <Skeleton className="w-40 h-6" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 border p-4 rounded-lg">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 gap-1.5 px-0 hover:bg-transparent"
            onClick={() => router.push("/jobs")}
          >
            <ChevronLeft className="h-5 w-5" />
            Back to jobs
          </Button>
          <div className="text-center py-12">
            <p className="text-gray-500">Job not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-8 pt-2">
      {showRetakeModal && (isMobileView ? <MobileRetakePage /> : <RetakeModal />)}

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="md:mb-6 gap-1.5 px-0 hover:bg-transparent"
          onClick={() => router.push(`/jobs`)}
        >
          <ChevronLeft className="h-5 w-5" />
          Back to jobs
        </Button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center">
                      <Suitcase className="w-10 h-10 text-brand" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{job.company?.name || "Company"}</h3>
                      <p className="text-muted-foreground text-sm">
                        {job.company?.industry || "Industry not specified"} • {job.company?.size || "N/A"} employees
                      </p>
                    </div>
                  </div>
                  {session && session?.user.role !== "recruiter" && (
                   <Button
                   variant="ghost"
                   size="icon"
                   onClick={toggleSave}
                 >
                   {isSaved ? (
                     <BookmarkCheck className="h-5 w-5 text-brand fill-brand" />
                   ) : (
                     <Bookmark className="h-5 w-5 text-gray-400" />
                   )}
                 </Button>
                  )}
                </div>
              </CardHeader>

              {/* Rest of your card content remains the same */}
              {/* ... */}

              <CardContent>
                <div className="border-t border-b py-6 mb-6 space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold">{job.title || "Job Title"}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className={` text-brand text-md`}>
                      {job.job_location_type || "Location not specified"}
                    </Badge>
                    <Badge variant="secondary" className={` text-brand text-md`}>
                      {job.location || "Remote"}
                    </Badge>
                    <Badge variant="secondary" className={` text-brand text-md`}>
                      {job.experience_level || "Experience not specified"}
                    </Badge>
                    {job.level && (
                      <Badge variant="secondary" className={` text-brand text-md`}>
                        {job.level}
                      </Badge>
                    )}
                    {job.weekly_ranges && (
                      <Badge variant="secondary" className={` text-brand text-md`}>
                        {job.weekly_ranges}
                      </Badge>
                    )}
                    {job.hire_number > 1 && (
                      <Badge variant="secondary" className={` text-brand text-md`}>
                        Hiring {job.hire_number} people
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl font-semibold text-brand">${job.salary_range || "Salary not specified"}/year</p>
                  <p className="text-sm text-muted-foreground">Posted {job.created_at || "Date not available"}</p>
                </div>

                <div className="mb-8">
                  <div className="flex border-b mb-6">
                    <Button
                      variant="ghost"
                      className={`rounded-none ${activeTab === "details" ? "border-b-2 border-brand" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("details")}
                    >
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      className={`rounded-none ${activeTab === "company" ? "border-b-2 border-brand" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("company")}
                    >
                      Company
                    </Button>
                  </div>

                  {activeTab === "details" ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Job Description</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {job.description || "No description available"}
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

                      {job.requirements && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Requirements</h3>
                          {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                              {job.requirements.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">No Requirements</p>
                          )}
                        </div>
                      )}

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
                        <h2 className="text-xl font-bold mb-4">About {job.company?.name || "the company"}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {job.company && job.company.description
                            ? cleanDescription(job.company.description)
                            : "No company description available"}
                        </p>
                      </div>
                      {job.company && job.company.mission_statement && (
                        <div>
                          <h2 className="text-xl font-bold mb-4">Mission</h2>
                          <p className="text-muted-foreground leading-relaxed">
                            {cleanDescription(job.company?.mission_statement)}
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-bold mb-3">Company Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                          <div>
                            <p className="font-semibold">Industry:</p>
                            <p>{job.company?.industry || "Not specified"}</p>
                          </div>
                          {job.company && job.company.size && (
                            <div>
                              <p className="font-semibold">Company Size:</p>
                              <p>{job.company?.size} employees</p>
                            </div>
                          )}
                          {job.company && job.company.location && (
                            <div>
                              <p className="font-semibold">Company Location:</p>
                              <p>{job.company.location}</p>
                            </div>
                          )}
                          {job.company && job.company.founded && (
                            <div>
                              <p className="font-semibold">Company Founded:</p>
                              <p>{job.company.founded}</p>
                            </div>
                          )}
                          {job.company && job.company.website_url && (
                            <div>
                              <p className="font-semibold">Website:</p>
                              <a
                                href={job.company.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand hover:underline"
                              >
                                {job.company.website_url}
                              </a>
                            </div>
                          )}
                          {job.company && job.company.linkedin && (
                            <div>
                              <p className="font-semibold">LinkedIn:</p>
                              <a
                                href={job.company.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand hover:underline"
                              >
                                {job.company.linkedin}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {session && session?.user.role !== "recruiter" && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {hasStarted ? (
                      <Button
                        className="flex-1 text-white bg-brand hover:bg-brand hover:text-white"
                        onClick={handleRetakeRequest}
                      >
                        Request Retake
                      </Button>
                    ) : isApplied ? (
                      <Button className="flex-1 text-white bg-brand/80 hover:bg-brand hover:text-white" disabled>
                        Applied
                      </Button>
                    ) : (
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
                      {isSaved ? "Saved" : "Save for Later"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Similar jobs section remains the same */}
          {/* ... */}
          <div className="lg:w-1/3">
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
                        {similarJob.company?.name || "Company"} • {similarJob.location || "Location not specified"}
                      </p>
                      <p className="text-sm mt-2 line-clamp-2">
                        {similarJob.description || "No description available"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No similar jobs found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage