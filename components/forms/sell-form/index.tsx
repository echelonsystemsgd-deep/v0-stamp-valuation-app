'use client'

import * as React from 'react'
import { StepIndicator } from './step-indicator'
import { CollectionInfoStep } from './collection-info'
import { ImageUploadStep } from './image-upload'
import { ContactDetailsStep } from './contact-details'
import { WhatHappensNext } from './what-happens-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { InspectionResponseView } from './inspection-response-view'

const steps = ['Collection Details', 'Photos', 'Contact Info']

export interface FormData {
  // Step 1
  sellingOption: 'box_and_send' | 'photo_appraisal' | 'calculator' | 'vip_collection' | string
  collectionType: string
  quantity: string
  era: string
  description: string
  valuableItems: string
  // Step 2
  images: File[]
  // Step 3
  fullName: string
  email: string
  phone: string
  preferredContact: 'phone' | 'callback' | 'email' | 'either' | string
  postcode: string
  leadSource?: string
}

const initialFormData: FormData = {
  sellingOption: 'box_and_send',
  collectionType: '',
  quantity: '',
  era: '',
  description: '',
  valuableItems: '',
  images: [],
  fullName: '',
  email: '',
  phone: '',
  preferredContact: 'phone',
  postcode: '',
  leadSource: 'direct',
}

export interface SellFormProps {
  initialQuantity?: string
  initialDescription?: string
  /** Set when user arrives from homepage calculator lock-in URL (offer_low present). */
  isLockInOffer?: boolean
  isDashboard?: boolean
}

