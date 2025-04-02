"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function LoginForm() {
    const { data: session, status } = useSession();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();

    useEffect(() => {
        if (status === "authenticated") {
            window.history.replaceState(null, '', callbackUrl);
            router.replace(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
      
        try {
          const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
          });

          if (result?.error === "EMAIL_NOT_VERIFIED") {
            return router.push(`/verify_email?email=${encodeURIComponent(data.email)}`);
          }
      
          if (result?.error) {
            throw new Error(
              result.error === "INVALID_CREDENTIALS" 
                ? "Invalid email or password" 
                : "Login failed"
            );
          }
      
          window.history.replaceState(null, '', callbackUrl);
          router.replace(callbackUrl);
      
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
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
                    <input
                        {...register("password", { 
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        type={passwordVisible ? "text" : "password"}
                        className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand"
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