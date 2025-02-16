import CanvasSphere from "../../components/3d_model/Sphere"
import LoginForm from "./LoginForm"

function LoginPage() {
     
      return (
    <div className="bg-amber-50  min-h-screen relative z-1">
     <LoginForm/>
     {/* <div className="h-screen w-full absolute top-[-30%] left-[-40%] -z-1">
     <CanvasSphere/>
     </div> */}
    </div>
  )
}

export default LoginPage