import { useAuthStore } from "../store/store"
import { NightModeIcon, NotificationIcon } from "./MuiIIcon";
import profile from '../assets/logouser.png'
function Navbar() {
      const userInfo = useAuthStore.getState();
  return (
    <nav className="mb-5 p-2 w-full sm:w-full">
      <ul className="flex items-center w-full py-5 gap-5 justify-between sm:px-10">
            <li className=""><h1 className="text-[0.9rem] sm:text-[2rem] text-gray-500 font-bold">Welcome! {userInfo.userName}</h1></li>
            <li className="flex items-center gap-5 ">
                  <button className="text-[1.2rem] bg-black/70 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10  rounded-full cursor-pointer hover:opacity-75">{<NightModeIcon sx={{fontSize:'1.1rem',color:'white'}}/>}</button>
                  <button className="text-[1.2rem] bg-amber-600 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10  rounded-full cursor-pointer hover:opacity-75">{<NotificationIcon sx={{fontSize:'1.1rem',color:'white'}}/>}</button>
                  <div className="relative">
                        <button className="text-[1.2rem] flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-75">
                              <img src={profile} className=" w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-200" alt="profile pic" />
                        </button>
                  </div>
            </li>

    
      </ul>
    </nav>
  )
}

export default Navbar