"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Briefcase, User } from 'lucide-react';
import { toast } from 'sonner';
import useUser from '@/src/hooks/useUser';
import baseUrl from '../../api/baseUrl';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);
  const { data: session, update: updateSession } = useSession(); // Added update function
  const router = useRouter();
  const { user, mutateUser, loading: userLoading } = useUser();

  // Navigation prevention (unchanged)
  useEffect(() => {
    if (!roleSelected) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You cannot go back after selecting a role';
      return e.returnValue;
    };

    const handlePopState = (e) => {
      if (roleSelected) {
        toast.info("You cannot go back after selecting a role");
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.history.replaceState(null, '', window.location.pathname);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roleSelected]);

  // Redirect if user already has a role
  useEffect(() => {
    if (!userLoading && user?.role && user.role !== 'none') {
      router.replace('/');
    }
  }, [user, userLoading, router]);

  const handleRoleSelect = async (role) => {
    if (!['recruiter', 'job_seeker'].includes(role)) {
      toast.error('Invalid role selection');
      return;
    }

    setLoading(true);
    try {
      // Optimistically update local state immediately
      setRoleSelected(true);
      await mutateUser(
        { ...user, role }, 
        { revalidate: false } // Don't revalidate yet
      );

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

      // Update both user data and session
      await Promise.all([
        mutateUser({ ...user, role: response.data.state }, { revalidate: true }),
        updateSession({ ...session, user: { ...session?.user, role: response.data.state } })
      ]);

      toast.success(response.data.message || 'Account type updated successfully');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (role === 'recruiter') {
        router.push('/companies/create');
      } else {
        router.push('/applicant/upload-resume');
      }

    } catch (error) {
      console.error('Role selection error:', error);
      
      // Revert all states if error occurs
      await Promise.all([
        mutateUser({ ...user, role: 'none' }, { revalidate: true }),
        updateSession({ ...session, user: { ...session?.user, role: 'none' } })
      ]);
      
      setRoleSelected(false);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update account type'
      );
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || (user?.role && user.role !== 'none')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // ... rest of your JSX remains the same
}