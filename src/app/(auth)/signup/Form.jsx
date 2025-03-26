"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { SuccessModal } from "@/src/components/common/modal/SuccessModal";
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    firstname: z.string().min(3, "Name must be at least 3 characters").max(254),
    lastname: z.string().min(3, "Name must be at least 3 characters").max(254),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("This is not a valid email").max(254),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Form() {
  const router = useRouter();
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(""); // Store email for redirect

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/signup/",
        {
          first_name: data.firstname,
          last_name: data.lastname,
          username: data.username,
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
        }
      );

      if (response.status === 201) {
        setRegisteredEmail(data.email); // Store the email for redirect
        reset();
        setShowSuccessModal(true);
        
      }
    } catch (error) {
      let errorMessage = "An error occurred during registration";
      
      if (error.response) {
        // Handle different types of backend errors
        if (error.response.data) {
          // If backend returns error messages in response data
          if (typeof error.response.data === 'object') {
            // Join all error messages if multiple fields have errors
            errorMessage = Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
              .join('\n');
          } else {
            errorMessage = error.response.data;
          }
        } else if (error.response.status === 400) {
          errorMessage = "Validation error - please check your inputs";
        } else if (error.response.status === 409) {
          errorMessage = "User with this email or username already exists";
        }
      } else if (error.request) {
        errorMessage = "No response from server - please try again later";
      }
      
      setError(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Rest of your form fields remain the same */}
        {/* ... */}
          {/* First Name */}
          <div className="flex flex-col gap-1 my-4">
          <label htmlFor="firstname" className="ml-1 text-gray-500 font-semibold">
            First Name
          </label>
          <input
            {...register("firstname")}
            type="text"
            className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
            id="firstname"
            placeholder="Enter your first name"
          />
          {errors.firstname && <p className="text-red-500 mt-1 ml-1 italic">{errors.firstname.message}</p>}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1 my-4">
          <label htmlFor="lastname" className="ml-1 text-gray-500 font-semibold">
            Last Name
          </label>
          <input
            {...register("lastname")}
            type="text"
            className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
            id="lastname"
            placeholder="Enter your last name"
          />
          {errors.lastname && <p className="text-red-500 mt-1 ml-1 italic">{errors.lastname.message}</p>}
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1 my-4">
          <label htmlFor="username" className="ml-1 text-gray-500 font-semibold">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
            id="username"
            placeholder="Enter your username"
          />
          {errors.username && <p className="text-red-500 mt-1 ml-1 italic">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1 my-4">
          <label htmlFor="email" className="ml-1 text-gray-500 font-semibold">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
            id="email"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 mt-1 ml-1 italic">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="relative flex flex-col gap-1 my-4">
          <label htmlFor="password" className="ml-1 text-gray-500 font-semibold">
            Password
          </label>
          <input
            {...register("password")}
            type={visibility.password ? "text" : "password"}
            className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
            id="password"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 mt-1 ml-1 italic">{errors.password.message}</p>}
          <Button
            variant="ghost"
            className="absolute top-7 right-3 text-gray-700"
            onClick={() => toggleVisibility("password")}
            type="button"
            aria-label={visibility.password ? "Hide password" : "Show password"}
          >
            {visibility.password ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </div>

        {/* Confirm Password */}
        <div className="relative flex flex-col gap-1 my-4">
          <label htmlFor="confirmPassword" className="ml-1 text-gray-500 font-semibold">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type={visibility.confirmPassword ? "text" : "password"}
            className="p-2 border border-gray-300 outline-none rounded-lg bg-transparent"
            id="confirmPassword"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-500 mt-1 ml-1 italic">{errors.confirmPassword.message}</p>}
          <Button
            variant="ghost"
            className="absolute top-7 right-3 text-gray-700"
            onClick={() => toggleVisibility("confirmPassword")}
            type="button"
            aria-label={visibility.confirmPassword ? "Hide password" : "Show password"}
          >
            {visibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </div>


        <Button variant="brand" className="mt-4 w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title="Account Created Successfully!"
        description="Please check your email to verify your account before logging in."
        redirectUrl={`/verify_email?email=${encodeURIComponent(registeredEmail)}`}
        onRedirect={() => {
          router.push(`/verify_email?email=${encodeURIComponent(registeredEmail)}`);
        }}
      />
    </>
  );
}