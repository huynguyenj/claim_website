import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore";
import { PublicRoutes } from "../../router/PublicRoutes";
import { AdminRoutes } from "../../router/AdminRoutes";
import { UserRoutes } from "../../router/UserRoutes";
import MainLayout from "../../layouts/MainLayout";


function Home() {
  const navigate = useNavigate();
  const role = useAuthStore((state)=>state.role)
  const handleChangePage = () =>{
      if(!role){
          navigate(PublicRoutes.LOGIN)
      }
      else if(role == 'admin'){
        navigate(AdminRoutes.ADMIN_DASHBOARD)
      }else{
        navigate(UserRoutes.USER_DASHBOARD)
      }
  }
  return (
    <>
      <MainLayout/>
    <div className="bg-gradient-to-l from-blue-500 via-black to-blue-800 w-full h-screen flex flex-col justify-center items-center">
        <div>
          <h1 className="text-white text-3xl sm:text-6xl font-bold">Seamless Claims Processing, Faster Resolutions</h1>
          <h2 className="text-white text-[1rem] sm:text-2xl">Effortless Claims Submission for a Stress-Free Experience </h2>
          <div className="w-full flex justify-center items-center mt-10">
          <button onClick={handleChangePage} className="bg-transparent border-4 border-white hover:bg-blue-800 hover:px-10 p-3 sm:p-5 rounded-3xl text-white duration-300 ease-in-out cursor-pointer text-[1.2rem] active:opacity-70">Get stated <span className="font-bold">now</span>!</button>
          </div>
        </div>
    </div>
    </>
  )
}

export default Home