"use client"
import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { FileText, UploadCloud, AlertCircle, Loader2, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import baseUrl from '../../api/baseUrl'
import { useSession } from 'next-auth/react'
import { Progress } from '@/components/ui/progress'

const ResumeAdvisorPage = () => {
    const { data: session } = useSession();
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [analysis, setAnalysis] = useState(null)
    const [previousAnalyses, setPreviousAnalyses] = useState([])
    const [showHistory, setShowHistory] = useState(false)

    useEffect(() => {
        if (session?.accessToken) {
            axios.get(`${baseUrl}/resume/resume-analyses/`, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            })
                .then(response => {
                    setPreviousAnalyses(response.data)
                })
                .catch(err => {
                    console.error("Error fetching previous analyses:", err)
                })
        }
    }, [session?.accessToken])

    const onDrop = useCallback((acceptedFiles) => {
        setError(null)
        const selectedFile = acceptedFiles[0]

        if (!selectedFile.type.match(/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|plain)/)) {
            setError('Please upload a PDF, DOCX, or TXT file')
            return
        }

        setFile(selectedFile)
        setAnalysis(null)
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
        setAnalysis(null)

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

            const response = await axios.post(`${baseUrl}/resume/resume-analysis/`, formData, config)

            if (response.data.error) {
                setError(response.data.error)
            } else {
                setAnalysis(response.data)
                const historyResponse = await axios.get(`${baseUrl}/resume/resume-analyses/`, {
                    headers: {
                        'Authorization': `Bearer ${session?.accessToken}`
                    }
                })
                setPreviousAnalyses(historyResponse.data)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while processing your resume')
        } finally {
            setIsLoading(false)
            setProgress(0)
        }
    }

    const resetAnalysis = () => {
        setFile(null)
        setAnalysis(null)
        setError(null)
    }

    const loadPreviousAnalysis = (prevAnalysis) => {
        setAnalysis(prevAnalysis)
        setShowHistory(false)
    }

    return (
        <div className="">
            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Resume Advisor</h1>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FileText className="w-6 h-6 text-brand" />
                                <CardTitle>Resume Analysis</CardTitle>
                            </div>
                            {previousAnalyses.length > 0 && !analysis && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowHistory(!showHistory)}

                                >
                                    <History className="w-4 h-4 mr-2" />
                                    {showHistory ? 'Hide History' : 'View History'}
                                </Button>
                            )}
                        </div>
                        <CardDescription>
                            Upload your resume to receive personalized improvement suggestions
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {showHistory ? (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Previous Analyses</h3>
                                <div className="space-y-3">
                                    {previousAnalyses.map((item, index) => (
                                        <Card
                                            key={index}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => loadPreviousAnalysis(item)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                                                        <p className="text-sm text-gray-600">{item.file_name}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setShowHistory(false)}
                                    >
                                        Back to Upload
                                    </Button>
                                </div>
                            </div>
                        ) : !analysis ? (
                            <div className="space-y-6">
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand bg-brand/5' : 'border-gray-300 hover:border-brand'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-brand' : 'text-gray-400'}`} />
                                        {file ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FileText className="w-4 h-4" />
                                                <span>{file.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-medium text-gray-700">
                                                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
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
                                            <span>Analyzing your resume...</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!file || isLoading}
                                        className={`bg-brand text-white hover:bg-brand/90`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            'Analyze Resume'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <Button
                                    variant="ghost"
                                    onClick={resetAnalysis}
                                    className="text-brand hover:bg-brand/10"
                                >
                                    Upload Another File
                                </Button>

                                <Alert className="bg-blue-50 border-blue-200">
                                    <AlertTitle className="text-brand">Analysis Complete</AlertTitle>
                                    <AlertDescription className="text-brand/90">
                                        Here are our recommendations to improve your resume
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">Suggested Improvements</h3>
                                    <div className="space-y-3">
                                        {Object.entries(analysis.improvement_suggestions).map(([area, suggestion]) => (
                                            <div key={area} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="mt-0.5">
                                                    <FileText className="w-4 h-4 text-brand" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800 capitalize">
                                                        {area.replace(/_/g, ' ')}
                                                    </h4>
                                                    <p className="text-sm text-gray-700">{suggestion}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h3 className="font-medium text-gray-900">General Resume Tips</h3>
                                    <ul className="space-y-3 text-sm text-gray-700 list-disc pl-5">
                                        <li>Tailor your resume for each job application</li>
                                        <li>Use action verbs to describe your achievements</li>
                                        <li>Keep it concise (1-2 pages maximum)</li>
                                        <li>Include quantifiable results where possible</li>
                                    </ul>
                                </div>

                                <div className="flex justify-end">
                                    <Button className={`bg-brand text-white hover:bg-brand/90  mt-4`}>
                                        Save Recommendations
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!analysis && !showHistory && (
                    <Alert className="mt-6 bg-blue-50 border-blue-200">
                        <GraduationCap className="w-4 h-4 text-brand" />
                        <AlertTitle className="">Why Resume Quality Matters</AlertTitle>
                        <AlertDescription className="text-brand/90">
                            Recruiters typically spend just 7-10 seconds reviewing a resume. A well-structured resume that
                            highlights your most relevant qualifications increases your chances of getting noticed.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}

export default ResumeAdvisorPage