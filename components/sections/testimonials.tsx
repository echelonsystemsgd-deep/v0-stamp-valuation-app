'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
    content: 'Inherited a large collection and didn\'t know where to start. UK Stamp Valuations guided me through the entire process. Their expertise is evident and their service is stellar.',
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
    <section className="py-20 bg-slate-50" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="testimonials-heading" className="text-primary">What Our Clients Say</h2>
          <p className="mt-4 text-xl text-muted-foreground font-medium">
            Join hundreds of satisfied collectors who have trusted us with their valuations.
          </p>
        </div>

        <div className="px-12">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:col-span-1 lg:basis-1/2 xl:basis-1/3 pl-6">
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                        ))}
                      </div>
                      
                      <div className="relative mb-6">
                        <Quote className="absolute -top-2 -left-2 w-10 h-10 text-forest-green/10 -z-10" />
                        <p className="text-lg italic text-slate-700 leading-relaxed relative z-10">
                          "{testimonial.content}"
                        </p>
                      </div>

                      <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-6">
                        <Avatar className="h-12 w-12 border-2 border-forest-green/20">
                          <AvatarFallback className="bg-forest-green text-white font-bold">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-serif font-bold text-primary">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 bg-white hover:bg-forest-green hover:text-white transition-colors" />
            <CarouselNext className="-right-12 bg-white hover:bg-forest-green hover:text-white transition-colors" />
          </Carousel>
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <span className="flex">
               {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </span>
            <span className="text-sm font-bold text-slate-800">4.9/5 Average Rating on Trustpilot</span>
          </div>
        </div>
      </div>
    </section>
  )
}
