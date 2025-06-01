"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Briefcase, User } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleRoleSelect = async (role) => {
    setLoading(true);
    try {
      // Include credentials in the fetch request
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
        credentials: 'include' // This is crucial for session cookies
      });

      // Handle non-JSON responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update role');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update role');
      }

      // Update client-side session
      await update({
        user: {
          ...session?.user,
          role: role
        }
      });

      // Redirect after successful update
      router.push(data.redirectTo);

    } catch (error) {
      console.error('Role selection error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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

  // If session is loading or user already has a role
  if (!session ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg border shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Select Your Account Type</h1>
          <p className="mt-2 text-gray-600">
            Choose how you want to use our platform
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            onClick={() => handleRoleSelect('job_seeker')}
            disabled={loading}
            className="h-24 flex flex-col items-center justify-center gap-2 p-4 hover:bg-blue-50 transition-colors"
          >
            <User className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-medium">Job Seeker</span>
            <p className="text-sm text-gray-500">
              Looking for job opportunities
            </p>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleRoleSelect('recruiter')}
            disabled={loading}
            className="h-24 flex flex-col items-center justify-center gap-2 p-4 hover:bg-green-50 transition-colors"
          >
            <Briefcase className="h-8 w-8 text-green-600" />
            <span className="text-lg font-medium">Recruiter</span>
            <p className="text-sm text-gray-500">
              Looking to hire candidates
            </p>
          </Button>
        </div>

        {loading && (
          <div className="text-center text-gray-500">
            <p>Updating your account type...</p>
          </div>
        )}
      </div>
    </div>
  );
}