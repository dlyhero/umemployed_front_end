'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, CheckCircle, AlertCircle, ChevronRight, RotateCw, Monitor, Video, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import baseUrl from '@/src/app/api/baseUrl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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
  const [showCamera, setShowCamera] = useState(false);
  const [skillIdMap, setSkillIdMap] = useState({});
  const [timerInterval, setTimerInterval] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

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
        const response = await axios.get(`${baseUrl}/job/${jobId}/questions/`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          }
        });
        setAssessment(response.data);
        
        // Create skill ID mapping
        const skillIds = {};
        Object.entries(response.data.questions_by_skill).forEach(([skill, questions]) => {
          questions.forEach(q => {
            skillIds[q.id] = skill;
          });
        });
        setSkillIdMap(skillIds);
      } catch (err) {
        console.error('Error fetching assessment:', err.response?.data);
        if (err.response?.data?.message === "No active user subscription found.") {
          setShowSubscriptionModal(true);
        } 
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
      
      setTimerInterval(timer);
      return () => clearInterval(timer);
    }
  }, [step, submitted, assessment]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Desktop camera setup
  useEffect(() => {
    if (isDesktop && step === 'assessment' && showCamera) {
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
          toast.error('Could not access camera');
          setShowCamera(false);
        }
      };
      
      enableCamera();
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isDesktop, step, showCamera]);

  // Flatten questions
  const allQuestions = assessment?.questions_by_skill
    ? Object.entries(assessment.questions_by_skill).flatMap(([skill, questions]) => 
        questions.map(q => ({ ...q, skill })))
    : [];

  const totalQuestions = allQuestions.length;
  const totalTime = assessment?.total_time || 30 * 60;

  const handleStart = () => {
    if (!isDesktop) {
      toast.info('For best experience, please take this assessment on a desktop computer', {
        duration: 8000,
        icon: <Monitor className="w-5 h-5" />,
        action: {
          label: 'Continue Anyway',
          onClick: () => setStep('assessment')
        }
      });
    } else {
      setStep('assessment');
      setShowCamera(true);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const formatAnswersForSubmission = () => {
    return allQuestions.map(question => ({
      question_id: question.id,
      answer: answers[question.id] || null,
      skill_id: question.skill_id || null
    }));
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        responses: formatAnswersForSubmission()
      };

      await axios.post(`${baseUrl}/job/${jobId}/questions/`, submissionData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      });
      
      setSubmitted(true);
      setStep('results');
      if (timerInterval) clearInterval(timerInterval);
      toast.success('Assessment submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      if (err.response?.data?.message === "No active user subscription found.") {
        setShowSubscriptionModal(true);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand" />
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {/* Subscription Modal - non-removable */}
        <Dialog open={showSubscriptionModal} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Upgrade Required</DialogTitle>
              <DialogDescription className="text-center">
                You've reached the application limit for free users
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <AlertCircle className="h-12 w-12 text-yellow-500" />
                <p className="text-gray-700">
                  To apply for more jobs and access premium features, please upgrade your account.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-center">Premium Benefits:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited job applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Priority application review
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Direct recruiter messaging
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button 
                onClick={() => router.push('/subscription')}
                className="flex-1 bg-brand hover:bg-brand/90 text-white"
              >
                View Subscription Plans
              </Button>
              <Button 
                variant="outline"   
                onClick={() => router.back()}
                className="flex-1"
              >
                Go Back
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Subscription Modal - non-removable */}
      <Dialog open={showSubscriptionModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Upgrade Required</DialogTitle>
            <DialogDescription className="text-center">
              You've reached the application limit for free users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <AlertCircle className="h-12 w-12 text-yellow-500" />
              <p className="text-gray-700">
                To apply for more jobs and access premium features, please upgrade your account.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-center">Premium Benefits:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Unlimited job applications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Priority application review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Direct recruiter messaging
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              onClick={() => router.push('/subscription')}
              className="w-full bg-brand hover:bg-brand/90"
            >
              View Subscription Plans
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full"
            >
              Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating desktop camera */}
      {isDesktop && showCamera && step === 'assessment' && (
        <div className="fixed bottom-6 right-6 w-64 h-48 rounded-lg overflow-hidden border border-gray-200 z-50 bg-black">
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <Video className="w-3 h-3" />
            <span>Recording</span>
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Rest of your existing component code remains the same */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Intro Step */}
        {step === 'intro' && (
          <div className="flex justify-center">
            <Card className="max-w-3xl w-full border-0 ">
              <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center gap-3">
                  <Badge className="bg-brand/10 text-brand border-brand/20 rounded-full px-3 py-1">
                    Skills Assessment
                  </Badge>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.floor(totalTime / 60)} min
                  </span>
                </div>
                <CardTitle className="text-3xl font-bold">
                  {assessment.job_title} Assessment
                </CardTitle>
                <CardDescription className="text-lg">
                  Demonstrate your skills for this position
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-100 rounded-lg">
                  <AlertCircle className="text-blue-500" />
                  <AlertTitle>Important Information</AlertTitle>
                  <AlertDescription>
                    {isDesktop 
                      ? 'This assessment will be recorded for verification purposes.' 
                      : 'For best experience, we recommend taking this assessment on a desktop computer.'}
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Assessment Details:</h3>
                  <ul className="space-y-3 pl-5">
                    <li className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand/10 text-brand mt-0.5">
                        {totalQuestions}
                      </div>
                      <span className="text-gray-700">Multiple-choice questions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand/10 text-brand mt-0.5">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700">{Math.floor(totalTime / 60)} minute time limit</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand/10 text-brand mt-0.5">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700">Submit anytime or when time elapses</span>
                    </li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button 
                  onClick={handleStart}
                  className="bg-brand hover:bg-brand/90 text-white px-8 py-6"
                >
                  Begin Assessment <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Assessment Step */}
        {step === 'assessment' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assessment.job_title}</h1>
                <p className="text-gray-500 mt-1">
                  {Object.keys(answers).length} of {totalQuestions} answered
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCamera(!showCamera)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
                >
                  <Video className="h-4 w-4 mr-2" />
                  {showCamera ? 'Hide Camera' : 'Show Camera'}
                </Button>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
                  <Clock className="text-brand h-5 w-5" />
                  <span className="font-medium text-gray-700">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Questions sidebar - desktop */}
              {isDesktop && (
                <div className="lg:col-span-1">
                  <Card className="sticky top-8 overflow-hidden border-0 shadow-sm">
                    <CardHeader className="p-6 pb-4 border-b">
                      <CardTitle className="text-lg">Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
                        {allQuestions.map((q, index) => (
                          <Button
                            key={q.id}
                            variant="ghost"
                            onClick={() => setCurrentQuestion(index)}
                            className={`w-full justify-start px-4 py-3 rounded-none ${currentQuestion === index ? 'bg-brand/10 text-brand' : ''}`}
                          >
                            {answers[q.id] ? (
                              <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                            ) : (
                              <div className={`h-4 w-4 mr-3 rounded-full border ${currentQuestion === index ? 'border-brand' : 'border-gray-300'}`} />
                            )}
                            <span className="truncate">
                              Question {index + 1}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Main question content */}
              <div className="lg:col-span-3">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <Badge className="bg-brand/10 text-brand px-3 py-1 rounded-full">
                        {allQuestions[currentQuestion]?.skill}
                      </Badge>
                      <h3 className="text-2xl font-medium text-gray-900">
                        Question {currentQuestion + 1} of {totalQuestions}
                      </h3>
                      <p className="text-lg">
                        {allQuestions[currentQuestion]?.question}
                      </p>
                    </div>

                    <Separator className="bg-gray-100" />

                    <RadioGroup
                      value={answers[allQuestions[currentQuestion]?.id] || ''}
                      onValueChange={(value) => 
                        handleAnswerSelect(allQuestions[currentQuestion]?.id, value)
                      }
                      className="space-y-4"
                    >
                      {allQuestions[currentQuestion]?.options?.map((option, i) => (
                        <div 
                          key={i} 
                          className={`flex items-center space-x-4 p-4 rounded-lg border ${answers[allQuestions[currentQuestion]?.id] === option ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <RadioGroupItem
                            value={option}
                            id={`option-${i}`}
                            className="h-5 w-5 text-brand border-gray-300"
                          />
                          <Label htmlFor={`option-${i}`} className="cursor-pointer text-gray-800">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>

                  <CardFooter className="flex justify-between px-8 pb-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
                      disabled={currentQuestion === 0}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-3">
                      {currentQuestion < totalQuestions - 1 ? (
                        <Button
                          onClick={handleNextQuestion}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3"
                        >
                          Next
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                      ) : null}
                      
                      <Button
                        onClick={handleSubmit}
                        className="bg-brand hover:bg-brand/90 text-white px-6 py-3"
                      >
                        {currentQuestion < totalQuestions - 1 ? 'Submit Now' : 'Submit Assessment'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && (
          <div className="flex justify-center">
            <Card className="max-w-3xl w-full border-0 shadow-sm">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-3xl">Assessment Submitted!</CardTitle>
                <CardDescription className="text-lg">
                  Thank you for completing the assessment
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 text-center">
                <div className="mx-auto max-w-md">
                  <Progress 
                    value={(Object.keys(answers).length / totalQuestions) * 100} 
                    className="h-2 bg-gray-100"
                    indicatorClassName="bg-brand"
                  />
                  <p className="mt-3 text-gray-600">
                    You answered {Object.keys(answers).length} of {totalQuestions} questions
                  </p>
                </div>

                <Separator className="bg-gray-100" />

                <Alert className="bg-blue-50 border-blue-100 rounded-lg text-left">
                  <AlertCircle className="text-blue-500" />
                  <AlertTitle>What Happens Next?</AlertTitle>
                  <AlertDescription>
                    Your responses have been recorded. The hiring team will review your assessment and contact you if they'd like to move forward.
                  </AlertDescription>
                </Alert>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => router.push('/jobs')}
                  className="bg-brand hover:bg-brand/90 text-white px-6 py-3"
                >
                  Browse Other Jobs
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssessmentFlow;