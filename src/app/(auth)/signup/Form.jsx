"use client";
import { Button } from "@/src/components/ui/button";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters'}).max(254, {message: 'Name must be less than 255 characters'}),
    email: z
      .string()
      .min(1, { message: "Must be at least one character" })
      .max(254, { message: "Email must be less than 255 characters" })
      .email("This is not a valid email"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .nonempty({ message: "Password is required" }),
    confirmPassword: z.string().nonempty({ message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });

export default function Form() {
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field], 
    }));
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
     {/* Name Field */}
     <div className="name-wrap flex flex-col gap-1 my-4">
        <label htmlFor="name" className="ml-1 text-gray-500 font-semibold">
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
          id="name"
          name="name"
          placeholder="Enter your full names"
        />
        {errors.name && (
          <p className="text-red-500 mt-1 ml-1 italic">{errors.name.message}</p>
        )}
      </div>
      {/* Email Field */}
      <div className="email-wrap flex flex-col gap-1">
        <label htmlFor="email" className="ml-1 text-gray-500 font-semibold">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
          id="email"
          name="email"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 mt-1 ml-1 italic">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="password-wrap flex flex-col gap-1 my-4 relative">
        <label htmlFor="password" className="ml-1 text-gray-500 font-semibold">
          Password
        </label>
        <input
          {...register("password")}
          type={visibility.password ? "text" : "password"}
          className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
          id="password"
          name="password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 mt-1 ml-1 italic">
            {errors.password.message}
          </p>
        )}
        <Button
          variant={"ghost"}
          className="absolute top-7 right-3 text-gray-700 border-none"
          onClick={() => toggleVisibility("password")} // Toggle password visibility
          type="button" // Prevent form submission
        >
          {visibility.password ? <FaEyeSlash /> : <FaEye />}
        </Button>
      </div>

      {/* Confirm Password Field */}
      <div className="password-wrap flex flex-col gap-1 my-4 relative">
        <label
          htmlFor="confirmPassword"
          className="ml-1 text-gray-500 font-semibold"
        >
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type={visibility.confirmPassword ? "text" : "password"}
          className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 mt-1 ml-1 italic">
            {errors.confirmPassword.message}
          </p>
        )}
        <Button
          variant={"ghost"}
          className="absolute top-7 right-3 text-gray-700 border-none"
          onClick={() => toggleVisibility("confirmPassword")} // Toggle confirmPassword visibility
          type="button" // Prevent form submission
        >
          {visibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center space-x-1">
        <div className="check-btn space-x-2">
          <input type="checkbox" name="rememberMe" id="rememberMe" />
          <span> I agree to the </span>
        </div>
        <a href="#" className="text-[#1e90ff]">
         <span> Terms and conditions</span>
        </a>
      </div>

      {/* Submit Button */}
      <div className="btn-wrap mt-4">
        <Button variant={"brand"}  className={"font-semibold cursor-pointer"}>
          Sign Up
        </Button>
      </div>
    </form>
  );
}