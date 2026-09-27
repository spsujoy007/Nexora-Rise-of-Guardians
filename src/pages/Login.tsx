import { useState } from 'react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { useGuardianStore } from '@/store/useGuardianStore'
import { isFirebaseConfigured } from '@/lib/firebase'
import { updateGuardianProfile } from '@/lib/firestoreService'
import useGoogleAuth from '@/hooks/useGoogleAuth'
const AVATAR_SEEDS = ['aarav', 'nova', 'orbit', 'zephyr', 'sable', 'kestrel', 'orion', 'lyra']

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=1e2a3f,101828`

export function Login() {
  const login = useGuardianStore((s) => s.login)
  const loginWithFirebase = useGuardianStore((s) => s.loginWithFirebase)
  const [step, setStep] = useState<'auth' | 'avatar'>('auth')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0])
  const [uid, setUid] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { GoogleAuthButton, user, error } = useGoogleAuth({ onSuccess: (user) => { setUid(user.uid); setStep('avatar'); } })

  function finishSetup() {
    setSubmitting(true)
    const finalAvatar = selectedAvatar === 'google' && user?.photoURL ? user.photoURL : avatarUrl(selectedAvatar)
    const authenticatedUid = uid ?? user?.uid

    if (isFirebaseConfigured && authenticatedUid) {
      loginWithFirebase(authenticatedUid)
      window.location.assign('/dashboard')
      void updateGuardianProfile(authenticatedUid, { avatar: finalAvatar }).catch((error) => {
        console.error('Could not save Guardian profile:', error)
      })
    } else {
      useGuardianStore.setState((s: any) => ({ guardian: { ...s.guardian, avatar: finalAvatar } }))
      login()
      window.location.assign('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center hud-grid px-4">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-guardian-blue/15 rounded-full blur-[130px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/nexora_logo.png" alt="Nexora Logo" className="h-10 w-auto object-contain mb-2" />
          
          <p className="text-sm text-mist mt-1">Rise of the Guardians</p>
        </div>

        <Card strong>
          <CardBody className="space-y-5">
            {step === 'auth' ? (
              <>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-ice">Welcome, future Guardian</h2>
                  <p className="text-sm text-mist mt-1">Sign in to start protecting your city</p>
                </div>
                
                <GoogleAuthButton></GoogleAuthButton>

                {error && <p className="text-xs text-danger text-center">{error}</p>}

                <p className="text-[11px] text-mist text-center">
                  {isFirebaseConfigured
                    ? 'Real Firebase Google sign-in — your account will be saved to Firestore.'
                    : 'Simulated Firebase Google Auth — connect your Firebase project to go live.'}
                </p>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-ice">Choose your avatar</h2>
                  <p className="text-sm text-mist mt-1">This is how other Guardians will recognize you</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAvatar('google')}
                    className={`rounded-xl p-1.5 border-2 transition-colors ${
                      selectedAvatar === 'google' ? 'border-neon glow-neon' : 'border-transparent hover:border-line'
                    }`}
                  >
                    {user?.photoURL ? (
                      <img src={user.photoURL} className="rounded-lg bg-surface-2 aspect-square object-cover w-full h-full" />
                    ) : (
                      <div className="rounded-lg bg-surface-2 aspect-square flex items-center justify-center text-[10px] text-mist text-center p-1">No Avatar</div>
                    )}
                  </motion.button>
                  {AVATAR_SEEDS.map((seed) => (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      key={seed}
                      onClick={() => setSelectedAvatar(seed)}
                      className={`rounded-xl p-1.5 border-2 transition-colors ${
                        selectedAvatar === seed ? 'border-neon glow-neon' : 'border-transparent hover:border-line'
                      }`}
                    >
                      <img src={avatarUrl(seed)} className="rounded-lg bg-surface-2 aspect-square object-cover w-full h-full" />
                    </motion.button>
                  ))}
                </div>
                <Button variant="neon" size="lg" className="w-full" onClick={finishSetup} disabled={submitting}>
                  {submitting ? 'Preparing your dashboard...' : 'Begin Guardian Duty'}
                </Button>
              </>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}
