import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three";
import logoFpt from "../../assets/logoFPT.png"
function Sphere() {
      
      const meshRef = useRef<THREE.Mesh | null>(null);
      const texture = useLoader(THREE.TextureLoader,logoFpt)
      useFrame((state)=>{
           console.log(state.mouse)
            if(meshRef.current){
                  // meshRef.current.position.x +=delta;
                  
                  meshRef.current.rotation.y = -state.mouse.y * Math.PI;
                  meshRef.current.rotation.x = state.mouse.x * Math.PI;


            }
      })
  return (
      <mesh ref={meshRef} scale={0.5}>
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
          <Sphere /> 
          {/* OrbitControls moves only the camera, NOT the light */}
        </Canvas>
      );
    }

export default CanvasSphere