export function SellForm({ initialQuantity, initialDescription, isLockInOffer = false, isDashboard = false }: SellFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState<FormData>(() => {
    return {
      ...initialFormData,
      sellingOption: isLockInOffer ? "calculator" : initialFormData.sellingOption,
      quantity: initialQuantity || "",
      description: initialDescription || "",
      leadSource: isLockInOffer ? "homepage_calculator" : initialFormData.leadSource,
    }
  })
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [submittedReference, setSubmittedReference] = React.useState<string>('')
  const [submittedData, setSubmittedData] = React.useState<FormData | null>(null)
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({})

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    // Clear errors for updated fields
    const clearedErrors = { ...errors }
    Object.keys(updates).forEach((key) => {
      delete clearedErrors[key as keyof FormData]
    })
    setErrors(clearedErrors)
  }

  // React to prop changes (like when calculator data comes in later)
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      quantity: initialQuantity && !prev.quantity ? initialQuantity : prev.quantity,
      description: initialDescription && prev.description !== initialDescription ? initialDescription : prev.description,
    }))
  }, [initialQuantity, initialDescription])

  // Restore previously submitted valuation if user refreshed the page
  React.useEffect(() => {
    try {
      const lastSubmission = localStorage.getItem('last_stamp_submission')
      if (lastSubmission) {
        const parsed = JSON.parse(lastSubmission)
        if (parsed?.referenceId && parsed?.formData) {
          setSubmittedReference(parsed.referenceId)
          setSubmittedData(parsed.formData)
          setIsSubmitted(true)
        }
      }
    } catch (e) {
      console.error('Failed to restore last submission', e)
    }
  }, [])

  // Persist form data to localStorage (excluding images)
  React.useEffect(() => {
    const savedData = localStorage.getItem("sell_form_progress")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData((prev) => ({
          ...prev,
          ...parsedData,
          sellingOption: isLockInOffer ? "calculator" : parsedData.sellingOption || prev.sellingOption || "box_and_send",
          preferredContact: parsedData.preferredContact || prev.preferredContact || "phone",
          quantity: initialQuantity || parsedData.quantity || prev.quantity,
          description: initialDescription || parsedData.description || prev.description,
          leadSource: isLockInOffer ? "homepage_calculator" : parsedData.leadSource || prev.leadSource || "direct",
        }))
      } catch (e) {
        console.error("Failed to load form progress", e)
      }
    } else if (isLockInOffer) {
      setFormData((prev) => ({
        ...prev,
        leadSource: "homepage_calculator",
      }))
    }
  }, [initialQuantity, initialDescription, isLockInOffer])

  React.useEffect(() => {
    if (isSubmitted) return
    const { images: _images, ...persistentData } = formData
    localStorage.setItem('sell_form_progress', JSON.stringify(persistentData))
  }, [formData, isSubmitted])

  // Fetch logged-in user profile to pre-fill details
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone, postcode')
          .eq('id', session.user.id)
          .single()
        
        setFormData((prev) => ({
          ...prev,
          email: prev.email || session.user.email || '',
          fullName: prev.fullName || profile?.full_name || '',
          phone: prev.phone || profile?.phone || '',
          postcode: prev.postcode || profile?.postcode || '',
        }))
      }
    }
    fetchUserProfile()
  }, [])

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (step === 1) {
      if (!formData.collectionType) newErrors.collectionType = 'Please select a collection type'
      if (!formData.quantity) newErrors.quantity = 'Please enter an approximate quantity'
      if (!formData.era) newErrors.era = 'Please select an era'
      if (!formData.description) newErrors.description = 'Please provide a brief description'
    }

    if (step === 3) {
      if (!formData.fullName) newErrors.fullName = 'Please enter your full name'
      if (!formData.email) {
        newErrors.email = 'Please enter your email address'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      if (!formData.postcode) {
        newErrors.postcode = 'Please enter your postcode'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Guard against premature submissions: user MUST be on step 3 to submit
    if (currentStep < 3) {
      handleNext()
      return
    }

    // Validate both Step 1 (collection details) and Step 3 (contact details)
    const isStep1Valid = validateStep(1)
    const isStep3Valid = validateStep(3)
    if (!isStep1Valid || !isStep3Valid) {
      if (!isStep1Valid) setCurrentStep(1)
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const prefix = session?.user?.id ? session.user.id : 'guest'

      // Upload images to Supabase Storage
      const uploadedImages = []
      for (const file of formData.images) {
        const fileExt = file.name.split('.').pop()
        const uniqueId = Math.random().toString(36).substring(2, 15)
        const fileName = `${uniqueId}-${Date.now()}.${fileExt}`
        const filePath = `${prefix}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Error uploading file to storage:', file.name, uploadError)
          throw new Error(`Failed to upload image: ${file.name}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('submissions')
          .getPublicUrl(filePath)

        uploadedImages.push({
          file_path: filePath,
          image_url: publicUrl
        })
      }

      const { images: _images, ...payload } = formData
      const submissionPayload = {
        ...payload,
        images: uploadedImages
      }
      
      const response = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || 'Submission failed')
      }

      const resData = await response.json()
      const ref = resData.submissionId 
        ? `VAL-${resData.submissionId.slice(0, 8).toUpperCase()}` 
        : `VAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

      console.log('Form submitted successfully:', resData)
      localStorage.removeItem('sell_form_progress')
      
      // Persist submission record so page refresh keeps confirmation view
      localStorage.setItem('last_stamp_submission', JSON.stringify({
        referenceId: ref,
        formData: formData,
        submittedAt: Date.now()
      }))

      setSubmittedReference(ref)
      setSubmittedData(formData)
      setIsSubmitted(true)
    } catch (err: any) {
      console.error('Submission error:', err)
      setErrors((prev) => ({ 
        ...prev, 
        email: err.message || 'Submission failed. Please try again or contact us directly.' 
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('last_stamp_submission')
    localStorage.removeItem('sell_form_progress')
    setFormData({
      ...initialFormData,
      sellingOption: isLockInOffer ? "calculator" : initialFormData.sellingOption,
      quantity: initialQuantity || "",
      description: initialDescription || "",
      leadSource: isLockInOffer ? "homepage_calculator" : initialFormData.leadSource,
    })
    setCurrentStep(1)
    setIsSubmitted(false)
    setSubmittedReference('')
    setSubmittedData(null)
  }

  if (isSubmitted && submittedData) {
    return (
      <InspectionResponseView
        referenceId={submittedReference}
        formData={submittedData}
        isDashboard={isDashboard}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <Card className="bg-grainy-paper border-gold/20 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold/30" />
          <CardContent className="pt-8 px-6 sm:px-8">
            <StepIndicator currentStep={currentStep} totalSteps={3} steps={steps} />
            
            <form 
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                // Prevent accidental Enter-key form submits on step 1 and step 2 input fields
                if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                  e.preventDefault()
                  if (currentStep < 3) {
                    handleNext()
                  }
                }
              }}
            >
              <input type="hidden" name="leadSource" value={formData.leadSource ?? "direct"} />
              {currentStep === 1 && (
                <CollectionInfoStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}
              {currentStep === 2 && (
                <ImageUploadStep
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 3 && (
                <ContactDetailsStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack} className="h-12 px-6">
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-forest-green hover:bg-forest-green/90 text-white h-12 px-8"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-forest-green hover:bg-forest-green/90 text-white h-12 px-8"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Valuation'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* What Happens Next - Sidebar */}
      <div className="lg:col-span-1">
        <WhatHappensNext />
      </div>
    </div>
  )
}
