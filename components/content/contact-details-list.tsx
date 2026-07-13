'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, Clock, Check } from 'lucide-react'
import { contactInfo } from '@/data/navigation'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function ContactDetailsList() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const contactDetails = [
    {
      icon: Phone,
      label: 'Phone',
      value: contactInfo.phone,
      action: () => {
        window.location.href = `tel:${contactInfo.phone.replace(/\s/g, '')}`
        toast({
          title: "Calling Sell Your Stamps UK",
          description: `Dialling ${contactInfo.phone}...`,
        })
      },
      subtitle: "Click to call our team directly",
      badge: "Call Us"
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo.email,
      action: () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(contactInfo.email)
          toast({
            title: "Email Address Copied!",
            description: `${contactInfo.email} copied to clipboard.`,
          })
        }
        setIsDialogOpen(true)
      },
      subtitle: "Click to copy email address",
      badge: "Copy Email"
    },
    {
      icon: Clock,
      label: 'Hours',
      value: contactInfo.hours,
      action: null,
      subtitle: "Monday to Friday support",
      badge: null
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-5">
        {contactDetails.map((detail) => {
          const isClickable = detail.action !== null
          return (
            <Card 
              key={detail.label} 
              onClick={detail.action || undefined}
              className={`border-border/50 transition-all ${
                isClickable 
                  ? 'hover:border-forest-green/45 hover:bg-slate-50/50 cursor-pointer shadow-sm hover:shadow-md' 
                  : ''
              }`}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  isClickable ? 'bg-forest-green/10 text-forest-green' : 'bg-slate-100 text-slate-500'
                }`}>
                  <detail.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{detail.label}</p>
                    {isClickable && detail.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-forest-green bg-forest-green/10 px-2 py-0.5 rounded-full select-none">
                        {detail.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-serif text-lg font-bold break-all mt-0.5 select-all">
                    {detail.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{detail.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-border/80 rounded-2xl shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-navy dark:text-white flex items-center gap-2">
              <Check className="h-6 w-6 text-forest-green bg-forest-green/10 rounded-full p-1" />
              Email Copied to Clipboard
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
              We've copied <strong className="text-slate-900 dark:text-white select-all">{contactInfo.email}</strong> to your clipboard.
              <br className="mb-2" />
              You can now paste it directly into your preferred email provider (like Gmail, Outlook, or Yahoo).
            </DialogDescription>
          </DialogHeader>

          {/* Webmail Quick Links Helper */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 mb-2">Or open your webmail directly:</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-forest-green hover:underline font-bold bg-forest-green/5 px-2.5 py-1 rounded-lg transition-colors hover:bg-forest-green/10"
              >
                Gmail ✉️
              </a>
              <a
                href="https://outlook.live.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-forest-green hover:underline font-bold bg-forest-green/5 px-2.5 py-1 rounded-lg transition-colors hover:bg-forest-green/10"
              >
                Outlook 📧
              </a>
              <a
                href="https://mail.yahoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-forest-green hover:underline font-bold bg-forest-green/5 px-2.5 py-1 rounded-lg transition-colors hover:bg-forest-green/10"
              >
                Yahoo Mail 📬
              </a>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-6 border-t pt-4 border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.location.href = `mailto:${contactInfo.email}`
              }}
              className="w-full sm:w-auto h-11 px-5 border-forest-green/20 text-forest-green hover:bg-forest-green/5 font-semibold text-sm rounded-xl cursor-pointer"
            >
              Launch Default Email App
            </Button>
            <DialogClose asChild>
              <Button 
                type="button" 
                className="w-full sm:w-auto h-11 px-6 bg-forest-green hover:bg-forest-green/90 text-white font-semibold text-sm rounded-xl cursor-pointer"
              >
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
