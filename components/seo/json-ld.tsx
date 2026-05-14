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
      name: 'Sell Your Stamps UK',
      image: 'https://sellyourstamps.co.uk/logo.png',
      '@id': 'https://sellyourstamps.co.uk',
      url: 'https://sellyourstamps.co.uk',
      telephone: '+44 01234 567890',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Philatelic Way',
        addressLocality: 'London',
        postalCode: 'SW1A 1AA',
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
