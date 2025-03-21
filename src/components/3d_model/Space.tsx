import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CanvasLoad from "./CanvasLoad";


function Space() {
  const space = useGLTF("/3D_Space/scene.gltf");
  
  return (
    <mesh scale={[5, 6, 5]} position={[-8, -8, 8]} rotation={[0, 0, 0]}>
      <primitive object={space.scene} />
    </mesh>
  );
}
const SpaceCanvas = () => {
  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 4, 10], fov: 45 }}
      gl={{ preserveDrawingBuffer: true }}
    >
    <Suspense fallback={<CanvasLoad/>}>

      <OrbitControls
        enableZoom={false}
        minDistance={0}
        maxDistance={12}
        enableDamping={true}
        autoRotate
        autoRotateSpeed={0.7}
      />
    </Suspense>
      <Space />
      <Preload all />
    </Canvas>
  );
};
export default SpaceCanvas;