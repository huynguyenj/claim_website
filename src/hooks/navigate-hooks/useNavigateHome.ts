import { useNavigate } from "react-router-dom"
import { PublicRoutes } from "../../consts/RoutesConst";

export default function useNavigateHome() {
      const navigate = useNavigate();
      const changeToHomePage = () =>{
            navigate(PublicRoutes.HOME)
      }    
  return{changeToHomePage}
}
