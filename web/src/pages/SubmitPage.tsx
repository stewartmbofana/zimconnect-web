import { useState, useRef } from 'react'
import { CheckCircle, Upload, Loader2, AlertCircle } from 'lucide-react'
import { ZIM_CITIES, CATEGORIES, type CityId, type CategoryId } from '../data/constants'
import { useSubmission, type SubmissionDraft } from '../hooks/useSubmission'
import { compressImages } from '../utils/imageCompressor'
import { normalizeZimbabweanPhone } from '../utils/phone'

type Step = 1 | 2 | 3 | 4

const STEP_LABELS = ['Category', 'Details & Price', 'Photos', 'Contact']

export function SubmitPage() {
  const { submit, loading, error, submittedId } = useSubmission()

  // Form state
  const [step, setStep] = useState<Step>(1)
  const [category, setCategory] = useState<CategoryId>('marketplace')
  const [locationId, setLocationId] = useState<CityId>('harare')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceUSD, setPriceUSD] = useState('')
  const [priceZIG, setPriceZIG] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [submitterPhone, setSubmitterPhone] = useState('')
  const [submitterName, setSubmitterName] = useState('')
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handlePhotoSelect(files: FileList | null) {
    if (!files || files.length === 0) return
    setCompressing(true)
    try {
      const fileArr = Array.from(files).slice(0, 5) // max 5 photos
      const compressed = await compressImages(fileArr)
      setPhotos(compressed.map((c) => c.file))
      setPhotoPreviews(compressed.map((c) => c.url))
    } finally {
      setCompressing(false)
    }
  }

  async function handleSubmit() {
    const draft: SubmissionDraft = {
      title,
      description,
      category,
      locationId,
      priceUSD: priceUSD ? parseFloat(priceUSD) : undefined,
      priceZIG: priceZIG ? parseFloat(priceZIG) : undefined,
      photos,
      submitterPhone,
      submitterName: submitterName || undefined,
    }
    await submit(draft)
  }

  if (submittedId) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle className="text-brand-emerald mx-auto mb-4" size={56} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
        <p className="text-gray-600 mb-2">
          Your listing is pending review by our moderators.
        </p>
        <p className="text-xs text-gray-400">Reference: {submittedId}</p>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit a Listing</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => {
          const s = (i + 1) as Step
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                step === s ? 'bg-brand-emerald text-white' :
                step > s ? 'bg-green-100 text-brand-emerald' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-xs hidden sm:block ${step === s ? 'text-brand-emerald font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
            </div>
          )
        })}
      </div>

      {/* Step 1: Category & Location */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value as CityId)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              {ZIM_CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors ${
                    category === cat.id
                      ? 'border-brand-emerald bg-emerald-50 text-brand-emerald'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-brand-emerald text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Details & Pricing */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fresh tomatoes, 5kg bags"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your listing…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <input
                type="number"
                value={priceUSD}
                onChange={(e) => setPriceUSD(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (ZiG)</label>
              <input
                type="number"
                value={priceZIG}
                onChange={(e) => setPriceZIG(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!title.trim()}
              className="flex-1 bg-brand-emerald text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Photos */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos <span className="text-gray-400 font-normal">(up to 5 — compressed to &lt;200KB WebP)</span>
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-brand-emerald transition-colors"
            >
              {compressing ? (
                <Loader2 className="animate-spin text-brand-emerald" size={24} />
              ) : (
                <Upload className="text-gray-300" size={24} />
              )}
              <span className="text-sm text-gray-500">
                {compressing ? 'Compressing…' : 'Tap to select photos'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotoSelect(e.target.files)}
            />
          </div>

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {photoPreviews.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              ← Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 bg-brand-emerald text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Contact & Submit */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number * <span className="text-gray-400 font-normal">(Zimbabwe format)</span>
            </label>
            <input
              type="tel"
              value={submitterPhone}
              onChange={(e) => setSubmitterPhone(e.target.value)}
              placeholder="077 123 4567"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            />
            {submitterPhone && (
              <p className="text-xs text-gray-400 mt-1">
                Normalized: {normalizeZimbabweanPhone(submitterPhone)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="e.g. Tatenda M."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error.message}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !submitterPhone.trim()}
              className="flex-1 bg-brand-emerald text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? 'Submitting…' : 'Submit Listing'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
