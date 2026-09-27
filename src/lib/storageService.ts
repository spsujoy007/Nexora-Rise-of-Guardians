// ============================================================
// Photo/video hosting for report submissions, via Cloudinary's
// unsigned upload API. Chosen over Firebase Storage because Storage
// requires the paid Blaze plan even for near-zero usage (as of Feb 2026),
// while Cloudinary's free tier (25 monthly credits, ~25GB) needs no
// credit card at all — plenty for a hackathon/early-stage app.
//
// Setup (see GO_LIVE_GUIDE.md for full steps):
//   1. Sign up free at cloudinary.com (Google/GitHub/email, no card)
//   2. Dashboard → copy your "Cloud name"
//   3. Settings → Upload → Upload presets → Add upload preset →
//      set Signing Mode to "Unsigned" → copy its name
//   4. Put both into frontend/.env as VITE_CLOUDINARY_CLOUD_NAME and
//      VITE_CLOUDINARY_UPLOAD_PRESET
//
// "Unsigned" is what makes this safe to call directly from the browser
// with no server involved and no secret key exposed — the upload preset
// itself defines what's allowed (file size/type limits, folder, etc.),
// configurable in the Cloudinary console.
// ============================================================

/** Uploads a report photo/video to Cloudinary and returns its public, permanent URL. */
export async function uploadReportMedia(file: File, reportId: string): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured — check frontend/.env')
  }

  const isVideo = file.type.startsWith('video/')
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? 'video' : 'image'}/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'nexora-reports')
  formData.append('public_id', reportId)

  const res = await fetch(endpoint, { method: 'POST', body: formData })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Cloudinary upload failed: ${res.status} ${body}`)
  }

  const data = await res.json()
  return data.secure_url as string
}
