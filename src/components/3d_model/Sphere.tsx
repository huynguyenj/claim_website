import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import * as THREE from "three";
import logoFpt from "../../assets/logowebsite.png"
import CanvasLoad from "./CanvasLoad";
import { OrbitControls } from "@react-three/drei";
function Sphere() {
      
      const meshRef = useRef<THREE.Mesh | null>(null);
      const texture = useLoader(THREE.TextureLoader,logoFpt)
      useFrame(()=>{
      //      console.log(state.mouse)
            if(meshRef.current){
                  
                  meshRef.current.rotation.y  += 0.01;
                  // meshRef.current.rotation.x += state.mouse.x * 0.01;
            }
      })
  return (
      <mesh ref={meshRef} scale={1.5}>
            <sphereGeometry args={[1,64,32]}/>
            <meshBasicMaterial map={texture}/>
      </mesh>
)
}

function CanvasSphere(){

      return (
        <Canvas
            camera={{position:[0,0,7], fov:40}}
        >
       <Suspense fallback={<CanvasLoad/>}>
          <Sphere /> 
          <OrbitControls enableDamping/>
       </Suspense>
        </Canvas>
      );
    }

export default CanvasSphere