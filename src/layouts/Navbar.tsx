import { useAuthStore } from "../store/store";
import { NightModeIcon, NotificationIcon } from "../components/MuiIIcon";
import profile from "../assets/logouser.png";
import { useState } from "react";
import Popup from "../components/Popup";
const anouncement = [
  { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
  { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
  { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
  { title: "Hello", content: "this is welcome", date: new Date("2025/2/11") },
];
function Navbar() {
  // const [notification,setNotification] = useState<number>(0);
  const userInfo = useAuthStore.getState();
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const handlePopup = () => {
    setIsPopup((prev) => !prev);
    console.log(isPopup);
  };
  return (
    <nav className="mb-5 p-2 w-full sm:w-full">
      <div className="flex items-center w-full py-5 gap-5 justify-between sm:px-10">
        <div className="">
          <h1 className="text-[0.9rem] sm:text-[2rem] text-gray-500 font-bold">
            Welcome! {userInfo.userName}
          </h1>
        </div>
        <div className="flex items-center gap-5 ">
          <button className="text-[1.2rem] bg-black/70 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10  rounded-full cursor-pointer hover:opacity-75">
            {<NightModeIcon sx={{ fontSize: "1.1rem", color: "white" }} />}
          </button>
          <div className="">
            <button className="text-[1.2rem] bg-amber-600 flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-75 relative">
              {
                <NotificationIcon
                  sx={{ fontSize: "1.1rem", color: "white" }}
                  onClick={handlePopup}
                />
              }
            </button>
            {/* <div className="absolute rounded-full w-4 h-4 bg-red-500 flex items-center justify-center">     {notification}
                  </div> */}
          </div>

          <div className="">
            <button
              className="text-[1.2rem] flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-75"
              onClick={handlePopup}
            >
              <img
                src={profile}
                className=" w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-200"
                alt="profile pic"
              />
            </button>

            {isPopup ? (
              <Popup
                width="50rem"
                bg_color="#9fd3c7"
                top={20}
                right={10}
                padding_x={10}
                padding_y={5}
                content={anouncement}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
