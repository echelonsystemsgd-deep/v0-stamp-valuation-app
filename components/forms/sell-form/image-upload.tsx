'use client'

import * as React from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
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

      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Drag and drop images here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP (max 10MB each)
          </p>
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

      {/* Tips */}
      <div className="bg-secondary rounded-lg p-4">
        <h4 className="font-medium text-primary flex items-center gap-2 mb-2">
          <ImageIcon className="w-4 h-4" />
          Photo Tips
        </h4>
        <ul className="text-sm text-muted-foreground flex flex-col gap-1">
          <li>Take photos in good natural light</li>
          <li>Include close-ups of any rare or valuable stamps</li>
          <li>Show the overall album or collection spread</li>
          <li>Capture any visible condition issues clearly</li>
        </ul>
      </div>
    </div>
  )
}
