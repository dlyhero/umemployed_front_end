"use client"
import { useParams } from 'next/navigation'
import { Check, Download, Mail, Phone, MapPin, Link2, ChevronRight, FileInput, Sparkles, Crown, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useSession } from 'next-auth/react'

export default function AIResumeEnhancer() {
  const { id: jobId } = useParams()
  const { data: session } = useSession()
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [enhancedResume, setEnhancedResume] = useState(null)
  const [jobDetails, setJobDetails] = useState(null)
  const [matchScore, setMatchScore] = useState(0)

  // Check if user is shortlisted for this job
  useEffect(() => {
    const checkShortlistedStatus = async () => {
      try {
        // Mock API call - replace with actual API call
        // const response = await axios.get(`/api/jobs/${jobId}/shortlisted`, {
        //   headers: { Authorization: `Bearer ${session?.accessToken}` }
        // })
        // setIsShortlisted(response.data.isShortlisted)
        
        // For demo purposes - randomly set shortlisted status
        setIsShortlisted(Math.random() > 0.5)
      } catch (error) {
        console.error('Error checking shortlisted status:', error)
      }
    }
    
    checkShortlistedStatus()
  }, [jobId, session])

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Mock data for demo
        setJobDetails({
          id: jobId,
          title: "Senior Data Scientist",
          company: "Tech Innovations Inc.",
          description: "We're looking for a skilled Data Scientist with expertise in machine learning, NLP, and big data processing...",
          requirements: [
            "5+ years experience in Python and SQL",
            "Strong background in machine learning algorithms",
            "Experience with NLP and computer vision",
            "Advanced degree in Computer Science or related field"
          ]
        })
      } catch (error) {
        console.error('Error fetching job details:', error)
      }
    }
    fetchJobDetails()
  }, [jobId])

  const enhanceResume = async () => {
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('resume_file', file)

    try {
      // Mock response for demo
      setTimeout(() => {
        const mockResponse = {
          data: {
            message: "Resume enhanced successfully",
            enhanced_resume: {
              ...HARDCODED_RESUME.enhanced_resume,
              summary: "Results-driven Sr E2E Deliver and Data Science Analyst with 5+ years of experience in Python, SQL, and machine learning. Specialized in developing data-driven solutions using NLP and computer vision techniques to optimize business processes.",
              skills: {
                ...HARDCODED_RESUME.enhanced_resume.skills,
                "Advanced Skills": ["Natural Language Processing (NLP)", "Computer Vision", "Big Data Processing"]
              }
            },
            match_score: 88,
            enhancements: [
              "Emphasized 5+ years of Python experience",
              "Highlighted NLP and computer vision projects",
              "Added relevant keywords from job description",
              "Optimized professional summary for data science roles"
            ]
          }
        }

        setEnhancedResume(mockResponse.data.enhanced_resume)
        setMatchScore(mockResponse.data.match_score)
        setIsLoading(false)
        
        toast({
          title: "Resume Enhanced",
          description: "Your resume has been optimized for this job posting",
        })
      }, 2000)
    } catch (error) {
      console.error('Error enhancing resume:', error)
      toast({
        title: "Error",
        description: "Failed to enhance resume",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  const downloadPDF = async () => {
    toast({
      title: "Downloading",
      description: "Your enhanced resume PDF is being generated",
    })
  }

  if (!isShortlisted) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 max-w-2xl mx-auto p-8 text-center mt-[5%]">
          <div className="bg-gradient-to-r from-purple-100 to-blue-50 p-6 rounded-lg">
            <Crown className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
            <p className="text-gray-600 mb-6">
              This feature is only available to shortlisted candidates for this job. 
              Upgrade to premium to access the AI Resume Enhancer for all jobs.
            </p>
            <Button variant="brand" className="gap-2">
              <Star className="h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-6">
        {!enhancedResume ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">AI Resume Enhancer</h1>
              <p className="text-gray-600">
                Optimize your resume for: <span className="font-semibold">{jobDetails?.title}</span>
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <FileInput className="h-4 w-4" />
                    Upload Your Resume
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    We'll analyze and enhance your resume to better match the job requirements
                  </p>
                </div>

                {jobDetails?.requirements && (
                  <div>
                    <h3 className="font-medium mb-2">Key Job Requirements:</h3>
                    <ul className="space-y-2">
                      {jobDetails.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          <ChevronRight className="h-4 w-4 mt-1 mr-2 flex-shrink-0 text-gray-500" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={enhanceResume}
                  disabled={!file || isLoading}
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Enhance My Resume
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Enhanced Resume</h1>
                <p className="text-gray-600">
                  Optimized for: <span className="font-semibold">{jobDetails?.title}</span> at {jobDetails?.company}
                </p>
              </div>
              <Button variant="brand" onClick={downloadPDF} className="gap-2 w-fit">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>

            {/* Match Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Job Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Relevance Score</span>
                    <span className="font-bold">{matchScore}%</span>
                  </div>
                  <Progress value={matchScore} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Key Improvements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Emphasized relevant skills: Python, SQL, NLP</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Highlighted machine learning experience</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Optimized professional summary</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Job Requirements Coverage</h3>
                    <ul className="space-y-2">
                      {jobDetails?.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          {i % 2 === 0 ? (
                            <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                          )}
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Resume Preview */}
            <EnhancedResumePreview resume={enhancedResume} />
          </div>
        )}
      </main>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="w-64 border-r p-4 hidden md:block">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">AI Resume Enhancer</h3>
          <p className="text-sm text-muted-foreground">
            Optimize your resume for specific job postings
          </p>
        </div>
        
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <FileInput className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Sparkles className="mr-2 h-4 w-4" />
            Enhancements
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Recent Jobs</h4>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Briefcase className="mr-2 h-4 w-4" />
              Data Scientist
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Briefcase className="mr-2 h-4 w-4" />
              ML Engineer
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

function EnhancedResumePreview({ resume }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">{resume.full_name}</CardTitle>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI Enhanced
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            {resume.email}
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            {resume.phone}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {resume.location}
          </div>
          {resume.linkedin && (
            <div className="flex items-center">
              <Link2 className="mr-2 h-4 w-4" />
              LinkedIn
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Professional Summary */}
        <div>
          <h3 className="font-bold mb-2">Professional Summary</h3>
          <p className="text-muted-foreground">{resume.summary}</p>
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-bold mb-3">Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(resume.skills).map(([category, skills]) => (
              <div key={category} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{category}</h4>
                <ul className="space-y-1">
                  {(skills).map((skill) => (
                    <li key={skill} className="flex items-center text-muted-foreground">
                      <ChevronRight className="h-3 w-3 mr-2 text-gray-400" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-bold mb-3">Professional Experience</h3>
          <div className="space-y-6">
            {resume.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-4">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-sm text-muted-foreground">{exp.dates}</p>
                </div>
                <p className="text-muted-foreground mb-2">
                  {exp.company} | {exp.location}
                </p>
                <ul className="space-y-2">
                  {exp.description.map((desc, j) => (
                    <li key={j} className="flex text-muted-foreground">
                      <span className="mr-2">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="font-bold mb-3">Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resume.education.map((edu, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h4 className="font-medium">{edu.degree} in {edu.major}</h4>
                <p className="text-muted-foreground">{edu.university}</p>
                <p className="text-sm text-muted-foreground">{edu.location} | {edu.dates}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock data
const HARDCODED_RESUME = {
  enhanced_resume: {
    full_name: "Parth Bhatt",
    email: "parthbhatt031795@gmail.com",
    phone: "(848)-219-2155",
    linkedin: "",
    location: "AVENEL NJ 07001",
    summary: "Results-driven Sr E2E Deliver and Data Science Analyst with a strong background in delivering data-driven solutions to optimize processes and achieve cost savings.",
    skills: {
      "Programming Languages": ["Python", "SQL"],
      "Software": ["Tableau", "Eclipse"],
      "Machine Learning": ["Logistic Regression", "Clustering", "XGBoost"],
      "Artificial Intelligence": ["Natural Language Processing", "CNN"],
      "Libraries": ["Pandas", "Numpy", "Matplotlib", "Scikit-learn"]
    },
    experience: [
      {
        title: "Sr E2E Deliver and Data Science Analyst",
        company: "Kenvue",
        location: "Skillman, NJ",
        dates: "December 2022 – Present",
        description: [
          "Identified inefficiencies in processes and proposed data-driven solutions, resulting in approximately $1 million savings.",
          "Developed automated solutions for data extraction, revenue reconciliation, and inbound freight forecasting."
        ]
      },
      {
        title: "Design Engineer",
        company: "Constellation Energy",
        location: "Pottstown, PA",
        dates: "February 2019 – December 2022",
        description: [
          "Developed predictive models and automated systems for cable degradation prediction and water intrusion detection.",
          "Created tools like the A200 Thermal Overload Calculator using Image Recognition Graphing."
        ]
      }
    ],
    education: [
      {
        degree: "Masters of Computer Science",
        major: "Big Data Systems",
        university: "Arizona State University",
        location: "Tempe, AZ",
        dates: "Graduated: December 2023"
      },
      {
        degree: "Bachelors of Science",
        major: "Electrical Engineering",
        university: "Rutgers University",
        location: "New Brunswick, NJ",
        dates: "Graduated: December 2018"
      }
    ]
  }
}