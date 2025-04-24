"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

// Individual voxel (3D pixel) component
function Voxel({
  position,
  color,
  speed,
  rotationSpeed,
}: {
  position: [number, number, number]
  color: string
  speed: [number, number, number]
  rotationSpeed: [number, number, number]
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)

  useFrame(() => {
    if (mesh.current) {
      // Move the voxel
      mesh.current.position.x += speed[0]
      mesh.current.position.y += speed[1]
      mesh.current.position.z += speed[2]

      // Rotate the voxel
      mesh.current.rotation.x += rotationSpeed[0]
      mesh.current.rotation.y += rotationSpeed[1]
      mesh.current.rotation.z += rotationSpeed[2]

      // Reset position when out of bounds
      if (mesh.current.position.y > 10) mesh.current.position.y = -10
      if (mesh.current.position.y < -10) mesh.current.position.y = 10
      if (mesh.current.position.x > 10) mesh.current.position.x = -10
      if (mesh.current.position.x < -10) mesh.current.position.x = 10
      if (mesh.current.position.z > 10) mesh.current.position.z = -10
      if (mesh.current.position.z < -10) mesh.current.position.z = 10
    }
  })

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Scene component with multiple voxels
function VoxelScene() {
  const { resolvedTheme } = useTheme()
  const [voxels, setVoxels] = useState<
    Array<{
      id: number
      position: [number, number, number]
      color: string
      speed: [number, number, number]
      rotationSpeed: [number, number, number]
    }>
  >([])

  useEffect(() => {
    // Generate random voxels
    const newVoxels = []
    const voxelCount = 50 // Adjust based on performance

    for (let i = 0; i < voxelCount; i++) {
      // Generate colors based on theme
      const baseColor =
        resolvedTheme === "dark"
          ? new THREE.Color(0x3b82f6) // Blue for dark theme
          : new THREE.Color(0x60a5fa) // Lighter blue for light theme

      // Add some variation to the color
      const hsl = { h: 0, s: 0, l: 0 }
      baseColor.getHSL(hsl)
      const color = new THREE.Color().setHSL(
        hsl.h + (Math.random() * 0.1 - 0.05), // Slight hue variation
        hsl.s * (0.8 + Math.random() * 0.4), // Saturation variation
        hsl.l * (0.8 + Math.random() * 0.4), // Lightness variation
      )

      newVoxels.push({
        id: i,
        position: [
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 10 - 15, // Push back into the scene
        ],
        color: color.getStyle(),
        speed: [(Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01],
        rotationSpeed: [(Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01],
      })
    }

    setVoxels(newVoxels)
  }, [resolvedTheme])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {voxels.map((voxel) => (
        <Voxel
          key={voxel.id}
          position={voxel.position}
          color={voxel.color}
          speed={voxel.speed}
          rotationSpeed={voxel.rotationSpeed}
        />
      ))}
    </>
  )
}

export function PixelBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <VoxelScene />
      </Canvas>
    </div>
  )
}
