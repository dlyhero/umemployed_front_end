"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

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

    // Handle redirect if already authenticated
    useEffect(() => {
        if (status === "authenticated") {
            // Clear the login page from history stack
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
                redirect: false,
                callbackUrl: callbackUrl
            });

            if (result?.error) {
                let errorMessage = "Login failed";
                
                // Handle specific error cases
                if (result.error.includes("401")) {
                    errorMessage = "Invalid email or password";
                } else if (result.error.includes("Network Error")) {
                    errorMessage = "Network error - please try again later";
                } else if (result.error.includes("CredentialsSignin")) {
                    errorMessage = "Invalid credentials";
                }

                throw new Error(errorMessage);
            }

            if (result?.ok && !result?.error) {
                // Clear the login page from history stack
                window.history.replaceState(null, '', callbackUrl);
                router.replace(callbackUrl);
            }
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full relative">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="email-wrap flex flex-col gap-1 mb-4">
                <label htmlFor="email" className="ml-1 text-gray-500 font-semibold">
                    Email
                </label>
                <input
                    {...register("email", { 
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })}
                    type="email"
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    id="email"
                    placeholder="Enter your email"
                    autoComplete="username"
                />
                {errors.email && (
                    <p className="text-red-500 mt-1 ml-1 italic">{errors.email.message}</p>
                )}
            </div>

            <div className="password-wrap flex flex-col gap-1 mb-4 relative">
                <label htmlFor="password" className="ml-1 text-gray-500 font-semibold">
                    Password
                </label>
                <input
                    {...register("password", { 
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                    type={passwordVisible ? "text" : "password"}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    id="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-8 right-2 h-8 w-8"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </Button>
                {errors.password && (
                    <p className="text-red-500 mt-1 ml-1 italic">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        id="rememberMe" 
                        {...register("rememberMe")}
                        className="rounded text-brand focus:ring-brand"
                    />
                    <label htmlFor="rememberMe" className="text-sm text-gray-600">
                        Remember me
                    </label>
                </div>
                <a href="/forgot-password" className="text-sm text-brand hover:underline">
                    Forgot password?
                </a>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-brand font-semibold hover:bg-brand/70 cursor-pointer "
            >
                {loading ? (
                    <span className="flex items-center justify-cente ">
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