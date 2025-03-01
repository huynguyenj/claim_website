import { EditIcon, LogoutIcon,UserIcon } from "../components/Icon/MuiIIcon";
import profile from "../assets/logouser.png";
import { useState } from "react";
import Popup from "../components/common/Popup";
import { useAuthStore } from "../store/authStore";
import apiService from "../services/ApiService";
import { ApiResponse } from "../consts/ApiResponse";
import { Notification } from "../components/common/Notification";


function Navbar() {
  const userInfo = useAuthStore((state) => state.user)
  
  const [isProfilePopup, setIsProfilePopup] = useState<boolean>(false);

  const handlePopUpProfile = () =>{
      setIsProfilePopup((prev)=>!prev)
  }
 
  const handleLogout = async ()=> {
    try {
     const response = await apiService.post<ApiResponse<object>>('/auth/logout')
     if(response.success){
       useAuthStore.getState().removeExpired();
       Notification('success','Logout success!')
     }
    } catch (error) {
      Notification('error','Logout fail!')
      console.log(error)
    }
  }
  return (
    <nav className="mb-5 p-2 w-fit sm:w-[95%] bg-white-fig  sm:mx-auto mt-5">
      <div className="flex items-center w-full py-3 gap-5 justify-between sm:px-10">
        <div className="">
          <h1 className="text-[0.9rem] sm:text-[1.8rem] text-dark-fig font-bold w-fit">
            Welcome! {userInfo?.user_name}
          </h1>
        </div>
        <div className="flex items-center gap-5 ">
       

          <div className="relative">
            <button
              className="text-[1.2rem] flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-75"
              onClick={handlePopUpProfile}
            >
              <img
                src={profile}
                className=" w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-200"
                alt="profile pic"
              />
            </button>
            <Popup
              isOpen={isProfilePopup}
              top={45}
              right={8}
            >
                  <div className="p-5 w-40 sm:w-70 bg-dark-fig text-white-fig rounded-2xl sm:mt-4 flex flex-col items-center justify-center">
                        <div className="m-auto bg-red-400 rounded-full p-1 sm:p-2 mb-3"><UserIcon sx={{fontSize:35}}/></div>
                        <p className="text-[0.9rem] sm:text-[1.3rem]">{userInfo?.user_name}</p>
                        <p className="text-[0.55rem] sm:text-[0.75rem]">{userInfo?.email}</p>
                        <div className="flex gap-2 mt-4">
                          <div className="flex items-center gap-2">
                            <p className="bg-white-fig w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-70"><EditIcon sx={{fontSize:15,color:'gray'}}/></p>
                            <p className="text-[0.5rem] sm:text-[0.8rem]">Edit</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="bg-white-fig w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-70" onClick={handleLogout}><LogoutIcon sx={{fontSize:15,color:'gray'}}/></p>
                          <p className="text-[0.5rem] sm:text-[0.8rem]">Logout</p>
                          </div>
                        </div>
                  </div>
            </Popup>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
