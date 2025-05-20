"use client";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import LoginForm from './Form';
import Footer from '@/src/components/common/Footer/Footer';
import Link from "next/link";
import { UilGoogle } from '@iconscout/react-unicons';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Spinner from "@/src/components/common/Spinner";
import { signIn } from 'next-auth/react';

function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <Suspense>
      <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Log in to your account to continue</p>
            </div>

            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
                onClick={() => signIn('google', { callbackUrl: '/select-role' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="150" height="150" className="mr-2" viewBox="0 0 48 48">
<path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
                Continue with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <LoginForm />

              <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-brand hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </Suspense>
  );
}

export default Login;