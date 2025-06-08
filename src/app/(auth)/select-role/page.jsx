"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Briefcase, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleRoleSelect = async (role) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update role');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update role');
      }

      await update({
        user: {
          ...session?.user,
          role: role
        }
      });

      router.push(data.redirectTo);

    } catch (error) {
      console.error('Role selection error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (session?.user?.role && session.user.role !== "none") {
  //     if (session.user.role === "job_seeker") {
  //       router.push(session.user.has_resume ? "/applicant/dashboard" : "/applicant/upload-resume");
  //     } else {
  //       router.push(session.user.has_company ? `/companies/${session.user.company_id}/dashboard` : "/companies/create");
  //     }
  //   }
  // }, [session, router]);

  return (
    <div className="max-w-5xl mx-auto  mt-5 px-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a <br className='md:hidden' /> Recruiter or Job Seeker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your account type to get started. You can always switch later.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${selectedRole === 'job_seeker' ? 'border-brand bg-blue-50' : 'border-gray-200 hover:border-brand'}`}
            onClick={() => setSelectedRole('job_seeker')}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <User className="h-6 w-6 text-brand" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">I'm a Job Seeker</h2>
              </div>
              <p className="text-gray-600 mb-6 flex-grow px-3">
                Looking for work opportunities and want to showcase my skills to potential Recruiters.
              </p>
              <ul className="space-y-2 mb-6 list-decimal px-8">
                <li className=" text-gray-600">
      
                  Find work opportunities
                </li>
                <li className=" text-gray-600">
                 
                  Build your professional profile
                </li>
                <li className=" text-gray-600">
                 
                  Get paid for your skills
                </li>
              </ul>
              <Button
                variant={selectedRole === 'job_seeker' ? 'brand' : 'outline'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('job_seeker');
                }}
                disabled={loading || selectedRole !== 'job_seeker'}
                className="w-full mt-auto"
              >
                {loading && selectedRole === 'job_seeker' ? (
                  <Spinner className="mr-2" />
                ) : (
                  <>
                    Continue as Job Seeker <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div 
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${selectedRole === 'recruiter' ? 'border-brand bg-blue-50' : 'border-gray-200 hover:border-brand/50'}`}
            onClick={() => setSelectedRole('recruiter')}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <Briefcase className="h-6 w-6 text-brand" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">I'm a Recruiter</h2>
              </div>
              <p className="text-gray-600 mb-6 flex-grow px-3">
                Looking to hire professionals for projects and grow my business with top talent.
              </p>
              <ul className="space-y-2 mb-6 list-decimal px-7">
                <li className=" text-gray-600">
                  
                  Find skilled professionals
                </li>
                <li className=" text-gray-600">
                  
                  Manage projects and payments
                </li>
                <li className=" text-gray-600">
                  
                  Build your dream team
                </li>
              </ul>
              <Button
                variant={selectedRole === 'recruiter' ? 'brand' : 'outline'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('recruiter');
                }}
                disabled={loading || selectedRole !== 'recruiter'}
                className="w-full mt-auto"
              >
                {loading && selectedRole === 'recruiter' ? (
                  <Spinner className="mr-2" />
                ) : (
                  <>
                    Continue as Recruiter <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>You can not change your account type later in settings</p>
        </div>
      </div>
    </div>
  );
}