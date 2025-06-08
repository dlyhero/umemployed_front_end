// src/app/(auth)/select-role/page.jsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Briefcase, User } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const router = useRouter();
  const { data: session, update, status } = useSession();

  const handleRoleSelect = async (role) => {
    setLoading(true);
    console.log('[SelectRole] Starting role selection:', { role, sessionStatus: status });
    try {
      console.log('[SelectRole] Sending request to /api/auth/update-role');
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
        credentials: 'same-origin',
      });

      const data = await response.json();
      console.log('[SelectRole] API response:', { status: response.status, data });

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update role');
      }

      console.log('[SelectRole] Updating session with role:', role);
      const updatedSession = await update({
        ...session,
        user: {
          ...session?.user,
          role,
        },
      });
      console.log('[SelectRole] Session update result:', updatedSession);

      // Force session refresh
      console.log('[SelectRole] Forcing session refresh');
      await fetch('/api/auth/session', { cache: 'no-store' });
      const sessionResponse = await fetch('/api/auth/session', { cache: 'no-store' });
      const sessionData = await sessionResponse.json();
      console.log('[SelectRole] Refreshed session:', sessionData);

      if (data.redirectTo) {
        console.log('[SelectRole] Redirecting to:', data.redirectTo);
        window.location.href = data.redirectTo; // Use window.location.href for reliability
      } else {
        console.log('[SelectRole] No redirectTo provided, reloading page');
        window.location.reload();
      }
    } catch (error) {
      console.error('[SelectRole] Error:', {
        message: error.message,
        stack: error.stack,
        sessionStatus: status,
      });
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      console.log('[SelectRole] Role selection completed, loading:', loading);
    }
  };

  useEffect(() => {
    console.log('[SelectRole] useEffect triggered:', {
      sessionStatus: status,
      userRole: session?.user?.role,
      hasResume: session?.user?.has_resume,
      hasCompany: session?.user?.has_company,
      companyId: session?.user?.company_id,
    });
    if (status === 'loading') return;
    if (session?.user?.role && session.user.role !== 'none') {
      if (session.user.role === 'job_seeker') {
        const redirectPath = session.user.has_resume
          ? '/applicant/dashboard'
          : '/applicant/upload-resume';
        console.log('[SelectRole] Redirecting job_seeker to:', redirectPath);
        window.location.href = redirectPath; // Use window.location.href
      } else {
        const redirectPath = session.user.has_company
          ? `/companies/${session.user.company_id}/dashboard`
          : '/companies/create';
        console.log('[SelectRole] Redirecting recruiter to:', redirectPath);
        window.location.href = redirectPath; // Use window.location.href
      }
    }
  }, [session, status]);

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
          onValueChange={setSelectedRole}
          className="space-y-4 px-4 sm:flex gap-2 mx-auto"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Label
                htmlFor={role.id}
                className={`flex flex-col h-full p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRole === role.id
                    ? 'border-brand bg-brand/5'
                    : 'border-[#cedae8] hover:border-blue-200'
                }`}
              >
                <div className="flex items-center mb-4">
                  <RadioGroupItem 
                    value={role.id} 
                    id={role.id} 
                    className="h-6 w-6 border-2 border-bg-blue-50 data-[state=checked]:border-brand mr-4"
                  />
                  <div className="flex items-center">
                    <span className="text-gray-700 text-xl font-semibold">{role.label}</span>
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
          animate={{ opacity: selectedRole ? 1 : 0.5 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            disabled={!selectedRole || loading}
            className={`px-8 py-6 text-lg font-semibold hover:bg-brand/90 ${selectedRole ? 'bg-brand' : 'bg-gray-200'}`}
            onClick={() => handleRoleSelect(selectedRole)}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-5 w-5" />
                <span>Loading...</span>
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