import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore";
import { UserRoutes ,PublicRoutes,AdminRoutes } from "../../consts/RoutesConst";
import { roleDefine } from "../../consts/UserRole";
import { KeyboardArrowDownIcon } from "../../components/Icon/MuiIIcon";
import { lazy, useEffect, useState } from "react";

const SpaceCanvas = lazy(()=>import ("../../components/3d_model/Space"))
const OverView = lazy(()=> import ("../home/OverView"))


function Home() {
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const role = useAuthStore((state)=>state.role)
  const handleChangePage = () =>{
      if(!role){
          navigate(PublicRoutes.LOGIN)
      }
      else if(role == roleDefine.ADMIN_ROLE){
        navigate(AdminRoutes.ADMIN_DASHBOARD)
      }else{
        navigate(UserRoutes.USER_DASHBOARD)
      }
  }
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("section");
      if(section){
        if (section.getBoundingClientRect().top < window.innerHeight * 0.2) {
          setIsPaused(true); // Pause when scrolled down
        } else {
          setIsPaused(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main id="home" className="bg-gradient-to-b from-gray-800 via-black to-gray-900 min-h-screen w-full">
    <div className=" w-full h-screen flex flex-col justify-center items-center z-10 relative">
  
        <div>
          <h1 className="text-white text-4xl sm:text-6xl font-bold">Seamless Claims Processing, Faster Resolutions</h1>
          <h2 className="text-white text-[1rem] sm:text-2xl">Effortless Claims Submission for a Stress-Free Experience </h2>
          <div className="w-full flex justify-center items-center mt-10">
          <button onClick={handleChangePage} className="bg-transparent border-4 border-white hover:bg-blue-800 hover:px-10 p-3 sm:p-5 rounded-3xl text-white duration-300 ease-in-out cursor-pointer text-[1.2rem] active:opacity-70 z-10">Get stated <span className="font-bold">now</span>!</button>
          </div>
        </div>
        {isPaused ?   "": <div className="absolute w-full h-full ">
        <SpaceCanvas/>  
        </div>}
        <div className="absolute bottom-10 cursor-pointer"><a href="#section"><KeyboardArrowDownIcon sx={{color:'white',fontSize:35}}/></a></div>
    </div>
      <div id="section" className={`z-10duration-700 p-5`}>
        <OverView/>
      </div>
   
    </main>
  )
}

export default Home