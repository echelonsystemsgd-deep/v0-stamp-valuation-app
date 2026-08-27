import Script from 'next/script'
import { BUSINESS_CONFIG } from '@/data/business'

export interface FAQItemSchema {
  question: string
  answer: string
}

export interface BreadcrumbItemSchema {
  name: string
  url: string
}

export interface ServiceSchemaData {
  name: string
  description: string
  providerName?: string
  areaServed?: string
}

interface JsonLdProps {
  type: 'LocalBusiness' | 'FAQPage' | 'Service' | 'BreadcrumbList' | 'Organization'
  data?: any
}

export function JsonLd({ type, data = {} }: JsonLdProps) {
  let schema: any = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  if (type === 'LocalBusiness' || type === 'Organization') {
    schema = {
      ...schema,
      '@type': 'ProfessionalService',
      name: BUSINESS_CONFIG.name,
      legalName: BUSINESS_CONFIG.legalName,
      description: BUSINESS_CONFIG.description,
      image: 'https://sellyourstamps.co.uk/opengraph-image.png',
      '@id': 'https://sellyourstamps.co.uk/#organization',
      url: 'https://sellyourstamps.co.uk',
      telephone: BUSINESS_CONFIG.phone,
      email: BUSINESS_CONFIG.email,
      priceRange: '££',
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS_CONFIG.address.street,
        addressLocality: BUSINESS_CONFIG.address.city,
        addressRegion: BUSINESS_CONFIG.address.region,
        postalCode: BUSINESS_CONFIG.address.postalCode,
        addressCountry: BUSINESS_CONFIG.address.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS_CONFIG.address.latitude,
        longitude: BUSINESS_CONFIG.address.longitude,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: BUSINESS_CONFIG.operatingHours.daysOfWeek,
          opens: BUSINESS_CONFIG.operatingHours.opens,
          closes: BUSINESS_CONFIG.operatingHours.closes,
        },
      ],
      areaServed: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      sameAs: Object.values(BUSINESS_CONFIG.socials).filter(Boolean),
      ...data,
    }
  } else if (type === 'Service') {
    schema = {
      ...schema,
      name: data.name || 'Philatelic Valuation & Stamp Purchasing',
      description: data.description || BUSINESS_CONFIG.description,
      provider: {
        '@type': 'ProfessionalService',
        name: BUSINESS_CONFIG.name,
        url: 'https://sellyourstamps.co.uk',
        telephone: BUSINESS_CONFIG.phone,
      },
      areaServed: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      serviceType: 'Stamp Appraisal and Buying',
      termsOfService: 'https://sellyourstamps.co.uk/terms',
      ...data,
    }
  } else if (type === 'FAQPage') {
    const items: FAQItemSchema[] = data.items || []
    schema = {
      ...schema,
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }
  } else if (type === 'BreadcrumbList') {
    const items: BreadcrumbItemSchema[] = data.items || []
    schema = {
      ...schema,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }

  return (
    <Script
      id={`json-ld-${type.toLowerCase()}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
