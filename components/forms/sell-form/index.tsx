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

const steps = ['Collection Details', 'Photos', 'Contact Info']

export interface FormData {
  // Step 1
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
  preferredContact: string
  postcode: string
  leadSource?: string
}

const initialFormData: FormData = {
  collectionType: '',
  quantity: '',
  era: '',
  description: '',
  valuableItems: '',
  images: [],
  fullName: '',
  email: '',
  phone: '',
  preferredContact: 'email',
  postcode: '',
  leadSource: 'direct',
}

export interface SellFormProps {
  initialQuantity?: string
  initialDescription?: string
  /** Set when user arrives from homepage calculator lock-in URL (offer_low present). */
  isLockInOffer?: boolean
}

export function SellForm({ initialQuantity, initialDescription, isLockInOffer = false }: SellFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState<FormData>(() => {
    return {
      ...initialFormData,
      quantity: initialQuantity || "",
      description: initialDescription || "",
      leadSource: isLockInOffer ? "homepage_calculator" : initialFormData.leadSource,
    }
  })
  const [isSubmitted, setIsSubmitted] = React.useState(false)
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

  // Persist form data to localStorage (excluding images)
  React.useEffect(() => {
    const savedData = localStorage.getItem("sell_form_progress")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData((prev) => ({
          ...prev,
          ...parsedData,
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
    const { images, ...persistentData } = formData
    localStorage.setItem('sell_form_progress', JSON.stringify(persistentData))
  }, [formData])

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
    if (validateStep(currentStep)) {
      setIsSubmitting(true)
      try {
        // In a real app, you would use FormData for image uploads
        // For this demo, we'll send everything except the File objects
        const { images, ...payload } = formData
        
        const response = await fetch('/api/sell', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) throw new Error('Submission failed')

        console.log('Form submitted successfully:', formData)
        localStorage.removeItem('sell_form_progress')
        setIsSubmitted(true)
      } catch (err) {
        console.error('Submission error:', err)
        setErrors((prev) => ({ ...prev, email: 'Submission failed. Please try again or contact us directly.' }))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-8 border-2 border-forest-green/20">
            <CheckCircle className="w-10 h-10 text-forest-green" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-navy mb-4">
            Thank You for Your Submission
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We have received your collection details. Our team will review your submission 
            and provide a valuation within 48 hours.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>
          <Button asChild className="bg-forest-green hover:bg-forest-green/90 text-white">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
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
            
            <form onSubmit={handleSubmit}>
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
