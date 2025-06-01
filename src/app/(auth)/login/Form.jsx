"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function LoginForm() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get callbackUrl from query parameters or default to dashboard
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleRoleBasedRedirect = (user) => {
        // Handle default redirects based on role and status
        switch(user?.role) {
            case 'job_seeker':
                if (user?.has_resume) {
                    router.replace('/applicant/dashboard');
                } else {
                    router.replace('/upload-resume');
                }
                break;
            case 'recruiter':
                if (user?.has_company && user?.company_id) {
                    router.replace(`/companies/${user.company_id}/dashboard`);
                } else {
                    router.replace('/company/create');
                }
                break;
            case 'none':
            default:
                router.replace('/select-role');
        }
    };

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            handleRoleBasedRedirect(session.user);
        }
    }, [status, session, router]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
      
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error === "EMAIL_NOT_VERIFIED") {
                const redirectUrl = `/verify_email?email=${data.email}`;
                window.open(redirectUrl, '_blank');
                window.history.pushState(null, '', redirectUrl);
                window.history.replaceState(null, '', redirectUrl);
            } else if (result?.error === "INVALID_CREDENTIALS") {
                throw new Error("Invalid email or password");
            } else if (result?.error) {
                throw new Error("Please make sure you are connected to the internet");
            }
            
            // If no error, the session change will trigger the redirect
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand"
                        id="email"
                        placeholder="you@example.com"
                        autoComplete="username"
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        {...register("password", { 
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        type={passwordVisible ? "text" : "password"}
                        className="block w-full pr-10 pl-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand"
                        id="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                        {passwordVisible ? 
                            <EyeOff className="h-5 w-5 text-gray-400" /> : 
                            <Eye className="h-5 w-5 text-gray-400" />
                        }
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="rememberMe" 
                        {...register("rememberMe")}
                        className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>
                <Link href="/forgotPassword" className="text-sm text-brand hover:underline">
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand/90 text-white"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </span>
                ) : "Log In"}
            </Button>
        </form>
    );
}