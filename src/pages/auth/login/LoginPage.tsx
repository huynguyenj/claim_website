import { useNavigate } from "react-router-dom"
import CanvasSphere from "../../../components/3d_model/Sphere"
import LoginForm from "./LoginForm"
import { PublicRoutes } from "../../../consts/RoutesConst"

function LoginPage() {
      const navigate = useNavigate();
     const handleChangePage = () =>{
        navigate(PublicRoutes.HOME)
     }
      return (
    <div className="bg-[linear-gradient(to_right,black_50%,white_50%)] min-h-screen relative z-1">
      <div onClick={handleChangePage} className="absolute flex items-center justify-center right-2 cursor-pointer">
        <CanvasSphere/>
        </div>
     <LoginForm/>
    </div>
  )
}

export default LoginPage