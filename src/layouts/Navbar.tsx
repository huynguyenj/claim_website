import { EditIcon, LogoutIcon,UserIcon } from "../components/Icon/MuiIIcon";
import profile from "../assets/logouser.png";
import { useState } from "react";
import Popup from "../components/Popup";
import { useAuthStore } from "../store/authStore";
// const anouncement = [
//   { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
//   { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
//   { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
//   { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
// ];

type infoData = {
  userId: string,
  avatar_url:string,
  full_name:string,
  gmail:string
}
const user_Info:infoData= {
      userId: 'abcad1424ljmjojfa',
      avatar_url:'',
      full_name:'Nguyen Van A',
      gmail:'nguyenvana@gmail.com'
}

function Navbar() {
  // const [notification,setNotification] = useState<number>(0);
  // const userInfo = useAuthStore((state) => state.userName);
  // const [isPopup, setIsPopup] = useState<boolean>(false);
  const [isProfilePopup, setIsProfilePopup] = useState<boolean>(false);

  const handlePopUpProfile = () =>{
      setIsProfilePopup((prev)=>!prev)
  }
  // const handlePopup = () => {
  //   setIsPopup((prev) => !prev);
  //   console.log(isPopup);
  // };
  const handleLogout = ()=> {
    useAuthStore.getState().removeExpired();
  }
  return (
    <nav className="mb-5 p-2 w-fit sm:w-[95%] bg-white-fig  sm:mx-auto mt-5">
      <div className="flex items-center w-full py-3 gap-5 justify-between sm:px-10">
        <div className="">
          <h1 className="text-[0.9rem] sm:text-[1.8rem] text-dark-fig font-bold w-fit">
            Welcome! {user_Info.full_name}
          </h1>
        </div>
        <div className="flex items-center gap-5 ">
          {/* <button className="text-[1.2rem] bg-black/70 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10  rounded-full cursor-pointer hover:opacity-75">
            {<NightModeIcon sx={{ fontSize: "1.1rem", color: "white" }} />}
          </button> */}
          {/* <div className="relative">
            <button className="text-[1.2rem] bg-amber-600 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-75 relative">
              {
                <NotificationIcon
                  sx={{ fontSize: "1.1rem", color: "white" }}
                  onClick={handlePopup}
                />
              }
            </button>
            <div className="absolute rounded-full w-1 h-1 sm:w-3 sm:h-3 bg-red-600 flex items-center top-0 right-0 justify-center p-1 sm:p-2">
              <p className="text-[0.5rem] sm:text-[0.7rem] text-white ">{anouncement.length}</p>
            </div>
            <Popup
            isOpen={isPopup}
            top={50}
            right={0}
            >
              <div className="w-70 py-5 bg-amber-400 rounded-3xl">
              {anouncement.map((a,index)=>(
                <div key={index} className="flex gap-2 items-center justify-center">
                  <p>{a.title}</p>
                  <p>{a.content}</p>
                  <p>{a.date.toLocaleDateString()}</p>
                </div>
              ))}
              </div>
            </Popup>
          </div> */}

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
                        <p className="text-[0.9rem] sm:text-[1.3rem]">{user_Info.full_name}</p>
                        <p className="text-[0.55rem] sm:text-[0.75rem]">{user_Info.gmail}</p>
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
