"use client"
import React from 'react'
import { FaApple, FaGoogle, FaHome } from "react-icons/fa";
import Form from './Form'
import Link from 'next/link';
import Footer from '@/src/components/common/Footer/Footer';
import { signIn } from 'next-auth/react';


function SignUp() {
    return (
        <div>
            <div className='mt-4 container max-w-6xl mx-auto p-4 md:p-0'>
                <div id='right-section' className='max-w-lg mx-auto lg:w-[60%] p-6 md:bg-white rounded-lg border border-gray-300 md:border-none'>
                    <div className='flex flex-col items-center w-full'>
                        <div className="top-section w-full text-center">
                            <div className="border-gray-300 p-2 gap-2">
                                <div className="heading">
                                    <h1 className='text-gray-800 font-black text:2xl lg:text-3xl'>Create an Account</h1>
                                </div>
                            </div>
                            <div id="alt-auth" className="w-full">
                                <button onClick={() => signIn('google')} className="relative wrapper shadow border border-gray-300 p-2 h-fit rounded-lg w-full cursor-pointer">
                                    <img src="/icons/google.png" alt="google-icon" className='h-6 w-6' />
                                    <span className='absolute left-1/2 top-1/2 transform -translate-1/2 -translate-y-1/2 text-gray-700 font-semibold'>Sign up with google</span>
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
                                <span className='text-gray-5000'>Don't have an account? </span><Link href="/login" className='text-brand'>Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <footer>
                <p className="text-sm text-nowrap text-gray-800 text-center mt-1">© 2024 UmEmployed. All rights reserved.</p>
                 </footer>
            </div>
        </div >
    )
}

export default SignUp
