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
                <input {...register('email')} type="email" className='p-2 border border-gray-300 outline-none rounded-lg bg-tansparent' id='email' name='email' placeholder='Enter your email' />
                {errors.email && <p className='text-red-500 mt-1 ml-1 italic'>{errors.email.message}</p>}
            </div>
            <div className="password-wrap flex flex-col gap-1 my-4 relative">
                <label htmlFor="password" className='ml-1 text-gray-500 font-semibold'>Password</label>
                <input {...register('password')} type={`${!passwordVisibilty ? 'password' : 'text'}`} className='p-2 border border-gray-300 outline-none rounded-lg bg-tansparent' id='password' name='password' placeholder='Enter your password' />
                {errors.password && <p className='text-red-500 mt-1 ml-1 italic'>{errors.password.message}</p>}
                <Button variant={'ghost'} className='absolute top-7 right-3 text-gray-700 border-none' onClick={handleVisibility} >{passwordVisibilty ? <FaEyeSlash /> : <FaEye />}</Button>
            </div>
            <div className="flex items-center justify-between">
                <div className='check-btn space-x-2'>
                    <input type="checkbox" name="rememberMe" id="rememberMe" />
                    <span>Remember me</span>
                </div>
                <a href="#" className='text-brand'>Forgot your password?</a>
            </div>
            <div className="btn-wrap mt-4">
                <Button variant={'brand'}>Log In</Button>
            </div>
        </form>
    )
}
