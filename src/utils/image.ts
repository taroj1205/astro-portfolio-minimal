export type SizesPreset = 'full' | 'content' | 'thumbnail'

export const DEFAULT_WIDTHS: number[] = [
  320, 480, 640, 768, 1024, 1280, 1536, 1920,
]

export function buildSizes(preset: SizesPreset, containerMaxPx = 1200): string {
  if (preset === 'full') {
    return '100vw'
  }

  if (preset === 'thumbnail') {
    return '(max-width: 768px) 50vw, 300px'
  }

  return `(max-width: 768px) 100vw, ${containerMaxPx}px`
}

export function computeResponsiveWidths(
  intrinsicWidth: number,
  baseWidths: number[] = DEFAULT_WIDTHS
): number[] {
  const filtered = baseWidths.filter(width => width <= intrinsicWidth)
  const ensured = filtered.length > 0 ? filtered : [intrinsicWidth]
  if (!ensured.includes(intrinsicWidth)) {
    ensured.push(intrinsicWidth)
  }
  const uniqueSorted = Array.from(new Set(ensured)).sort((a, b) => a - b)
  return uniqueSorted
}
