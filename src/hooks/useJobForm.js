"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step1Schema, step2Schema, step3Schema, step4Schema } from "../app/companies/jobs/schemas/jobSchema"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"

// API configuration
const API_BASE_URL = "https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api"

export const useJobForm = (currentStep, initialJobId = null) => {
  const router = useRouter()
  const { data: session, status } = useSession()

  // State management
  const [jobId, setJobId] = useState(initialJobId)
  const [extractedSkills, setExtractedSkills] = useState([])
  const [jobOptions, setJobOptions] = useState({
    categories: [],
    salary_ranges: {},
    job_location_types: {},
    job_types: {},
    experience_levels: {},
    weekly_ranges: {},
    shifts: {},
    locations: [],
  })
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Define steps array with useMemo to avoid recreation
  const steps = useMemo(() => ["basicinformation", "requirements", "description", "skills"], [])

  // Define step schemas and numbers using useMemo to avoid recreating on each render
  const stepSchemas = useMemo(
    () => ({
      basicinformation: step1Schema,
      requirements: step2Schema,
      description: step3Schema,
      skills: step4Schema,
    }),
    [],
  )

  const stepNumbers = useMemo(
    () => ({
      basicinformation: 1,
      requirements: 2,
      description: 3,
      skills: 4,
    }),
    [],
  )

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: {
      title: "",
      hire_number: 1,
      job_type: "",
      job_location_type: "",
      location: "",
      salary_range: "Not specified",
      category: null,
      experience_levels: "",
      weekly_ranges: "",
      shifts: "",
      description: "",
      responsibilities: "",
      benefits: "",
      requirements: [],
      level: "Beginner",
      isSubmitting: false,
    },
    mode: "onChange",
  })

  // Get authentication token
  const getAuthToken = useCallback(() => {
    return session?.accessToken || session?.token
  }, [session])

  // API request helper with error handling
  const apiRequest = useCallback(
    async (endpoint, method, data) => {
      const token = getAuthToken()
      if (!token) {
        throw new Error("No authentication token found")
      }

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(data ? { body: JSON.stringify(data) } : {}),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`API error (${endpoint}):`, errorData)
          throw new Error(errorData.message || `Failed to ${method} ${endpoint}`)
        }

        return await response.json()
      } catch (error) {
        console.error(`API request failed (${endpoint}):`, error)
        throw error
      }
    },
    [getAuthToken],
  )

  // Fetch job options
  const fetchJobOptions = useCallback(async () => {
    try {
      const data = await apiRequest("/job/job-options/", "GET")
      setJobOptions({
        categories: data.categories || [],
        salary_ranges: data.salary_ranges || {},
        job_location_types: data.job_location_types || {},
        job_types: data.job_types || {},
        experience_levels: data.experience_levels || {},
        weekly_ranges: data.weekly_ranges || {},
        shifts: data.shifts || {},
        locations: data.locations || [],
      })
    } catch (error) {
      console.error("Error fetching job options:", error)
      form.setError("root", { message: "Failed to load job options." })
    }
  }, [apiRequest, form])

  // Fetch extracted skills
  const fetchExtractedSkills = useCallback(
    async (jobId) => {
      console.log("Fetching extracted skills for job ID:", jobId)
      try {
        const data = await apiRequest(`/job/jobs/${jobId}/extracted-skills/`, "GET")
        const skills = Array.isArray(data.extracted_skills) ? data.extracted_skills : []
        console.log("Fetched skills:", skills)
        return skills
      } catch (error) {
        console.error("Error fetching extracted skills:", error)
        return []
      }
    },
    [apiRequest],
  )

  // Save form data to localStorage
  const saveFormData = useCallback((data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobFormData", JSON.stringify(data))
    }
  }, [])

  // Load data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    // Only run this effect once the component is mounted in the browser
    if (!isInitialized) {
      // Use initialJobId or get from localStorage
      const savedJobId = initialJobId || localStorage.getItem("jobId")

      if (savedJobId) {
        setJobId(savedJobId)
        localStorage.setItem("jobId", savedJobId)
      }

      const savedData = localStorage.getItem("jobFormData")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          form.reset(parsedData)
        } catch (e) {
          console.error("Error parsing saved form data:", e)
        }
      }

      const savedSkills = localStorage.getItem("extracted_skills")
      if (savedSkills) {
        try {
          const skills = JSON.parse(savedSkills)
          const parsedSkills = Array.isArray(skills) ? skills : []
          setExtractedSkills(parsedSkills)
        } catch (e) {
          console.error("Error parsing saved skills:", e)
        }
      }

      setIsInitialized(true)
    }
  }, [form, isInitialized, initialJobId])

  // Fetch job options on mount
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      fetchJobOptions()
    }
  }, [fetchJobOptions, isInitialized])

  // Load skills for the skills step if needed
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return

    if (currentStep === "skills" && jobId && extractedSkills.length === 0) {
      const loadSkills = async () => {
        setIsLoadingSkills(true)
        try {
          const skills = await fetchExtractedSkills(jobId)
          setExtractedSkills(skills)
          localStorage.setItem("extracted_skills", JSON.stringify(skills))

          if (skills.length === 0) {
            form.setError("root", {
              message: "No skills extracted. Please go back and update the description.",
            })
          }
        } catch (error) {
          console.error("Failed to load skills:", error)
          form.setError("root", { message: "Failed to load skills. Please try again." })
        } finally {
          setIsLoadingSkills(false)
        }
      }

      loadSkills()
    }
  }, [currentStep, jobId, extractedSkills.length, fetchExtractedSkills, form, isInitialized])

  // Form submission handler
  const onSubmit = async (data) => {
    console.log(`Submitting step ${currentStep} with data:`, data)

    // Check authentication
    if (status === "loading") return { error: "Session is still loading" }
    if (status === "unauthenticated") return { error: "Please log in to create a job." }

    const token = getAuthToken()
    if (!token) return { error: "No authentication token found" }

    try {
      // Set submitting state
      await form.setValue("isSubmitting", true, { shouldValidate: false })

      // Handle each step
      if (currentStep === "basicinformation") {
        const step1Data = {
          ...step1Schema.parse(data),
          category: Number.parseInt(data.category, 10),
          location: data.location,
        }

        const result = await apiRequest("/job/create-step1/", "POST", step1Data)
        setJobId(result.id)
        localStorage.setItem("jobId", result.id)
        saveFormData({ ...form.getValues(), ...step1Data })
        form.reset({ ...form.getValues(), ...step1Data })
        return result
      }

      // For all other steps, we need a job ID
      if (!jobId) {
        return { error: "Missing job ID. Please start from step 1." }
      }

      if (currentStep === "requirements") {
        const step2Data = step2Schema.parse(data)
        const result = await apiRequest(`/job/${jobId}/create-step2/`, "PATCH", step2Data)
        saveFormData({ ...form.getValues(), ...step2Data })
        return result
      }

      if (currentStep === "description") {
        const step3Data = step3Schema.parse(data)
        const result = await apiRequest(`/job/${jobId}/create-step3/`, "PATCH", step3Data)

        // After saving description, fetch extracted skills
        setIsLoadingSkills(true)
        try {
          const skills = await fetchExtractedSkills(jobId)
          setExtractedSkills(skills)
          localStorage.setItem("extracted_skills", JSON.stringify(skills))

          if (skills.length === 0) {
            form.setError("root", {
              message: "No skills extracted. Please update your description with more specific skills.",
            })
          }
        } finally {
          setIsLoadingSkills(false)
        }

        saveFormData({ ...form.getValues(), ...step3Data })
        return result
      }

      if (currentStep === "skills") {
        const step4Data = {
          requirements: Array.isArray(data.requirements) ? data.requirements : [],
          level: data.level || "Beginner",
        }

        const result = await apiRequest(`/job/${jobId}/create-step4/`, "PATCH", step4Data)

        // Clear localStorage on successful completion
        localStorage.removeItem("jobFormData")
        localStorage.removeItem("jobId")
        localStorage.removeItem("extracted_skills")

        return { success: true }
      }

      throw new Error("Invalid step")
    } catch (error) {
      console.error("Form submission error:", error)
      return { error: error.message || "An unexpected error occurred" }
    } finally {
      await form.setValue("isSubmitting", false, { shouldValidate: false })
    }
  }

  // Check if current step is valid
  const stepIsValid = useCallback(() => {
    const errors = form.formState.errors

    switch (currentStep) {
      case "basicinformation":
        return (
          !errors.title &&
          !errors.hire_number &&
          !errors.job_type &&
          !errors.job_location_type &&
          !errors.location &&
          !errors.salary_range &&
          !errors.category
        )

      case "requirements":
        return !errors.job_type && !errors.experience_levels && !errors.weekly_ranges && !errors.shifts

      case "description":
        return !errors.description && !errors.responsibilities && !errors.benefits

      case "skills":
        return !errors.requirements && !errors.level

      default:
        return false
    }
  }, [currentStep, form.formState.errors])

  // Navigation helpers
  const nextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      if (currentStep === "description" && isLoadingSkills) {
        toast.loading("Processing job description to extract skills...")
        return
      }

      const nextPath = `/companies/jobs/create/${steps[currentIndex + 1]}${jobId ? `?jobId=${jobId}` : ""}`
      router.push(nextPath)
    }
  }, [currentStep, isLoadingSkills, jobId, router, steps])

  const prevStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      const prevPath = `/companies/jobs/create/${steps[currentIndex - 1]}${jobId ? `?jobId=${jobId}` : ""}`
      router.push(prevPath)
    }
  }, [currentStep, jobId, router, steps])

  // Get current step number
  const getStepNumber = useCallback(() => stepNumbers[currentStep] || 1, [currentStep, stepNumbers])

  return {
    step: getStepNumber(),
    form,
    onSubmit,
    stepIsValid,
    nextStep,
    prevStep,
    jobId,
    extractedSkills,
    jobOptions,
    isLoadingSkills,
  }
}
