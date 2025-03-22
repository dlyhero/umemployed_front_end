import React from 'react'
import { FaApple, FaGoogle, FaHome } from "react-icons/fa";
import Form from './Form'
import Link from 'next/link';

export const metadata = {
  title: "Sign Up - UmEmployed",
};

function SignUp() {
  return (
    <div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 container max-w-6xl mx-auto '>
        <div id='right-section' className='max-w-lg mx-auto lg:w-[60%] p-6 md:bg-white rounded-lg'>
          <div className='flex flex-col items-center w-full'>
            <div className="top-section w-full text-center">
              <div className="border-gray-300 p-2 gap-2">
                <div className="heading">
                  <h1 className='text-gray-800 font-black text:2xl lg:text-3xl'>Create an Account</h1>
                  <h2 className="text-gray-500">Sign up with one of the following options</h2>
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
            <span className='text-gray-5000'>Don't have an account? </span><Link href="/login" className='text-[#1e90ff]'>Sign up</Link>
           </div>
          </div>
        </div>
      </div>
    </div>
    </div >
  )
}

export default SignUp
