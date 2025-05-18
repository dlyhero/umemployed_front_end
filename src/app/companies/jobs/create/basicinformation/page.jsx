"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "react-hot-toast"
import { FormContainer } from "../../components/FormContainer"
import { useJobForm } from "../../../../../hooks/useJobForm"

export default function BasicInformationContent() {
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState(null)
  const router = useRouter()

  // Get jobId from URL on client side only
  useEffect(() => {
    // This will only run in the browser
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const urlJobId = urlParams.get("jobId")
      if (urlJobId) {
        setJobId(urlJobId)
      }
    }
  }, [])

  // Initialize the hook with jobId from URL
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions } = useJobForm("basicinformation", jobId)

  const handleSubmit = async (data) => {
    try {
      const result = await onSubmit(data)
      if (result?.error) {
        toast.error(result.error)
        return result
      }
      toast.success("Basic information saved successfully!")
      if (result.id) {
        setLoading(true) // Show loader during navigation
        router.push(`/companies/jobs/create/requirements?jobId=${result.id}`)
      }
      return result
    } catch (error) {
      toast.error("Failed to save basic information")
      return { error: error.message }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e90ff]"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <FormContainer
        step={step}
        form={form}
        nextStep={() => form.handleSubmit(handleSubmit)()}
        prevStep={prevStep}
        onSubmit={handleSubmit}
        stepIsValid={stepIsValid}
        jobOptions={jobOptions}
      />
    </>
  )
}
