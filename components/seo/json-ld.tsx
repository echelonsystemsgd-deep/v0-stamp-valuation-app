import Script from 'next/script'

interface JsonLdProps {
  type: 'LocalBusiness' | 'FAQPage' | 'Product'
  data: any
}

export function JsonLd({ type, data }: JsonLdProps) {
  let schema: any = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  if (type === 'LocalBusiness') {
    schema = {
      ...schema,
      name: 'UK Stamp Valuations',
      image: 'https://www.ukstampvaluations.co.uk/logo.png',
      '@id': 'https://www.ukstampvaluations.co.uk',
      url: 'https://www.ukstampvaluations.co.uk',
      telephone: '+44 (0) 20 1234 5678',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Philately House',
        addressLocality: 'London',
        postalCode: 'EC1A 1BB',
        addressCountry: 'GB',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.5074,
        longitude: -0.1278,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '09:00',
        closes: '17:30'
      },
      sameAs: [
        'https://www.facebook.com/ukstampvaluations',
        'https://www.twitter.com/ukstampvals'
      ]
    }
  }

  return (
    <Script
      id={`json-ld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
