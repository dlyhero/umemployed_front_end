
"use client"
import { Button } from '@/src/components/ui/button'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { z } from "zod";
import { useForm } from 'react-hook-form'

const loginSchema = z.object({
    email: z
    .string()
    .min(1, { message: "must be at least one character" })
    .max(254, { message: "Email must be less than 255 characters" })
    .email("This is not a valid email"),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .nonempty({ message: "Password is required" }),
});


export default function Form() {
    const [passwordVisibilty, setPasswordVisibility] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })

    const handleVisibility = (e) => {
        setPasswordVisibility((prev) => !prev);
    };

    const onSubmit = data => {
        console.log(data);
    }

    useEffect(() => {

    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <div className="email-wrap flex flex-col gap-1">
                <label htmlFor="email" className='ml-1 text-gray-500 font-semibold'>Email</label>
                <input {...register('email')} type="email" className='p-2 border border-gray-300 outline-none rounded-lg bg-transparent' id='email' name='email' placeholder='Enter your email' />
                {errors.email && <p className='text-red-500 mt-1 ml-1 italic'>{errors.email.message}</p>}
            </div>
            <div className="password-wrap flex flex-col gap-1 my-4 relative">
                <label htmlFor="password" className='ml-1 text-gray-500 font-semibold'>Password</label>
                <input {...register('password')} type={`${!passwordVisibilty ? 'password' : 'text'}`} className='p-2 border border-gray-300 outline-none rounded-lg bg-transparent' id='password' name='password' placeholder='Enter your password' />
                {errors.password && <p className='text-red-500 mt-1 ml-1 italic'>{errors.password.message}</p>}
                <Button variant={'ghost'} className='absolute top-7 right-3 text-gray-700 border-none' onClick={handleVisibility} >{passwordVisibilty ? <FaEyeSlash /> : <FaEye />}</Button>
            </div>
            <div className="flex items-center justify-between">
                <div className='check-btn space-x-2'>
                    <input type="checkbox" name="rememberMe" id="rememberMe" />
                    <span>Remember me</span>
=======

"use client";  // Keep the "use client" only for the client-side component logic
import React from 'react';
import { FaApple, FaGoogle, FaHome } from "react-icons/fa";
import Form from './Form';
import Link from 'next/link';
import Footer from '@/src/components/common/Footer/Footer';
import { signIn } from 'next-auth/react';

function Login() {
  return (
    <div className=''>
      <div className=' lg:mt-[5%] container max-w-6xl mx-auto p-4 md:p-0'>
        <div className=' lg:flex items-center border border-gray-300 md:border-none rounded-lg'>
          <div id='left-section' className='hidden lg:block'>
            <img src="/images/login.webp" alt="" />
          </div>
          <div id='right-section' className='max-w-xl mx-auto lg:w-[60%] p-4  rounded-lg'>
            <div className='flex flex-col items-center w-full'>
              <div className="top-section w-full text-center">
                <div className="border-gray-300 p-4 gap-2">
                  <div className="heading">
                    <h1 className='text-gray-800 font-black text-3xl lg:text-4xl'>Welcome Back!</h1>
                    <h2 className="text-gray-500">Please log in to your account</h2>
                  </div>
                </div>
                <div id="alt-auth" className="w-full">
                  <button onClick={() => signIn('google', { callbackUrl: '/' })} className="w-full cursor-pointer relative wrapper shadow border border-gray-300 p-2 h-fit rounded-lg">
                    <img src="/icons/google.png" alt="google-icon" className='h-6 w-6' />
                    <span className='absolute left-1/2 top-1/2 transform -translate-1/2 -translate-y-1/2 text-gray-700 font-semibold'>Sign in with google</span>
                  </button>
                </div>
              </div>  
              <div className="flex items-center my-4 w-full">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-gray-500 text-sm">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <div className="bottom-section w-full">
                <Form />
                <div className='mt-2 text-center'>
                  <span className='text-gray-5000'>Don't have an account? </span><Link href="/signup" className='text-brand cursor-pointer '>Sign up</Link
                </div>
                <a href="#" className='text-[#1e90ff]'>Forgot your password?</a>
            </div>
            <div className="btn-wrap mt-4">
                <Button variant={'brand'}  className={'font-semibold cursor-pointer'}>Log In</Button>
            </div>
        </form>
    )
}
          </div>
        </div>
      </div >
      <Footer />
    </div>
  )
}

export default Login;
