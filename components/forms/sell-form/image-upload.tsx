'use client'

import * as React from 'react'
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FormData } from './index'
import { cn } from '@/lib/utils'

interface ImageUploadStepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

export function ImageUploadStep({ formData, updateFormData }: ImageUploadStepProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [previews, setPreviews] = React.useState<string[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const cameraInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )
    addFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files)
    if (e.target) e.target.value = ''
  }

  const addFiles = (files: File[]) => {
    const newImages = [...formData.images, ...files]
    updateFormData({ images: newImages })
    
    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    updateFormData({ images: newImages })
    
    // Revoke the URL and remove preview
    URL.revokeObjectURL(previews[index])
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-serif text-xl font-semibold text-primary mb-1">
          Add Photos of Your Collection
        </h3>
        <p className="text-muted-foreground text-sm">
          Clear photos help us provide more accurate valuations. This step is optional but recommended.
        </p>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Quick Action Buttons for Mobile */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        <Button
          type="button"
          variant="outline"
          className="h-13 border-forest-green/30 text-forest-green hover:bg-forest-green/10 flex items-center justify-center gap-2 font-bold text-sm rounded-xl"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="w-5 h-5 shrink-0" />
          <span>Take Photo</span>
        </Button>
        <Button
          type="button"
          className="h-13 bg-forest-green hover:bg-forest-green/90 text-white flex items-center justify-center gap-2 font-bold text-sm rounded-xl"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-5 h-5 shrink-0" />
          <span>Choose Photos</span>
        </Button>
      </div>

      {/* Drop Zone (Desktop & Large Mobile) */}
      <div
        className={cn(
          'border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-forest-green bg-forest-green/5'
            : 'border-border hover:border-muted-foreground'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click()
          }
        }}
        aria-label="Upload images"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center">
            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm sm:text-base">
              Drag and drop images here, or tap to browse
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Supports JPEG, PNG, or WebP (max 10MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={preview}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index)
                }}
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Photo Tips & Visual Guide */}
      <div className="bg-secondary/40 rounded-2xl p-5 border border-border/40">
        <h4 className="font-serif text-lg font-bold text-primary flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-forest-green" />
          Photo Guidelines
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-4 flex gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-700 font-black text-sm">
              ✓
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Good Practices</h5>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Lay albums or pages completely flat.</li>
                <li>Take photos in bright, indirect natural light.</li>
                <li>Include close-ups of distinct or older stamps.</li>
              </ul>
            </div>
          </div>
          <div className="border border-red-200 bg-red-50/40 dark:bg-red-950/10 rounded-xl p-4 flex gap-3">
            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 text-red-750 font-black text-sm">
              ✗
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-red-800 dark:text-red-400 text-sm">Avoid These</h5>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Avoid blurry shots or camera shaking.</li>
                <li>Avoid glare/flash reflections on plastic sleeves.</li>
                <li>Do not stack or overlap loose stamps.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
