'use client'; // Must be at the very top of the component's scope
import { useSearchParams } from 'next/navigation'; // Import at the top
// src/app/error/page.jsx
import { Suspense } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Home, MailCheck, Lock, Ghost } from 'lucide-react';

// Client Component with useSearchParams
function ErrorContent() {

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages = {
    Default: {
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again later.',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      action: 'Try again',
      link: '/login'
    },
    Configuration: {
      title: 'Server Error',
      message: 'There is a problem with the server configuration.',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      action: 'Contact support',
      link: '/contact'
    },
    AccessDenied: {
      title: 'Access Denied',
      message: 'You do not have permission to access this page.',
      icon: <Lock className="h-6 w-6 text-yellow-600" />,
      action: 'Request access',
      link: '/request-access'
    },
    Verification: {
      title: 'Invalid Link',
      message: 'The verification link has expired or is invalid.',
      icon: <MailCheck className="h-6 w-6 text-blue-600" />,
      action: 'Get new link',
      link: '/login'
    },
    EMAIL_NOT_VERIFIED: {
      title: 'Email Not Verified',
      message: 'Please check your inbox for the verification email.',
      icon: <MailCheck className="h-6 w-6 text-blue-600" />,
      action: 'Resend verification',
      link: '/resend-verification'
    },
    INVALID_CREDENTIALS: {
      title: 'Invalid Credentials',
      message: 'The email or password you entered is incorrect.',
      icon: <Lock className="h-6 w-6 text-yellow-600" />,
      action: 'Try again',
      link: '/login'
    },
    404: {
      title: 'Page Not Found',
      message: "The page you're looking for doesn't exist or has been moved.",
      icon: <Ghost className="h-6 w-6 text-gray-600" />,
      action: 'Go home',
      link: '/'
    }
  };

  const currentError = errorMessages[error] || errorMessages.Default;

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-sm mb-4">
            {currentError.icon}
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {currentError.title}
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-center text-gray-600 mb-6">
            {currentError.message}
          </p>

          <div className="space-y-4">
            <Link
              href={currentError.link}
              className="group w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand/70"
            >
              {currentError.action}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {error !== '404' && (
              <Link
                href="/"
                className="w-full flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 hover:text-brand"
              >
                <Home className="mr-2 h-4 w-4" />
                Return home
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Server Component with Suspense
export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}