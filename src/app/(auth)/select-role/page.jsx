"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Briefcase, User } from 'lucide-react';
import { toast } from 'sonner';
import useUser from '@/src/hooks/useUser';
import baseUrl from '../../api/baseUrl';
import { useSession } from 'next-auth/react';

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const {data: session} = useSession();
  const router = useRouter();
  const { user, mutateUser, loading: userLoading, refetch } = useUser();

  // Redirect if user already has a role
  if (!userLoading && user?.role && user.role !== 'none') {
    router.replace('/');
    return null;
  }

  const handleRoleSelect = async (role) => {
    if (!['recruiter', 'job_seeker'].includes(role)) {
      toast.error('Invalid role selection');
      return;
    }

    setLoading(true);
    try {
      // Update role via API
      const response = await axios.post(
        `${baseUrl}/users/choose-account-type/`,
        { account_type: role },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
      
      // Instead of optimistically updating, refetch the user data completely
      await refetch();
      
      // Double-check that the role was actually updated by comparing with API response
      if (response.data?.role === role || response.data?.account_type === role) {
        // Redirect based on selected role
        if (role === 'recruiter') {
          router.push('/company/create');
        } else {
          router.push('/applicant/upload-resume');
        }
        
        toast.success('Account type updated successfully');
      } else {
        // If API response doesn't contain updated role, show an error
        toast.error('Role was not updated correctly');
      }
    } catch (error) {
      console.error('Role selection error:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update account type'
      );
      
      // Ensure user data is consistent with backend
      await refetch();
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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