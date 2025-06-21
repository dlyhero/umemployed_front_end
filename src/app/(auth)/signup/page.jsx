"use client";
import { Button } from "@/components/ui/button";
import { Google } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';
import { SignUpForm } from './Form';
import { UilGoogle, UilGithub } from '@iconscout/react-unicons';
import Footer from '@/src/components/common/Footer/Footer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GoogleAuth from '@/src/components/GoogleAuth';

export default function SignUpPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'authenticated' || status === 'loading') {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sm:flex-1 flex sm:items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
              <p className="text-gray-600">Join our community today</p>
            </div>

            <GoogleAuth />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or sign up with email</span>
              </div>
            </div>

            <SignUpForm />

            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-brand hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}