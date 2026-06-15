import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

function Rig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.mouse.x * Math.PI) / 12, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.mouse.y * Math.PI) / 12, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function NebulaCloud() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.02;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <planeGeometry args={[28, 18]} />
      <meshBasicMaterial
        color={'#5b21b6'}
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function NebulaCloudPink() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = -clock.getElapsedTime() * 0.015;
    }
  });
  return (
    <mesh ref={ref} position={[3, 1, -7]}>
      <planeGeometry args={[20, 14]} />
      <meshBasicMaterial
        color={'#ec4899'}
        transparent
        opacity={0.1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#0a0418']} />
        <fog attach="fog" args={['#1a0533', 3, 14]} />
        <ambientLight intensity={0.25} />

        {/* Soft nebula clouds */}
        <NebulaCloud />
        <NebulaCloudPink />

        {/* Deep starfield — two layers, near and far */}
        <Stars radius={50} depth={40} count={2500} factor={3} saturation={0.2} fade speed={0.8} />
        <Stars radius={150} depth={80} count={5000} factor={5} saturation={0} fade speed={0.4} />

        <Rig />
      </Canvas>
    </div>
  );
}
