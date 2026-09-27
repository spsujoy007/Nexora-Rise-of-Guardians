import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useGuardianStore } from '@/store/useGuardianStore'
import { computeCityHealth } from '@/lib/cityHealth'
import { Chip } from '@/components/ui/Chip'
import { cn } from '@/lib/utils'

// Deterministic PRNG so the skyline layout is stable between renders
// instead of reshuffling every time React re-renders the component.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GRID = 7
const SPACING = 2.4

export function GuardianCityScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reports = useGuardianStore((s) => s.reports)
  const dailyMissions = useGuardianStore((s) => s.dailyMissions)
  const [ready, setReady] = useState(false)

  const health = computeCityHealth(reports)
  const completedToday = dailyMissions.filter((m) => m.completed).length

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    setReady(false)

    const scene = new THREE.Scene()
    const smogColor = new THREE.Color('#4a3f35')
    const clearColor = new THREE.Color('#0b1120')
    const fogColor = smogColor.clone().lerp(clearColor, health.index)
    scene.fog = new THREE.Fog(fogColor, 10, 34)

    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(15, 13, 15)
    camera.lookAt(0, 1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enablePan = false
    controls.minDistance = 12
    controls.maxDistance = 26
    controls.maxPolarAngle = Math.PI / 2.15

    // ---- lighting ----
    scene.add(new THREE.AmbientLight('#2F6FF0', 0.5))
    const dirLight = new THREE.DirectionalLight('#EAF2FF', 0.8)
    dirLight.position.set(8, 14, 6)
    scene.add(dirLight)
    const coreLight = new THREE.PointLight('#39FF9E', 3, 14)
    coreLight.position.set(0, 3, 0)
    scene.add(coreLight)

    // ---- ground ----
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(15, 48),
      new THREE.MeshStandardMaterial({ color: '#0b1120', roughness: 1 })
    )
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
    const grid = new THREE.GridHelper(30, 30, '#1E2A3F', '#1E2A3F')
    const gridMat = grid.material as THREE.Material
    gridMat.transparent = true
    gridMat.opacity = 0.35
    scene.add(grid)

    // ---- skyline, driven by real city health ----
    const rand = mulberry32(1337)
    const cityGroup = new THREE.Group()
    const danger = new THREE.Color('#FF4557')
    const amber = new THREE.Color('#FFB020')
    const neon = new THREE.Color('#39FF9E')
    const blue = new THREE.Color('#2F6FF0')

    for (let x = 0; x < GRID; x++) {
      for (let z = 0; z < GRID; z++) {
        const px = (x - (GRID - 1) / 2) * SPACING
        const pz = (z - (GRID - 1) / 2) * SPACING
        if (Math.hypot(px, pz) < 1.6) continue // keep the center clear for the Guardian Core

        const jitter = rand()
        const buildingHealth = Math.max(0, Math.min(1, health.index + (jitter - 0.5) * 0.5))
        const h = 0.6 + rand() * 3.4 * (0.4 + buildingHealth * 0.8)

        const color =
          buildingHealth < 0.35
            ? danger.clone().lerp(amber, buildingHealth / 0.35)
            : buildingHealth < 0.7
              ? amber.clone().lerp(blue, (buildingHealth - 0.35) / 0.35)
              : blue.clone().lerp(neon, (buildingHealth - 0.7) / 0.3)

        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: buildingHealth > 0.55 ? 0.35 : 0.05,
          roughness: 0.5,
          metalness: 0.15,
        })
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.9 + rand() * 0.3, h, 0.9 + rand() * 0.3), mat)
        mesh.position.set(px, h / 2, pz)
        cityGroup.add(mesh)
      }
    }
    scene.add(cityGroup)

    // ---- Guardian Core beacon — pulses with today's mission activity ----
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.65, 1),
      new THREE.MeshStandardMaterial({
        color: '#39FF9E',
        emissive: '#39FF9E',
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.3,
      })
    )
    core.position.set(0, 2.1, 0)
    scene.add(core)

    // ---- rising particles — represent live report/resolution activity ----
    const particleCount = 18 + Math.round(health.resolvedRatio * 24)
    const particleGeo = new THREE.OctahedronGeometry(0.07)
    const particleMat = new THREE.MeshBasicMaterial({ color: '#39FF9E' })
    const particles: { mesh: THREE.Mesh; speed: number; offset: number }[] = []
    for (let i = 0; i < particleCount; i++) {
      const mesh = new THREE.Mesh(particleGeo, particleMat)
      const r = 2 + rand() * 9
      const angle = rand() * Math.PI * 2
      mesh.position.set(Math.cos(angle) * r, rand() * 4, Math.sin(angle) * r)
      cityGroup.add(mesh)
      particles.push({ mesh, speed: 0.4 + rand() * 0.6, offset: rand() * 10 })
    }

    let frameId = 0
    const clock = new THREE.Clock()
    const animate = () => {
      const t = clock.getElapsedTime()
      core.rotation.y = t * 0.6
      core.rotation.x = t * 0.3
      core.scale.setScalar(1 + Math.sin(t * 2) * 0.06 + completedToday * 0.03)
      particles.forEach((p) => {
        p.mesh.position.y = ((t * p.speed + p.offset) % 4) + 0.1
      })
      controls.update()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()
    setReady(true)

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      controls.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.geometry !== particleGeo) {
          obj.geometry.dispose()
          const material = obj.material
          if (Array.isArray(material)) material.forEach((m) => m.dispose())
          else material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    }
    // Rebuild the scene when the underlying data that drives its visuals changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [health.index, health.resolvedRatio, completedToday])

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-line bg-surface"
      >
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-mist text-sm">
            Rendering Guardian City…
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Chip tone="neon">● LIVE 3D CITY MODEL</Chip>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-mist bg-void/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-line">
          <span>City Health Index</span>
          <span className={cn('font-mono', health.index > 0.6 ? 'text-neon' : health.index > 0.35 ? 'text-amber' : 'text-danger')}>
            {Math.round(health.index * 100)}%
          </span>
        </div>
      </div>
      <p className="text-xs text-mist mt-2">
        Rendered live from {reports.length} community reports — buildings clear from smog-gray to neon-green as your
        city's resolved-report ratio climbs. Drag to rotate, scroll to zoom.
      </p>
    </div>
  )
}
