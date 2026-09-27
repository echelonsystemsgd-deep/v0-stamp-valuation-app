import type { MetadataRoute } from 'next'
import { BUSINESS_CONFIG } from '@/data/business'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/worker/',
          '/api/',
          '/(auth)/',
          '/login',
          '/reset-password',
          '/unauthorized',
        ],
      },
    ],
    sitemap: `${BUSINESS_CONFIG.siteUrl}/sitemap.xml`,
  }
}
