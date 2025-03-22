
"use client";  // Keep the "use client" only for the client-side component logic
import React from 'react';
import { FaApple, FaGoogle, FaHome } from "react-icons/fa";
import Form from './Form';
import Link from 'next/link';
import Footer from '@/src/components/common/Footer/Footer';

function Login() {
  return (
    <div className=''>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 container max-w-6xl mx-auto p-4 md:p-0'>
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
                  <div className="relative wrapper shadow border border-gray-300 p-2 h-fit rounded-lg">
                    <img src="/icons/google.png" alt="google-icon" className='h-6 w-6' />
                    <span className='absolute left-1/2 top-1/2 transform -translate-1/2 -translate-y-1/2 text-gray-700 font-semibold'>Sign in with google</span>
                  </div>
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
                  <span className='text-gray-5000'>Don't have an account? </span><Link href="/signup" className='text-brand'>Sign up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <Footer />
    </div>
  )
}

export default Login;
