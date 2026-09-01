import { describe, it, expect, vi, beforeEach } from 'vitest'
import { compressToWebP } from './imageCompressor'

// Mock browser-image-compression
vi.mock('browser-image-compression', () => ({
  default: vi.fn(),
}))

import imageCompression from 'browser-image-compression'

const mockCompress = vi.mocked(imageCompression)

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')

function makeFile(name: string, sizeBytes: number, type = 'image/jpeg'): File {
  const content = new Uint8Array(sizeBytes)
  return new File([content], name, { type })
}

describe('compressToWebP', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
  })

  it('calls imageCompression with WebP format and size limit', async () => {
    const input = makeFile('photo.jpg', 500_000)
    const outputFile = makeFile('photo.webp', 150_000, 'image/webp')
    mockCompress.mockResolvedValue(outputFile)

    await compressToWebP(input)

    expect(mockCompress).toHaveBeenCalledWith(input, expect.objectContaining({
      maxSizeMB: expect.any(Number),
      fileType: 'image/webp',
    }))
  })

  it('returns compressed file with correct sizeKb', async () => {
    const input = makeFile('photo.jpg', 500_000)
    const outputFile = makeFile('photo.webp', 196_608, 'image/webp') // 192KB
    mockCompress.mockResolvedValue(outputFile)

    const result = await compressToWebP(input)

    expect(result.sizeKb).toBe(192)
    expect(result.file).toBe(outputFile)
    expect(result.url).toBe('blob:mock-url')
  })

  it('returns an object URL for preview', async () => {
    const input = makeFile('photo.png', 300_000)
    const outputFile = makeFile('photo.webp', 100_000, 'image/webp')
    mockCompress.mockResolvedValue(outputFile)

    const result = await compressToWebP(input)

    expect(URL.createObjectURL).toHaveBeenCalledWith(outputFile)
    expect(result.url).toBe('blob:mock-url')
  })
})
