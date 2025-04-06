"use client";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import LoginForm from './Form';
import Footer from '@/src/components/common/Footer/Footer';
import Link from "next/link";
import { UilGoogle } from '@iconscout/react-unicons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from "@/src/components/common/Spinner";
import { signIn } from 'next-auth/react';

function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
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
                <UilGoogle className="h-4 w-4 mr-2" />
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
  );
}

export default Login;