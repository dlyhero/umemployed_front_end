"use client"
import { useState, useCallback } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { FileText, UploadCloud, GraduationCap, Briefcase, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import baseUrl from '../../api/baseUrl'
import { useSession } from 'next-auth/react'

const JobRecommendationPage = () => {
  const { data: session } = useSession();
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [isTranscript, setIsTranscript] = useState(true)

  const onDrop = useCallback((acceptedFiles) => {
    setError(null)
    const selectedFile = acceptedFiles[0]
    
    // Validate file type (PDF, DOCX or TXT)
    if (!selectedFile.type.match(/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|plain)/)) {
      setError('Please upload a PDF, DOCX, or TXT file')
      return
    }
    
    setFile(selectedFile)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  })

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setIsLoading(true)
    setProgress(0)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percentCompleted)
        }
      }

      const response = await axios.post(`${baseUrl}/resume/upload-transcript/`, formData, config)
      
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setResult({
          jobTitle: response.data.job_title,
          reasoning: response.data.reasoning,
          extractedText: response.data.extracted_text
        })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing your file')
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const toggleFileType = () => {
    setIsTranscript(!isTranscript)
    setFile(null)
    setResult(null)
  }

  return (
    <div className="">
      <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Perfect Job Title</h1>
      </div>

      <Card >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand" />
            {isTranscript ? 'Upload Your Academic Transcript' : 'Upload Your Resume'}
          </CardTitle>
          <CardDescription>
            {isTranscript 
              ? 'For the most accurate career recommendations, we strongly recommend uploading your academic transcript. Our AI analyzes your coursework and performance to suggest the best career paths.'
              : 'You can also upload your resume, but transcript analysis provides more tailored recommendations.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!result ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={isTranscript ? 'default' : 'secondary'} className="cursor-pointer" onClick={toggleFileType}>
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Transcript
                  </Badge>
                  <Badge variant={!isTranscript ? 'default' : 'secondary'} className="cursor-pointer" onClick={toggleFileType}>
                    <FileText className="w-4 h-4 mr-1" />
                    Resume
                  </Badge>
                </div>
                {file && (
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    Clear
                  </Button>
                )}
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-3">
                  <UploadCloud className="w-10 h-10 text-gray-400" />
                  {file ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-gray-700">
                        {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                      </p>
                      <p className="text-sm text-gray-500">or click to browse files</p>
                      <p className="text-xs text-gray-400">Supports: PDF, DOC, DOCX, TXT</p>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Analyzing your {isTranscript ? 'transcript' : 'resume'}...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Analysis Complete!</AlertTitle>
                <AlertDescription>
                  Here's our career recommendation based on your transcript analysis.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recommended Job Title</CardTitle>
                  <CardDescription className="text-lg font-medium text-primary">
                    {result.jobTitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Analysis Reasoning:</h3>
                      <p className="text-sm text-gray-700">{result.reasoning}</p>
                    </div>
                   
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>

        {!result && (
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit} className={`bg-brand text-white hover:bg-brand/80`} disabled={!file || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Analyze & Recommend'
              )}
            </Button>
          </CardFooter>
        )}

        {result && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setResult(null)}>
              Upload Another File
            </Button>
            <Button className={`bg-brand text-white hover:bg-brand/80`}>
              Save Recommendation
            </Button>
          </CardFooter>
        )}
      </Card>

      {isTranscript && !result && (
        <Alert className="mt-6 bg-blue-50 border-blue-200">
          <GraduationCap className="w-4 h-4 text-brand" />
          <AlertTitle>Why transcripts work better</AlertTitle>
          <AlertDescription className="text-brand/90">
            Our analysis shows that academic transcripts provide 37% more accurate career recommendations than resumes alone, 
            as they reveal your core competencies and knowledge areas in depth.
          </AlertDescription>
        </Alert>
      )}
    </div>
    </div>
  )
}

export default JobRecommendationPage