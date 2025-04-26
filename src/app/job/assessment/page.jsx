'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Clock, CheckCircle, AlertCircle, ChevronRight, RotateCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const AssessmentFlow = () => {
  const router = useRouter();
  const [step, setStep] = useState('intro');
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Mock assessment data
  const assessment = {
    title: "Technical Skills Evaluation",
    duration: 30, // minutes
    skills: [
      {
        name: "JavaScript",
        questions: [
          {
            id: 1,
            text: "What is the output of '2' + 2 in JavaScript?",
            options: ["22", "4", "NaN", "TypeError"]
          },
          {
            id: 2,
            text: "Which method creates a new array with all sub-array elements concatenated?",
            options: ["join()", "concat()", "flat()", "merge()"]
          }
        ]
      },
      {
        name: "React",
        questions: [
          {
            id: 3,
            text: "What hook should you use for side effects?",
            options: ["useState", "useEffect", "useContext", "useReducer"]
          },
          {
            id: 4,
            text: "How do you pass data to a child component?",
            options: ["Using state", "Via props", "With context", "All of the above"]
          }
        ]
      }
    ]
  };

  // Calculate total questions and time per question
  const totalQuestions = assessment.skills.reduce((acc, skill) => acc + skill.questions.length, 0);
  const totalTime = assessment.duration * 60; // Convert to seconds

  // Initialize timer
  useEffect(() => {
    if (step === 'assessment' && !submitted) {
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
  }, [step, submitted]);

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraAllowed(true);
    } catch (err) {
      alert('Camera access is required to continue with the assessment');
    }
  };

  const handleStartAssessment = () => {
    if (cameraAllowed) {
      setStep('assessment');
    } else {
      alert('Please allow camera access to continue');
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === totalQuestions || confirm('You have unanswered questions. Submit anyway?')) {
      setSubmitted(true);
      setStep('results');
    }
  };

  // Flatten all questions for easier navigation
  const allQuestions = assessment.skills.flatMap(skill => skill.questions);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background">
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        {step === 'intro' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  Assessment
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {assessment.duration} min
                </span>
              </div>
              <CardTitle className="text-2xl font-bold">{assessment.title}</CardTitle>
              <CardDescription>
                Complete this assessment to evaluate your technical skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This assessment requires camera access for proctoring. Please ensure you're in a well-lit environment.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-medium">Instructions:</h3>
                <ul className="space-y-2 list-disc pl-5 text-sm">
                  <li>You'll have {assessment.duration} minutes to complete {totalQuestions} questions</li>
                  <li>Each skill category contains multiple questions</li>
                  <li>Answer all questions before time expires</li>
                  <li>Camera will be monitored during the assessment</li>
                  <li>Don't refresh or navigate away during the test</li>
                </ul>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="camera-access" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Camera Access
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Required for assessment proctoring
                  </p>
                </div>
                {cameraAllowed ? (
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" /> Allowed
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleCameraAccess}>
                    Allow Access
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className={`bg-brand text-white hover:bg-brand/70 hover:text-white`} onClick={handleStartAssessment} disabled={!cameraAllowed}>
                Start Assessment <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'assessment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{assessment.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {totalQuestions}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            <Progress 
              value={((currentQuestion + 1) / totalQuestions) * 100} 
              className="h-2 bg-muted"
              indicatorClassName="bg-brand"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {assessment.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="space-y-1">
                          <div className="px-4 py-2 text-sm font-medium border-b">
                            {skill.name}
                          </div>
                          <div className="space-y-1 px-2">
                            {skill.questions.map((q, qIndex) => {
                              const globalIndex = assessment.skills
                                .slice(0, skillIndex)
                                .reduce((acc, s) => acc + s.questions.length, 0) + qIndex;
                              return (
                                <Button
                                  key={q.id}
                                  variant={currentQuestion === globalIndex ? 'secondary' : 'ghost'}
                                  className="w-full justify-start"
                                  onClick={() => setCurrentQuestion(globalIndex)}
                                >
                                  {answers[q.id] ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  ) : (
                                    <span className="h-4 w-4 mr-2 text-muted-foreground">{qIndex + 1}.</span>
                                  )}
                                  Question {globalIndex + 1}
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

              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Badge variant="outline">
                        {allQuestions[currentQuestion].id}. Question
                      </Badge>
                      <h3 className="text-lg font-medium">{allQuestions[currentQuestion].text}</h3>
                    </div>

                    <Separator />

                    <RadioGroup
                      value={answers[allQuestions[currentQuestion].id] || ''}
                      onValueChange={(value) => handleAnswerSelect(allQuestions[currentQuestion].id, value)}
                      className="space-y-3"
                    >
                      {allQuestions[currentQuestion].options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option}
                            id={`q${allQuestions[currentQuestion].id}-opt${i}`}
                          />
                          <Label htmlFor={`q${allQuestions[currentQuestion].id}-opt${i}`} className="font-normal">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className="flex justify-between px-6 pb-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    {currentQuestion < totalQuestions - 1 ? (
                      <Button className={`bg-brand text-white hover:bg-brand/70 hover:text-white`} onClick={handleNextQuestion}>
                        Next <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button className={`bg-brand text-white hover:bg-brand/70 hover:text-white`} onClick={handleSubmit}>
                        Submit Assessment
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <CheckCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">Assessment Completed!</CardTitle>
              <CardDescription>
                You scored {Object.keys(answers).length} out of {totalQuestions} questions correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="mx-auto max-w-xs">
                <Progress 
                  value={(Object.keys(answers).length / totalQuestions) * 100} 
                  className="h-2 bg-muted"
                  indicatorClassName="bg-brand"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  {Math.round((Object.keys(answers).length / totalQuestions) * 100)}% Success Rate
                </p>
              </div>
              
              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessment.skills.map(skill => (
                  <div key={skill.name} className="border rounded-lg p-4 text-left">
                    <h3 className="font-medium">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {skill.questions.filter(q => answers[q.id]).length}/{skill.questions.length} correct
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" onClick={() => setStep('intro')}>
                <RotateCw className="h-4 w-4 mr-2" /> Retake Assessment
              </Button>
              <Button className={`bg-brand text-white hover:bg-brand/70 hover:text-white`} onClick={() => router.push('/dashboard')}>
                <Home className="h-4 w-4 mr-2 " /> Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AssessmentFlow;