import { Button } from '@/components/ui/button'
import React from 'react'

export default function Form() {
    return (
        <div className='w-full'>
            <div className="email-wrap flex flex-col gap-1">
                <label htmlFor="email" className='ml-1 text-gray-500 font-semibold'>Email</label>
                <input type="email" className='p-4 border border-gray-300 outline-none rounded-lg bg-white' id='email' name='email' placeholder='Enter your email' />
            </div>
            <div className="password-wrap flex flex-col gap-1 my-4">
                <label htmlFor="password" className='ml-1 text-gray-500 font-semibold'>Password</label>
                <input type="password" className='p-4 border border-gray-300 outline-none rounded-lg bg-white' id='password' name='password' placeholder='Enter your password' />
            </div>
            <div className="flex items-center justify-between">
                <div className='check-btn space-x-2'> 
                    <input type="checkbox" name="rememberMe" id="rememberMe" />
                    <span>Remember me</span>
                </div>
                <a href="#" className='text-[#1e90ff]'>Forgot your password?</a>
            </div>
            <div className="btn-wrap mt-4">
                <Button variant={'brand'} size={'custom'} className={'font-semibold'}>Log In</Button>
            </div>
        </div>
    )
}
