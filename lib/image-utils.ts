/**
 * Generates a base64-encoded SVG blur placeholder for use with next/image.
 * This creates a lightweight, solid-color placeholder with a subtle blur effect.
 *
 * @param width - The width of the placeholder (default: 1920)
 * @param height - The height of the placeholder (default: 1080)
 * @returns A base64-encoded data URL string suitable for next/image's blurDataURL prop
 */
export function getBlurPlaceholder(width: number = 1920, height: number = 1080): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <filter id="blur">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      <rect width="100%" height="100%" fill="#1a2744" filter="url(#blur)" />
    </svg>
  `.trim()

  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}
