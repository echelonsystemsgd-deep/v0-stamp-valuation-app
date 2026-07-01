'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CreditCard, Loader2, Lock, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface PayoutDetails {
  bank_name?: string
  account_holder_name?: string
  sort_code?: string
  account_number?: string
}

interface PayoutFormProps {
  user: {
    id: string
    email: string
  }
  initialPayoutDetails: PayoutDetails
}

export function PayoutForm({ user, initialPayoutDetails }: PayoutFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [bankName, setBankName] = React.useState(initialPayoutDetails.bank_name || '')
  const [accountHolder, setAccountHolder] = React.useState(initialPayoutDetails.account_holder_name || '')
  const [sortCode, setSortCode] = React.useState(initialPayoutDetails.sort_code || '')
  const [accountNumber, setAccountNumber] = React.useState(initialPayoutDetails.account_number || '')

  const [isEditing, setIsEditing] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Auto-format Sort Code: XX-XX-XX
  const handleSortCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '') // Strip non-digits
    const limitedVal = rawVal.slice(0, 6) // Limit to 6 digits
    
    // Format as XX-XX-XX
    let formattedVal = limitedVal
    if (limitedVal.length > 4) {
      formattedVal = `${limitedVal.slice(0, 2)}-${limitedVal.slice(2, 4)}-${limitedVal.slice(4)}`
    } else if (limitedVal.length > 2) {
      formattedVal = `${limitedVal.slice(0, 2)}-${limitedVal.slice(2)}`
    }
    
    setSortCode(formattedVal)
  }

  // Account Number limit to 8 digits
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '') // Strip non-digits
    const limitedVal = rawVal.slice(0, 8) // Limit to 8 digits
    setAccountNumber(limitedVal)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    // Reset to initial values
    setBankName(initialPayoutDetails.bank_name || '')
    setAccountHolder(initialPayoutDetails.account_holder_name || '')
    setSortCode(initialPayoutDetails.sort_code || '')
    setAccountNumber(initialPayoutDetails.account_number || '')
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const cleanSortCode = sortCode.replace(/-/g, '')
    if (cleanSortCode.length !== 6) {
      toast.error('UK Sort Code must be exactly 6 digits (format: XX-XX-XX)')
      return
    }

    if (accountNumber.length !== 8) {
      toast.error('UK Account Number must be exactly 8 digits')
      return
    }

    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('profile_payout_details')
        .upsert({
          id: user.id,
          payout_method: 'bank_transfer',
          bank_name: bankName.trim(),
          bank_account_name: accountHolder.trim(),
          bank_sort_code: sortCode.trim(),
          bank_account_number: accountNumber.trim(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Payout bank details updated successfully!')
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error('Error saving payout details:', error)
      toast.error(error.message || 'Failed to update payout details')
    } finally {
      setSaving(false)
    }
  }

  // Masking helpers
  const maskSortCode = (val: string) => {
    const clean = val.replace(/-/g, '')
    if (clean.length < 6) return val
    return `●●-●●-${clean.slice(4)}`
  }

  const maskAccountNumber = (val: string) => {
    if (val.length < 8) return val
    return `●●●●●●${val.slice(6)}`
  }

  const hasDetailsSaved = !!(
    initialPayoutDetails.bank_name &&
    initialPayoutDetails.account_holder_name &&
    initialPayoutDetails.sort_code &&
    initialPayoutDetails.account_number
  )

  return (
    <Card className="w-full border-slate-200 bg-white shadow-sm rounded-2xl max-w-3xl">
      <CardHeader className="border-b border-slate-100 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <CardTitle className="font-serif text-2xl text-[#0B1D2E] flex items-center gap-2.5">
              <CreditCard className="h-6 w-6 text-[#C5A059]" />
              Payout Bank Details
            </CardTitle>
            <CardDescription>
              Provide your UK bank account details to receive payouts for completed stamp audits.
            </CardDescription>
          </div>
          {hasDetailsSaved && !isEditing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-serif">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified & Masked
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        {hasDetailsSaved && !isEditing && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Lock className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Masked for Security</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your bank details are encrypted and masked to prevent unauthorized viewing. Click edit below to modify your payout destination.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Holder Name */}
            <div className="space-y-2.5">
              <Label htmlFor="accountHolder" className="text-sm font-bold text-slate-700">
                Account Holder Name
              </Label>
              <Input
                id="accountHolder"
                type="text"
                placeholder="e.g. Mr John Smith"
                value={isEditing ? accountHolder : (hasDetailsSaved ? accountHolder : '')}
                onChange={(e) => setAccountHolder(e.target.value)}
                disabled={!isEditing && hasDetailsSaved}
                className="h-11 border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-medium"
                required
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2.5">
              <Label htmlFor="bankName" className="text-sm font-bold text-slate-700">
                Bank Name
              </Label>
              <Input
                id="bankName"
                type="text"
                placeholder="e.g. Barclays, HSBC"
                value={isEditing ? bankName : (hasDetailsSaved ? bankName : '')}
                onChange={(e) => setBankName(e.target.value)}
                disabled={!isEditing && hasDetailsSaved}
                className="h-11 border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-medium"
                required
              />
            </div>

            {/* Sort Code */}
            <div className="space-y-2.5">
              <Label htmlFor="sortCode" className="text-sm font-bold text-slate-700">
                Sort Code
              </Label>
              <Input
                id="sortCode"
                type="text"
                placeholder="e.g. 20-45-12"
                value={isEditing ? sortCode : (hasDetailsSaved ? maskSortCode(sortCode) : sortCode)}
                onChange={handleSortCodeChange}
                disabled={!isEditing && hasDetailsSaved}
                className="h-11 border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-mono text-sm tracking-widest font-bold"
                required
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2.5">
              <Label htmlFor="accountNumber" className="text-sm font-bold text-slate-700">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="e.g. 12345678"
                value={isEditing ? accountNumber : (hasDetailsSaved ? maskAccountNumber(accountNumber) : accountNumber)}
                onChange={handleAccountNumberChange}
                disabled={!isEditing && hasDetailsSaved}
                className="h-11 border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-mono text-sm tracking-widest font-bold"
                required
              />
            </div>
          </div>

          <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl p-4 flex gap-3 text-[#C5A059]">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>Important:</strong> We only execute disbursements to verified UK bank accounts. Ensure the Sort Code and Account Number match your banking credentials exactly to prevent payment holds.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {hasDetailsSaved && !isEditing ? (
              <Button
                type="button"
                onClick={handleEditClick}
                className="bg-[#14452F] hover:bg-[#14452F]/90 text-white font-bold h-11 px-6 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" /> Edit Payout Details
              </Button>
            ) : (
              <>
                {hasDetailsSaved && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelClick}
                    disabled={saving}
                    className="border-slate-200 h-11 px-6 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#14452F] hover:bg-[#14452F]/90 text-white font-bold h-11 px-8 rounded-xl shadow-md cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving Bank Details...
                    </>
                  ) : (
                    'Save Bank Details'
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
