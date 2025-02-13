import { useAuthStore } from "../store/authStore"
import { NightModeIcon, NotificationIcon } from "../components/MuiIIcon";
import profile from '../assets/logouser.png'
import { useState } from "react";
import Popup from "../components/Popup";
const anouncement = [
      {title:"Hello",content:"this is welcome",date: new Date('2025/2/11')},
      {title:"Hello",content:"this is welcome",date: new Date('2025/2/11')},
      {title:"Hello",content:"this is welcome",date: new Date('2025/2/11')},
      {title:"Hello",content:"this is welcome",date: new Date('2025/2/11')},

]
function Navbar() {
      // const [notification,setNotification] = useState<number>(0);
      const userInfo = useAuthStore((state)=>state.userName);
      const [isPopup,setIsPopup] = useState<boolean>(false);
      const handlePopup = ()  =>{
            setIsPopup((prev)=>!prev)
            console.log(isPopup)
      }
  return (
    <nav className="mb-5 p-2 sm:w-[95%] rounded-4xl bg-gray-200 mx-auto mt-5">
      <div className="flex items-center w-full py-5 gap-5 justify-between sm:px-10">
            <div className=""><h1 className="text-[0.9rem] sm:text-[2rem] text-gray-500 font-bold">Welcome! {userInfo}</h1></div>
            <div className="flex items-center gap-5 ">
                  <button className="text-[1.2rem] bg-black/70 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10  rounded-full cursor-pointer hover:opacity-75">{<NightModeIcon sx={{fontSize:'1.1rem',color:'white'}}/>}</button>
                  <div className="relative">
                  <button className="text-[1.2rem] bg-amber-600 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-75 relative">{<NotificationIcon sx={{fontSize:'1.1rem',color:'white'}} onClick={handlePopup}/>}</button>
                  <div className="absolute rounded-full w-3 h-3 bg-red-600 flex items-center top-0 right-0 justify-center p-2">  
                        <p className="text-[0.7rem] text-white ">
                       {anouncement.length}
                        </p>
                  </div>
                  </div>
                 
                  <div className="relative">
                        <button className="text-[1.2rem] flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-75"onClick={handlePopup} >
                              <img src={profile} className=" w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-200" alt="profile pic" />
                        </button>
                        <Popup isOpen={isPopup} onClose={handlePopup} content={anouncement}>
                            
                        </Popup>
                       
                  </div>
            </div>

    
      </div>
    </nav>
  )
}

export default Navbar