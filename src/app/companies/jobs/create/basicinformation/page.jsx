// app/companies/jobs/create/basicinformation/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import { useJobForm } from '../../../../../hooks/useJobForm'
import { FormContainer } from '../../components'
import LoadingSpinner from '@/src/components/common/LoadingSpinner'

function BasicInformationContent() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const params = useParams()
  const companyId = params?.companyId 

  const {
    step,
    form,
    onSubmit: handleSubmit,
    stepIsValid,
    nextStep,
    prevStep,
    jobOptions,
    extractedSkills
  } = useJobForm('basicinformation')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !form) {
    return <LoadingSpinner fullPage />
  }

  const onSubmit = async (data) => {
    try {
      if (!handleSubmit) {
        throw new Error('Form submission handler not ready')
      }

      const result = await handleSubmit(data)
      
      if (result?.error) {
        throw new Error(result.error)
      }

      if (step === 4) {
        toast.success('Job created successfully!')
        router.push(`/companies/${companyId}/dashboard`)
      } else {
        toast.success(`Step ${step} saved successfully!`)
        nextStep()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit step')
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <FormContainer
        step={step}
        form={form}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={onSubmit}
        stepIsValid={stepIsValid}
        jobOptions={jobOptions}
        extractedSkills={extractedSkills}
      />
    </>
  )
}

export default function BasicInformationPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <BasicInformationContent />
    </Suspense>
  )
}