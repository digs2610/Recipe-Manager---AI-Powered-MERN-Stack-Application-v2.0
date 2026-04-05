import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const FloatingEmoji = ({ position, emoji, speed = 1 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2;
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        ref={ref}
        position={position}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {emoji}
      </Text>
    </Float>
  );
};

const FloatingShape = ({ position, color, scale = 1 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.6}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const Particles = () => {
  const points = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#06b6d4" transparent opacity={0.6} />
    </points>
  );
};

const GlowingOrb = ({ position, color }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0.3}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      <Particles />
      
      <FloatingShape position={[-3, 2, -2]} color="#06b6d4" scale={0.8} />
      <FloatingShape position={[3, -1, -3]} color="#8b5cf6" scale={1} />
      <FloatingShape position={[0, 3, -4]} color="#f59e0b" scale={0.6} />
      
      <GlowingOrb position={[-2, -2, -5]} color="#06b6d4" />
      <GlowingOrb position={[2, 1, -6]} color="#8b5cf6" />
      <GlowingOrb position={[0, -3, -4]} color="#f59e0b" />
      
      <FloatingEmoji position={[-4, 1, -2]} emoji="🍕" speed={1} />
      <FloatingEmoji position={[4, 0, -3]} emoji="🍜" speed={1.2} />
      <FloatingEmoji position={[2, 2, -4]} emoji="🥗" speed={0.8} />
      <FloatingEmoji position={[-2, -1, -5]} emoji="🍰" speed={1.1} />
    </>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroScene;