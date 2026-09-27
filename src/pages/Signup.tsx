import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { useGuardianStore } from '@/store/useGuardianStore'
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase'
import { ensureGuardianDoc, updateGuardianProfile } from '@/lib/firestoreService'

const AVATAR_SEEDS = ['aarav', 'nova', 'orbit', 'zephyr', 'sable', 'kestrel', 'orion', 'lyra']
const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=1e2a3f,101828`

export function Signup() {
  const navigate = useNavigate()
  const login = useGuardianStore((s) => s.login)
  const loginWithFirebase = useGuardianStore((s) => s.loginWithFirebase)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'auth' | 'avatar'>('auth')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0])
  const [uid, setUid] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  async function handleGoogleLogin() {
    setLoading(true)

    if (isFirebaseConfigured && auth) {
      // Live mode: real Firebase Google sign-in.
      try {
        const result = await signInWithPopup(auth, googleProvider)
        const user = result.user
          setUser(user)
        await ensureGuardianDoc(
          user.uid,
          user.displayName ?? 'Guardian',
          user.photoURL ?? avatarUrl(AVATAR_SEEDS[0])
        )
        setUid(user.uid)
        setStep('avatar')
      } catch (err) {
        console.error('Firebase sign-in failed:', err)
      } finally {
        setLoading(false)
      }
      return
    }

    // Mock mode — no Firebase configured, simulate the same flow so the
    // rest of the app is fully demoable with zero setup.
    setTimeout(() => {
      setLoading(false)
      setStep('avatar')
    }, 1200)
  }

  async function finishSetup() {
    const finalAvatar = selectedAvatar === 'google' && user?.photoURL ? user.photoURL : avatarUrl(selectedAvatar)
    if (isFirebaseConfigured && uid) {
      await updateGuardianProfile(uid, { avatar: finalAvatar })
      loginWithFirebase(uid)
    } else {
      useGuardianStore.setState((s: any) => ({ guardian: { ...s.guardian, avatar: finalAvatar } }))
      login()
    }
    navigate('/dashboard')
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
                  <h2 className="text-lg font-semibold text-ice">Join the Guardians</h2>
                  <p className="text-sm text-mist mt-1">Sign up to start protecting your city</p>
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Signing up…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#fff" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989z"/>
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-mist text-center">
                  {isFirebaseConfigured
                    ? 'Real Firebase Google sign-up — your account will be saved to Firestore.'
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
                <Button variant="neon" size="lg" className="w-full" onClick={finishSetup}>
                  Begin Guardian Duty
                </Button>
              </>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}


