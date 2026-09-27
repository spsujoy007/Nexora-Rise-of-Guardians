import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, MapPin, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AIAnalysisResult } from './AIAnalysisResult'
import { analyzeReport } from '@/lib/aiAnalysis'
import { uploadReportMedia } from '@/lib/storageService'
import { isCloudinaryConfigured } from '@/lib/firebase'
import { useGuardianStore } from '@/store/useGuardianStore'
import type { AIAnalysis, Report } from '@/lib/types'

type Stage = 'form' | 'analyzing' | 'result' | 'submitted'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ReportForm() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [stage, setStage] = useState<Stage>('form')
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const guardian = useGuardianStore((s) => s.guardian)
  const addReport = useGuardianStore((s) => s.addReport)
  const progressMission = useGuardianStore((s) => s.progressMission)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function detectLocation() {
    setLocating(true)
    if (!navigator.geolocation) {
      setTimeout(() => {
        setLocation('22.3072° N, 73.1812° E (approx.)')
        setLocating(false)
      }, 900)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`)
        setLocating(false)
      },
      () => {
        setLocation('22.3072° N, 73.1812° E (approx.)')
        setLocating(false)
      },
      { timeout: 3000 }
    )
  }

  async function handleSubmit() {
    setStage('analyzing')
    // For live Gemini, the image travels as a base64 data URL. In mock
    // mode this conversion still happens but is simply unused.
    const imageDataUrl = imageFile ? await fileToDataUrl(imageFile).catch(() => undefined) : undefined
    const result = await analyzeReport(
      description || 'Unmarked pollution incident reported near residential zone',
      imageDataUrl
    )
    setAnalysis(result)
    setStage('result')
  }

  async function handleConfirm() {
    if (!analysis) return
    setSubmitting(true)

    const reportId = `RPT-${Math.floor(2300 + Math.random() * 900)}`
    let imageUrl = imagePreview || 'https://picsum.photos/seed/new-report/640/420'

    if (isCloudinaryConfigured && imageFile) {
      try {
        imageUrl = await uploadReportMedia(imageFile, reportId)
      } catch (err) {
        console.error('Cloudinary upload failed, keeping local preview URL:', err)
      }
    }

    const report: Report = {
      id: reportId,
      guardianId: guardian.id,
      guardianName: guardian.name,
      guardianAvatar: guardian.avatar,
      title: description.slice(0, 60) || 'New pollution report',
      description,
      imageUrl,
      lat: 22.3072 + (Math.random() - 0.5) * 0.02,
      lng: 73.1812 + (Math.random() - 0.5) * 0.02,
      locationLabel: location ?? 'GPS location pending',
      timestamp: 'Just now',
      status: 'Pending',
      likes: 0,
      comments: 0,
      analysis,
    }
    await addReport(report)
    progressMission('d1')
    setSubmitting(false)
    setStage('submitted')
  }

  function reset() {
    setImageFile(null)
    setImagePreview(null)
    setDescription('')
    setLocation(null)
    setAnalysis(null)
    setStage('form')
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl glass p-5 sm:p-6 space-y-5">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-neon mb-1">New Field Report</p>
          <h2 className="text-xl font-semibold text-ice">File an Incident</h2>
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-line hover:border-guardian-blue/60 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden relative bg-surface-2"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <Camera className="text-mist" size={28} />
              <span className="text-sm text-mist">Upload photo or video evidence</span>
            </>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />

        <div>
          <label className="text-xs font-medium text-mist uppercase tracking-wide">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're seeing — smoke, garbage burning, water pollution, illegal dumping…"
            rows={4}
            className="w-full mt-1.5 rounded-xl bg-surface-2 border border-line px-3.5 py-2.5 text-sm text-ice placeholder:text-mist/50 focus:outline-none focus:border-guardian-blue/60 resize-none"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-2 border border-line px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-sm text-ice/90">
            <MapPin size={15} className="text-guardian-blue" />
            {location ?? 'Location not detected'}
          </div>
          <Button variant="outline" size="sm" onClick={detectLocation} disabled={locating}>
            {locating ? <Loader2 size={13} className="animate-spin" /> : 'Detect GPS'}
          </Button>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={stage === 'analyzing' || (!imagePreview && !description)}
        >
          {stage === 'analyzing' ? (
            <>
              <Loader2 size={16} className="animate-spin" /> AI Analyzing Report…
            </>
          ) : (
            <>
              <Sparkles size={16} /> Submit for AI Analysis
            </>
          )}
        </Button>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {stage === 'form' && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full min-h-[320px] rounded-2xl glass flex flex-col items-center justify-center text-center p-8"
            >
              <Sparkles className="text-mist mb-3" size={28} />
              <p className="text-sm text-mist max-w-xs">
                Submit your report and Gemini will instantly classify severity, cause, health risk, and the
                recommended municipal response.
              </p>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full min-h-[320px] rounded-2xl glass flex flex-col items-center justify-center gap-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-guardian-blue/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-neon border-transparent animate-spin" />
              </div>
              <p className="text-sm text-mist">Running visual + contextual inference…</p>
            </motion.div>
          )}

          {stage === 'result' && analysis && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <AIAnalysisResult analysis={analysis} />
              <div className="flex gap-3">
                <Button variant="neon" className="flex-1" onClick={handleConfirm} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Submitting…
                    </>
                  ) : (
                    'Confirm & Submit to Municipality'
                  )}
                </Button>
                <Button variant="outline" onClick={reset} disabled={submitting}>
                  Discard
                </Button>
              </div>
            </motion.div>
          )}

          {stage === 'submitted' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full min-h-[320px] rounded-2xl glass-strong glow-neon flex flex-col items-center justify-center text-center p-8 gap-3"
            >
              <CheckCircle2 className="text-neon" size={36} />
              <p className="font-display text-lg text-ice">Report Dispatched</p>
              <p className="text-sm text-mist max-w-xs">
                +120 XP · +25 Eco Coins awarded. Ward officer notified. Track status from your profile.
              </p>
              <Button variant="outline" size="sm" onClick={reset}>
                File Another Report
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
