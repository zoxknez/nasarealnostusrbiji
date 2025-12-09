'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'

export function SpaceBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Sphere args={[1, 100, 200]} scale={2.4}>
          <MeshDistortMaterial
            color="#3b82f6"
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0}
          />
        </Sphere>
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-blue-950/80 to-slate-900/90" />
    </div>
  )
}
