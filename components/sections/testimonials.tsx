'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Robert Henderson',
    location: 'Surrey, UK',
    content: 'The valuation was remarkably thorough and much higher than my local dealer offered. Professional, insured, and very quick payment. Highly recommended for any collector.',
    rating: 5,
    initials: 'RH'
  },
  {
    name: 'Elizabeth Thompson',
    location: 'Edinburgh, Scotland',
    content: 'Inherited a large collection and didn\'t know where to start. Sell Your Stamps UK guided me through the entire process. Their expertise is evident and their service is stellar.',
    rating: 5,
    initials: 'ET'
  },
  {
    name: 'David Millington',
    location: 'Cardiff, Wales',
    content:
      'Fast, efficient, and transparent. The initial guidance was clear, and the final appraisal was better than I expected. Truly experts in their field.',
    rating: 5,
    initials: 'DM'
  },
  {
    name: 'Susan Wright',
    location: 'London, UK',
    content: 'I was nervous about sending my stamps through the post, but the insured shipping process was seamless. I received my payment within 5 days of them receiving my collection.',
    rating: 5,
    initials: 'SW'
  }
]

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#F9F7F2] border-y border-border/40 paper-texture" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 animate-fade-in-up opacity-0">
          <h2 id="testimonials-heading" className="text-primary font-serif">Trust & Excellence</h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
            Join the hundreds of satisfied collectors who have secured fair, professional valuations for their heritage collections.
          </p>
        </div>

        <div className="px-0 md:px-12">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:col-span-1 lg:basis-1/2 xl:basis-1/3 pl-4 md:pl-6 h-full py-4">
                  <div className="stamp-edge h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="p-2 sm:p-3 md:p-4 flex flex-col h-full">
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-heritage-gold text-heritage-gold" />
                        ))}
                      </div>
                      
                      <div className="relative mb-4 flex-grow">
                        <Quote className="absolute -top-1 -left-1 w-6 h-6 md:w-8 md:h-8 text-forest-green/10 -z-10" />
                        <p className="text-sm md:text-base italic text-slate-700 leading-relaxed relative z-10">
                          "{testimonial.content}"
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                        <Avatar className="h-10 w-10 border-2 border-forest-green/20">
                          <AvatarFallback className="bg-forest-green text-white font-bold text-xs">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-serif font-bold text-primary text-sm">{testimonial.name}</p>
                          <p className="text-[12px] text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white hover:bg-forest-green hover:text-white transition-colors" />
            <CarouselNext className="hidden md:flex -right-12 bg-white hover:bg-forest-green hover:text-white transition-colors" />
          </Carousel>
        </div>
        
        <div className="mt-10 md:mt-16 text-center flex flex-col items-center gap-5 md:gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <span className="flex">
               {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </span>
            <span className="text-sm font-bold text-slate-800">4.9/5 Average Rating on Trustpilot</span>
          </div>
          <Button asChild size="lg" className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-11 md:h-14 px-6 md:px-8 text-base md:text-lg">
            <Link href="/sell-your-stamps">Sell Your Stamps</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
