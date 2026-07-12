'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, Coins, Users, History, Settings, CornerDownLeft, X, Gift, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  href?: string
  action?: () => void
  icon: React.ComponentType<any>
  category: 'Pages' | 'Actions'
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Define static commands
  const commands: CommandItem[] = [
    { id: 'overview', label: 'Admin Overview', href: '/admin', icon: History, category: 'Pages' },
    { id: 'submissions', label: 'Submissions Queue', href: '/admin/submissions', icon: FileText, category: 'Pages' },
    { id: 'categories', label: 'Rates Manager', href: '/admin/categories', icon: Coins, category: 'Pages' },
    { id: 'sellers', label: 'Seller Accounts', href: '/admin/sellers', icon: Users, category: 'Pages' },
    { id: 'bonuses', label: 'Payout Bonuses', href: '/admin/bonuses', icon: Gift, category: 'Pages' },
    { id: 'marketing', label: 'Marketing Campaigns', href: '/admin/marketing', icon: Megaphone, category: 'Pages' },
    { id: 'reports', label: 'Analytics Reports', href: '/admin/reports', icon: History, category: 'Pages' },
    { id: 'settings', label: 'System Settings', href: '/admin/settings', icon: Settings, category: 'Pages' },
    {
      id: 'clear-filters',
      label: 'Reset All Local Filters',
      action: () => {
        setQuery('')
        setIsOpen(false)
      },
      icon: X,
      category: 'Actions'
    }
  ]

  // Detect submission ID input (e.g. VAL-xxxx or uuid)
  const isSubmissionIdSearch = query.toUpperCase().startsWith('VAL-') || (query.length === 8 && /^[0-9a-fA-F]+$/.test(query))
  
  const dynamicCommands: CommandItem[] = []
  if (isSubmissionIdSearch) {
    const rawId = query.toUpperCase().startsWith('VAL-') ? query.slice(4) : query
    dynamicCommands.push({
      id: 'dynamic-sub',
      label: `Go to Submission VAL-${rawId.substring(0, 8).toUpperCase()}`,
      action: () => {
        if (rawId.length >= 8) {
          router.push(`/admin/submissions/${rawId.toLowerCase()}`)
        } else {
          router.push(`/admin/submissions?search=VAL-${rawId.toLowerCase()}`)
        }
        setIsOpen(false)
      },
      icon: FileText,
      category: 'Actions'
    })
  }

  const allFilteredCommands = [...dynamicCommands, ...commands].filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setQuery('')
        setSelectedIndex(0)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle arrow key and enter key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (allFilteredCommands.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % allFilteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + allFilteredCommands.length) % allFilteredCommands.length)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = allFilteredCommands[selectedIndex]
      if (selected) {
        triggerCommand(selected)
      }
    }
  }

  const triggerCommand = (cmd: CommandItem) => {
    if (cmd.href) {
      router.push(cmd.href)
    } else if (cmd.action) {
      cmd.action()
    }
    setIsOpen(false)
  }

  if (!isOpen) return (
    // Tiny floating keyboard helper in top right corner of layout for discoverability
    <div className="hidden lg:flex items-center gap-1.5 fixed bottom-6 right-6 px-3.5 py-2.5 rounded-2xl bg-[#0B1D2E]/90 text-white border border-[#C5A059]/20 shadow-xl z-40 select-none backdrop-blur-xs">
      <span className="text-[10px] font-bold text-slate-400">Search Console</span>
      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#C5A059] font-mono text-[10px] font-black border border-white/10">Ctrl</kbd>
      <span className="text-[10px] text-slate-400 font-bold">+</span>
      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#C5A059] font-mono text-[10px] font-black border border-white/10">K</kbd>
    </div>
  )

  return (
    <div 
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) setIsOpen(false)
      }}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center pt-24 z-50 animate-fade-in"
    >
      <div className="bg-[#0B1D2E] border border-[#C5A059]/30 rounded-3xl w-full max-w-2xl h-fit overflow-hidden shadow-2xl flex flex-col mx-4 select-none">
        
        {/* Search header bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#C5A059]/10">
          <Search className="h-5 w-5 text-[#C5A059]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type page name or 'VAL-xxxx' to jump to submission..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white border-0 outline-0 focus:ring-0 focus:outline-none placeholder-slate-500 text-base"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Results view */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {allFilteredCommands.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching pages or action shortcuts found.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Group items by Category */}
              {['Pages', 'Actions'].map(category => {
                const items = allFilteredCommands.filter(c => c.category === category)
                if (items.length === 0) return null

                return (
                  <div key={category} className="space-y-1.5">
                    <span className="text-[10px] font-black tracking-widest text-[#C5A059]/60 block px-2.5 uppercase pt-2">
                      {category}
                    </span>
                    {items.map((cmd) => {
                      const overallIndex = allFilteredCommands.findIndex(c => c.id === cmd.id)
                      const isSelected = overallIndex === selectedIndex
                      const Icon = cmd.icon

                      return (
                        <div
                          key={cmd.id}
                          onClick={() => triggerCommand(cmd)}
                          onMouseEnter={() => setSelectedIndex(overallIndex)}
                          className={cn(
                            'flex items-center justify-between px-3 py-3 rounded-2xl cursor-pointer transition-all duration-150',
                            isSelected 
                              ? 'bg-[#14452F] text-white shadow-md'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn('h-4.5 w-4.5 flex-shrink-0', isSelected ? 'text-[#C5A059]' : 'text-slate-450')} />
                            <span className="text-sm font-semibold">{cmd.label}</span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5 pr-1">
                              Jump <CornerDownLeft className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-6 py-3 border-t border-[#C5A059]/10 bg-[#071421]/60 flex justify-between text-[10px] text-slate-400 font-bold">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>Enter Select</span>
            <span>Esc Close</span>
          </div>
          <span>Polaris Command Engine</span>
        </div>

      </div>
    </div>
  )
}
