'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Camera, Clock, CheckCircle, AlertCircle, ChevronRight, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const AssessmentFlow = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const jobId = params?.id;
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [step, setStep] = useState('intro');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  // Fetch assessment questions
  useEffect(() => {
    if (!jobId) {
      toast.error('Invalid job ID');
      router.push('/jobs');
      return;
    }

    const fetchAssessment = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/job/${jobId}/questions/`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          }
        });
        setAssessment(response.data);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        toast.error('Failed to load assessment');
        router.push(`/jobs/${jobId}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) fetchAssessment();
  }, [session, jobId, router]);

  // Timer logic
  useEffect(() => {
    if (step === 'assessment' && !submitted && assessment) {
      const totalTime = assessment?.total_time || 30 * 60;
      setTimeLeft(totalTime);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [step, submitted, assessment]);

  // Desktop camera setup
  useEffect(() => {
    if (isDesktop && step === 'assessment') {
      const enableCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: false
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Camera error:', err);
        }
      };
      
      enableCamera();
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isDesktop, step]);

  // Flatten questions
  const allQuestions = assessment?.questions_by_skill
    ? Object.entries(assessment.questions_by_skill).flatMap(([skill, questions]) => 
        questions.map(q => ({ ...q, skill })))
    : [];

  const totalQuestions = allQuestions.length;
  const totalTime = assessment?.total_time || 30 * 60;

  const handleStart = () => {
    setStep('assessment');
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < totalQuestions) {
      toast.error('Please answer all questions');
      return;
    }

    try {
      await axios.post(`/api/job/${jobId}/report-test/`, { answers }, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      });
      
      setSubmitted(true);
      setStep('results');
      toast.success('Assessment submitted!');
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Failed to submit');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Assessment Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not load assessment questions.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => router.push(`/jobs/${jobId}`)}
              className="bg-brand hover:bg-brand/90 text-white"
            >
              Return to Job
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating desktop camera */}
      {isDesktop && step === 'assessment' && (
        <div className="fixed bottom-6 right-6 w-64 h-48 rounded-lg overflow-hidden shadow-lg border border-gray-100 z-50">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover bg-black"
          />
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Intro Step */}
        {step === 'intro' && (
          <Card className="mx-auto max-w-3xl">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-brand/10 text-brand border-brand/20">
                  Assessment
                </Badge>
                <span className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {Math.floor(totalTime / 60)} min
                </span>
              </div>
              <CardTitle className="text-3xl font-bold">
                {assessment.job_title} Assessment
              </CardTitle>
              <CardDescription>
                Complete this assessment to evaluate your skills for the position
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-100">
                <AlertCircle className="text-blue-500" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  {isDesktop 
                    ? 'Your camera will be monitored during this assessment' 
                    : 'Please complete all questions before submitting'}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-medium">Instructions:</h3>
                <ul className="space-y-2 pl-5 list-disc text-sm">
                  <li>{totalQuestions} questions in {Math.floor(totalTime / 60)} minutes</li>
                  <li>Answer all questions before time expires</li>
                  <li>Don't refresh or navigate away</li>
                  {isDesktop && <li>Camera required for proctoring</li>}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleStart}
                className="bg-brand hover:bg-brand/90 text-white"
              >
                Start Assessment <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Assessment Step */}
        {step === 'assessment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
              <div>
                <h1 className="text-xl font-bold">{assessment.job_title}</h1>
                <p className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {totalQuestions}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50">
                <Clock className="text-brand h-4 w-4" />
                <span className="font-medium">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            <Progress 
              value={((currentQuestion + 1) / totalQuestions) * 100} 
              className="h-2 bg-gray-100"
              indicatorClassName="bg-brand"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Questions sidebar - desktop */}
              {isDesktop && (
                <div className="lg:col-span-1">
                  <Card className="sticky top-4 overflow-hidden">
                    <CardHeader className="p-4 border-b">
                      <CardTitle className="text-lg">Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        {Object.entries(assessment.questions_by_skill).map(([skill, questions]) => (
                          <div key={skill} className="space-y-1">
                            <div className="px-4 py-2 text-sm font-medium border-b bg-gray-50">
                              {skill}
                            </div>
                            <div className="space-y-1 px-2 py-2">
                              {questions.map((q, i) => {
                                const globalIndex = allQuestions.findIndex(item => item.id === q.id);
                                return (
                                  <Button
                                    key={q.id}
                                    variant="ghost"
                                    onClick={() => setCurrentQuestion(globalIndex)}
                                    className={`w-full justify-start ${currentQuestion === globalIndex ? 'bg-brand/10 text-brand' : ''}`}
                                  >
                                    {answers[q.id] ? (
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    ) : (
                                      <span className="w-4 h-4 mr-2 text-gray-400">{i + 1}.</span>
                                    )}
                                    <span className="truncate">Q{globalIndex + 1}</span>
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Main question content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Badge className="bg-brand/10 text-brand">
                        {allQuestions[currentQuestion]?.skill}
                      </Badge>
                      <h3 className="text-xl font-medium">
                        {allQuestions[currentQuestion]?.question}
                      </h3>
                    </div>

                    <Separator />

                    <RadioGroup
                      value={answers[allQuestions[currentQuestion]?.id] || ''}
                      onValueChange={(value) => 
                        handleAnswerSelect(allQuestions[currentQuestion]?.id, value)
                      }
                      className="space-y-3"
                    >
                      {allQuestions[currentQuestion]?.options?.map((option, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option}
                            id={`option-${i}`}
                            className="text-brand border-gray-300"
                          />
                          <Label htmlFor={`option-${i}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>

                  <CardFooter className="flex justify-between px-6 pb-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
                      disabled={currentQuestion === 0}
                      className="border-brand text-brand hover:bg-brand/10"
                    >
                      Previous
                    </Button>
                    
                    {currentQuestion < totalQuestions - 1 ? (
                      <Button
                        onClick={() => setCurrentQuestion(p => p + 1)}
                        className="bg-brand hover:bg-brand/90 text-white"
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        className="bg-brand hover:bg-brand/90 text-white"
                      >
                        Submit Assessment
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && (
          <Card className="mx-auto max-w-3xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Assessment Completed!</CardTitle>
              <CardDescription>
                You answered {Object.keys(answers).length} of {totalQuestions} questions
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <div className="mx-auto max-w-xs">
                <Progress 
                  value={(Object.keys(answers).length / totalQuestions) * 100} 
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-brand"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {Math.round((Object.keys(answers).length / totalQuestions) * 100)}% complete
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(assessment.questions_by_skill).map(([skill, questions]) => (
                  <Card key={skill} className="text-left">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium">{skill}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-500">
                        {questions.filter(q => answers[q.id]).length}/{questions.length} answered
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('intro')}
                className="border-brand text-brand hover:bg-brand/10"
              >
                <RotateCw className="mr-2 h-4 w-4" /> Retake
              </Button>
              <Button
                onClick={() => router.push(`/jobs/${jobId}`)}
                className="bg-brand hover:bg-brand/90 text-white"
              >
                Return to Job
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AssessmentFlow;