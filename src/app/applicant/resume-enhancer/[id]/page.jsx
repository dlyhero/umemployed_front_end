"use client"
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { Download, FileText, Sparkles, ChevronLeft, Loader2, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import Head from 'next/head'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import baseUrl from '@/src/app/api/baseUrl'
import { LinkedinLogoIcon } from '@phosphor-icons/react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export default function AIResumeEnhancerPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { id: jobId } = useParams()
  const resumeRef = useRef()
  const fileInputRef = useRef(null)

  const [isLoading, setIsLoading] = useState(false)
  const [enhancedResume, setEnhancedResume] = useState(null)
  const [file, setFile] = useState(null)
  const [activeTab, setActiveTab] = useState('enhance')
  const [jobDetails, setJobDetails] = useState(null)
  const [isLoadingJob, setIsLoadingJob] = useState(true)

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !session) return
      
      setIsLoadingJob(true)
      try {
        const response = await axios.get(
          `${baseUrl}/job/jobs/${jobId}/`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        )
        setJobDetails(response.data)
      } catch (error) {
        console.error('Error fetching job details:', error)
        toast.error('Failed to load job details')
      } finally {
        setIsLoadingJob(false)
      }
    }
    
    fetchJobDetails()
  }, [jobId, session])

  const getPageTitle = () => {
    if (isLoadingJob) return 'AI Resume Enhancer - Loading...'
    if (jobDetails) {
      return `AI Resume Enhancer - ${jobDetails.title} at ${jobDetails.company_name}`
    }
    return 'AI Resume Enhancer'
  }

  const handleEnhanceResume = async () => {
    if (!file) {
      toast.warning('Please upload a resume file')
      return
    }
    setIsLoading(true)
  
    const formData = new FormData()
    formData.append('file', file)
  
    try {
      const response = await axios.post(
        `${baseUrl}/resume/enhance-resume/${jobId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      
      setEnhancedResume(response.data.enhanced_resume)
      setActiveTab('result')
      toast.success('Resume enhanced successfully!')
    } catch (error) {
      console.error('Error enhancing resume:', error)
      toast.error(error.response?.data?.message || 'Failed to enhance resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
  
    try {
      // Clone resume DOM element to modify without affecting the original
      const clone = resumeRef.current.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      document.body.appendChild(clone);
  
      // Replace all oklch color formats with safe fallback colors
      const replaceOklchColors = (el) => {
        const styles = window.getComputedStyle(el);
        const propertiesToCheck = ['color', 'backgroundColor', 'borderColor'];
  
        propertiesToCheck.forEach((prop) => {
          const value = styles[prop];
          if (value.includes('oklch')) {
            const fallback = prop === 'backgroundColor' ? '#ffffff' : '#000000';
            el.style[prop] = fallback;
          }
        });
  
        // Handle inline styles
        const inlineStyle = el.getAttribute('style');
        if (inlineStyle && inlineStyle.includes('oklch')) {
          const newStyle = inlineStyle.replace(/oklch\([^)]+\)/g, (match) => {
            return '#000000'; // You can use different fallback if needed
          });
          el.setAttribute('style', newStyle);
        }
      };
  
      // Loop through all elements in the cloned resume
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(replaceOklchColors);
      replaceOklchColors(clone); // Also replace styles on the root clone
  
      // Generate canvas from the cloned DOM
      const canvas = await html2canvas(clone, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        ignoreElements: () => false,
      });
  
      document.body.remove(clone); // Clean up cloned element
  
      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save(`${enhancedResume?.full_name || 'resume'}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again or contact support.');
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    const allowedExtensions = ['pdf', 'doc', 'docx']
    const fileExtension = selectedFile?.name.split('.').pop().toLowerCase()

    if (allowedExtensions.includes(fileExtension)) {
      setFile(selectedFile)
    } else {
      toast.warning('Please upload a file in PDF, DOC, or DOCX format.')
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={`Enhance your resume for ${jobDetails?.title || 'job opportunities'} using AI-powered optimization`} />
      </Head>
      
      <div className="flex min-h-screen max-w-7xl mx-auto">
        <div className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-white p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
              
              {enhancedResume && (
                <Button variant="brand" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>

          <div className="p-6 max-w-5xl mx-auto">
            {jobDetails && (
              <div className="mb-6 p-4 rounded-lg text-center">
                <h1 className="text-xl font-semibold text-gray-900 text-center">
                  Enhancing Resume for: {jobDetails.title}
                </h1>
                <p className="text-gray-600 font-semibold">
                  at <span className="text-brand">{jobDetails.company.name}</span>
                </p>
              </div>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
                <TabsTrigger value="enhance">Enhance Resume</TabsTrigger>
                <TabsTrigger value="result">Enhanced Result</TabsTrigger>
              </TabsList>
              
              <TabsContent value="enhance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Enhance Your Resume
                    </CardTitle>
                    {jobDetails && (
                      <p className="text-sm text-muted-foreground">
                        Tailoring your resume for <span className="font-medium">{jobDetails.title}</span> position at <span className="font-medium">{jobDetails.company_name}</span>
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="resume">Upload Your Resume</Label>
                        <Input 
                          id="resume" 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          className="mt-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Supported formats: PDF, DOC, DOCX
                        </p>
                      </div>
                      
                      {file && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                      )}
                      
                      <Button 
                        variant="brand" 
                        onClick={handleEnhanceResume}
                        disabled={isLoading || !file}
                        className="w-full md:w-auto"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Enhance Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="result">
                {enhancedResume ? (
                  <div className="space-y-6">
                    {/* Hidden resume for PDF generation */}
                    <div style={{ position: 'absolute', left: '-10000px', top: 0 }}>
                      <div ref={resumeRef} className="p-8 bg-white">
                        <ResumePrintView resume={enhancedResume} />
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Enhanced Resume Preview</CardTitle>
                        {jobDetails && (
                          <p className="text-sm text-muted-foreground">
                            Optimized for <span className="font-medium">{jobDetails.title}</span> at <span className="font-medium">{jobDetails.company.name}</span>
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg p-6 bg-white">
                          <ResumePrintView resume={enhancedResume} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Enhanced Resume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Sparkles className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No enhanced resume yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Upload your resume and click "Enhance Resume" to get started
                        </p>
                        <Button variant="brand" onClick={() => setActiveTab('enhance')}>
                          Enhance Resume
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
  
// Printable Resume Component (unchanged)
const ResumePrintView = ({ resume }) => {
  if (!resume) return null
  return (
    <div className="print-resume bg-white p-8 max-w-4xl mx-auto" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{resume.full_name}</h1>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600 flex-wrap">
          <span>{resume.email}</span>
          <span>{resume.phone}</span>
          {resume.linkedin && <span>{resume.linkedin}</span>}
          <span>{resume.location}</span>
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <p className="text-sm leading-relaxed text-gray-700">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && Object.keys(resume.skills).length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">Skills</h2>
          <div className="space-y-4">
            {Object.entries(resume.skills).map(([category, skills]) => (
              <div key={category}>
                <h3 className="font-medium text-gray-800">{category}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">Experience</h2>
          <div className="space-y-6">
            {resume.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-600">{exp.date_start} - {exp.date_end}</span>
                </div>
                <div className="text-sm text-gray-600 italic">{exp.company}, {exp.location}</div>
                <div className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">Education</h2>
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-gray-900">{resume.education.degree}</h3>
              <span className="text-sm text-gray-600">{resume.education.date_start} - {resume.education.date_end}</span>
            </div>
            <div className="text-sm text-gray-600 italic">{resume.education.university}, {resume.education.location}</div>
            {resume.education.description && (
              <p className="mt-2 text-sm text-gray-700">{resume.education.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}