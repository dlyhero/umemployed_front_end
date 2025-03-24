"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      console.log("SignIn result:", result); // Debug

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push(searchParams.get('callbackUrl') || '/');
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
          {...register("email", { required: "Email is required" })}
          type="email"
          className="p-2 border border-gray-300 rounded-lg"
          id="email"
          placeholder="Enter your email"
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
          {...register("password", { required: "Password is required" })}
          type={passwordVisible ? "text" : "password"}
          className="p-2 border border-gray-300 rounded-lg"
          id="password"
          placeholder="Enter your password"
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute top-9 right-2"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
        </Button>
        {errors.password && (
          <p className="text-red-500 mt-1 ml-1 italic">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <a href="#" className="text-brand hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded-lg font-semibold  ${
          loading ? "bg-brand/80" : "bg-brand hover:bg-brand/70"
        } text-white`}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}