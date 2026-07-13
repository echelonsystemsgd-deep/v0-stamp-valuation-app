'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, UploadCloud, CheckCircle, Shield, Phone, Mail, MapPin, User } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
  }
  initialProfile: {
    full_name?: string
    phone?: string
    postcode?: string
    role: 'user' | 'seller' | 'admin'
    status?: string
    avatar_url?: string | null
  } | null
  onSaveSuccess?: () => void
}

export function ProfileForm({ user, initialProfile, onSaveSuccess }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  const [fullName, setFullName] = React.useState(initialProfile?.full_name || '')
  const [phone, setPhone] = React.useState(initialProfile?.phone || '')
  const [postcode, setPostcode] = React.useState(initialProfile?.postcode || '')
  const [avatarPath, setAvatarPath] = React.useState<string | null>(initialProfile?.avatar_url || null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState<string | null>(null)
  
  const [uploading, setUploading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!avatarPath) {
      setAvatarPreviewUrl(null)
      return
    }

    const getSignedUrl = async () => {
      // If it contains http (older legacy format), use it directly
      if (avatarPath.startsWith('http')) {
        setAvatarPreviewUrl(avatarPath)
        return
      }

      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .createSignedUrl(avatarPath, 3600)
        
        if (error) throw error
        setAvatarPreviewUrl(data.signedUrl)
      } catch (err) {
        console.error('Error creating preview signed URL:', err)
      }
    }

    getSignedUrl()
  }, [avatarPath, supabase])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WEBP, and GIF images are allowed')
      return
    }

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar-${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      setAvatarPath(filePath)
      toast.success('Avatar uploaded successfully! Click save changes to apply.')
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast.error(error.message || 'Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          postcode: postcode.trim().toUpperCase(),
          avatar_url: avatarPath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profile updated successfully!')
      if (onSaveSuccess) onSaveSuccess()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile details')
    } finally {
      setSaving(false)
    }
  }

  const handleGlobalSignOut = async () => {
    const confirm = window.confirm('Are you sure you want to sign out of all devices? This will invalidate all your active sessions.')
    if (!confirm) return

    setSaving(true)
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      if (error) throw error
      toast.success('Successfully signed out of all devices!')
      router.push('/')
    } catch (error: any) {
      console.error('Error signing out globally:', error)
      toast.error(error.message || 'Failed to sign out globally')
    } finally {
      setSaving(false)
    }
  }

  const initials = (fullName || user.email).slice(0, 2).toUpperCase()
  const role = initialProfile?.role || 'user'

  return (
    <Card className="w-full border-slate-200/80 dark:border-slate-800 bg-white dark:bg-navy/40 shadow-sm rounded-2xl max-w-3xl">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-slate-800 dark:text-white flex items-center gap-2.5">
          <User className="h-6 w-6 text-[#C5A059]" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Update your profile picture, personal information, and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/60">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-24 w-24 border-2 border-gold/40 group-hover:border-gold transition-all duration-300 shadow-md">
                {avatarPreviewUrl ? (
                  <AvatarImage src={avatarPreviewUrl} alt={fullName || 'Avatar'} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-forest-green/10 text-forest-green dark:bg-gold/10 dark:text-gold font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <UploadCloud className="h-6 w-6 text-white" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={uploading || saving}
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Profile Picture</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Click the photo to upload a custom avatar. We support JPEG, PNG, WEBP, or GIF. Max size 5MB.
              </p>
              {avatarPath && (
                <button
                  type="button"
                  onClick={() => setAvatarPath(null)}
                  className="text-xs text-red-500 hover:text-red-650 font-semibold"
                  disabled={uploading || saving}
                >
                  Remove Picture
                </button>
              )}
            </div>

            {/* Read-Only Status & Role Badge */}
            <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0 select-none">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Account Role</span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold font-serif capitalize">
                <Shield className="h-3.5 w-3.5" />
                {role}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2.5">
              <Label htmlFor="fullName" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 border-slate-200/80 dark:border-slate-800"
                  disabled={saving || uploading}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Address (Disabled/Read-only) */}
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-bold text-slate-500 dark:text-slate-500">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-400 select-none cursor-not-allowed"
                />
                <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Phone Number
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +44 7123 456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 border-slate-200/80 dark:border-slate-800"
                  disabled={saving || uploading}
                  autoComplete="tel"
                />
                <Phone className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Postcode */}
            <div className="space-y-2.5">
              <Label htmlFor="postcode" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Postcode
              </Label>
              <div className="relative">
                <Input
                  id="postcode"
                  type="text"
                  placeholder="e.g. SW1A 1AA"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="h-11 border-slate-200/80 dark:border-slate-800 uppercase"
                  disabled={saving || uploading}
                  autoComplete="postal-code"
                />
                <MapPin className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <Button
              type="button"
              variant="outline"
              disabled={saving || uploading}
              onClick={handleGlobalSignOut}
              className="text-red-650 hover:text-red-700 dark:text-red-400 border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/10 h-11 px-6 rounded-xl shadow-sm cursor-pointer"
            >
              Sign Out of All Devices
            </Button>
            <Button
              type="submit"
              disabled={saving || uploading}
              className="bg-forest-green hover:bg-forest-green/90 text-white font-bold h-11 px-8 rounded-xl shadow-md shadow-forest-green/10"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
