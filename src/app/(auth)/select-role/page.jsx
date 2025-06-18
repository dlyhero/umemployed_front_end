"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Briefcase, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleRoleSelect = async (role) => {
    setLoading(true);
    setIsProcessing(true);
    try {
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
        credentials: 'same-origin'
      });
  
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update role');
      }
  
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          role: role
        }
      });

      // Add a small delay to ensure session is updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSelectedRole(''); // Reset the selection
      
    } catch (error) {
      console.error('Full error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handleRoleChange = (role) => {
    console.log('Role selected:', role); // Debug log
    setSelectedRole(role);
    setIsRoleLoading(true);
    
    // Simulate a delay to show loading state
    setTimeout(() => {
      setIsRoleLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (session?.user?.role && session.user.role !== "none") {
      if (session.user.role === "job_seeker") {
        router.push(session.user.has_resume ? "/applicant/dashboard" : "/applicant/upload-resume");
      } else {
        router.push(session.user.has_company ? `/companies/${session.user.company_id}/dashboard` : "/companies/create");
      }
    }
  }, [session, router]);

  const roles = [
    { 
      id: 'job_seeker', 
      label: "I'm a Job Seeker", 
      description: "Looking for work opportunities and want to showcase my skills to potential Recruiters.",
      icon: <User className="h-5 w-5" />,
      benefits: [
        "Find work opportunities",
        "Build your professional profile",
        "Get paid for your skills"
      ]
    },
    { 
      id: 'recruiter', 
      label: "I'm a Recruiter", 
      description: "Looking to hire professionals for projects and grow my business with top talent.",
      icon: <Briefcase className="h-5 w-5" />,
      benefits: [
        "Find skilled professionals",
        "Manage projects and payments",
        "Build your dream team"
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[#0d141c] text-3xl font-bold  text-center sm:text-4xl mb-8">
          Join as a Recruiter <br className='sm:hidden'/> or Job Seeker
        </h1>
        <p className="text-gray-600 text-center mb-10  mx-auto text-lg">
         This will help us tailor your experience and connect you with the right opportunities.
        </p>

        <RadioGroup 
          value={selectedRole} 
          onValueChange={handleRoleChange}
          className="space-y-4 px-4 sm:flex gap-2 mx-auto"
          disabled={isRoleLoading || isProcessing}
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: isRoleLoading || isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isRoleLoading || isProcessing ? 1 : 0.98 }}
              className="flex-1"
            >
              <Label
                htmlFor={role.id}
                className={`flex flex-col h-full p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRole === role.id
                    ? 'border-brand bg-brand/5'
                    : 'border-[#cedae8] hover:border-blue-200'
                } ${(isRoleLoading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center mb-4">
                  <RadioGroupItem 
                    value={role.id} 
                    id={role.id} 
                    className="h-6 w-6 border-2 border-bg-blue-50 data-[state=checked]:border-brand mr-4"
                    disabled={isRoleLoading || isProcessing}
                  />
                  <div className="flex items-center">
                    <span className="text-gray-700 text-xl font-semibold">{role.label}</span>
                    {isRoleLoading && selectedRole === role.id && (
                      <div className="ml-2 flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-brand" />
                        <span className="ml-2 text-sm text-brand">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-[18px] mb-4 ml-10">
                  {role.description}
                </p>
              </Label>
            </motion.div>
          ))}
        </RadioGroup>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedRole && !isRoleLoading ? 1 : 0.5 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            disabled={!selectedRole || loading || isProcessing || isRoleLoading}
            className={`px-8 py-6 text-lg font-semibold hover:bg-brand/90 ${selectedRole && !isRoleLoading ? 'bg-brand' : 'bg-gray-200'}`}
            onClick={() => handleRoleSelect(selectedRole)}
          >
            {loading || isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                Continue 
              </>
            )}
          </Button>
        </motion.div>

        <div className="text-center text-gray-600 font-semibold text-sm mt-8">
          <p>You can not change your account type later in settings</p>
        </div>
      </motion.div>
    </div>
  );
}