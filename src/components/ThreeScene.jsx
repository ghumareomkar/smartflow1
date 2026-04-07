import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Box, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

function FactoryCore({ isDark }) {
  const meshRef = useRef();
  const torusRef = useRef();
  const torus2Ref = useRef();

  const primaryColor = isDark ? '#6366f1' : '#4f46e5';
  const secondaryColor = isDark ? '#8b5cf6' : '#7c3aed';
  const tertiaryColor = isDark ? '#2dd4bf' : '#0d9488';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3;
      torusRef.current.rotation.z = t * 0.1;
    }
    if (torus2Ref.current) {
      torus2Ref.current.rotation.y = t * 0.25;
      torus2Ref.current.rotation.x = t * 0.15;
    }
  });

  return (
    <group>
      {/* Central sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.15}
            roughness={0.2}
            metalness={0.8}
            distort={0.25}
            speed={2}
            transparent
            opacity={isDark ? 0.85 : 0.7}
          />
        </Sphere>
      </Float>

      {/* Orbital ring 1 */}
      <Torus ref={torusRef} args={[2, 0.02, 16, 100]}>
        <meshStandardMaterial color={secondaryColor} emissive={secondaryColor} emissiveIntensity={0.5} transparent opacity={0.6} />
      </Torus>

      {/* Orbital ring 2 */}
      <Torus ref={torus2Ref} args={[2.5, 0.015, 16, 100]}>
        <meshStandardMaterial color={tertiaryColor} emissive={tertiaryColor} emissiveIntensity={0.4} transparent opacity={0.4} />
      </Torus>

      {/* Floating cubes */}
      {[...Array(8)].map((_, i) => (
        <FloatingCube key={i} index={i} isDark={isDark} />
      ))}

      {/* Particles */}
      <Particles isDark={isDark} />
    </group>
  );
}

function FloatingCube({ index, isDark }) {
  const ref = useRef();
  const angle = (index / 8) * Math.PI * 2;
  const radius = 3 + Math.random() * 0.5;
  const speed = 0.2 + Math.random() * 0.3;
  const size = 0.08 + Math.random() * 0.08;

  const colors = isDark
    ? ['#6366f1', '#34d399']
    : ['#4f46e5', '#059669'];

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(angle + t) * radius;
    ref.current.position.z = Math.sin(angle + t) * radius;
    ref.current.position.y = Math.sin(t * 2) * 0.5;
    ref.current.rotation.x = t;
    ref.current.rotation.y = t * 1.5;
  });

  const color = colors[index % 2];

  return (
    <Box ref={ref} args={[size, size, size]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.7}
      />
    </Box>
  );
}

function Particles({ isDark }) {
  const count = 200;
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={isDark ? '#6366f1' : '#4f46e5'} transparent opacity={isDark ? 0.5 : 0.35} sizeAttenuation />
    </points>
  );
}

export default function ThreeScene() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={isDark ? 0.3 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 0.8 : 0.6} color={isDark ? '#6366f1' : '#4f46e5'} />
        <pointLight position={[-10, -5, 5]} intensity={0.4} color={isDark ? '#8b5cf6' : '#7c3aed'} />
        <pointLight position={[0, -10, 0]} intensity={0.3} color={isDark ? '#2dd4bf' : '#0d9488'} />
        <FactoryCore isDark={isDark} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
