import { LogoutIcon } from "../components/Icon/MuiIIcon";
import profile from "../assets/logouser.png";
import { useEffect, useState } from "react";
import Popup from "../components/common/Popup";
import { useAuthStore } from "../store/authStore";
import apiService from "../services/ApiService";
import { ApiResponse } from "../consts/ApiResponse";
import { Notification } from "../components/common/Notification";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../consts/RoutesConst";
import LoadingSpin from "../components/common/LoadingSpin";
import authService from "../services/AuthService";
import { EmployeeData } from "../model/EmployeeData";

function Navbar() {
  const userInfo = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [isProfilePopup, setIsProfilePopup] = useState<boolean>(false);
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeData>();

  const [loading, setLoading] = useState<boolean>(false);
  const handlePopUpProfile = () => {
    setIsProfilePopup((prev) => !prev);
  };

  useEffect(() => {
    const getEmployeeInfo = async () => {
      if (userInfo?._id) {
        try {
          const response = await authService.getEmployeeById(userInfo?._id);
          setEmployeeInfo(response);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getEmployeeInfo();
  }, [userInfo]);
  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiService.post<ApiResponse<object>>("/auth/logout");
      useAuthStore.getState().removeExpired();
      Notification("success", "Logout success!");
      navigate(PublicRoutes.LOGIN);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
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
                src={
                  employeeInfo?.avatar_url ? employeeInfo.avatar_url : profile
                }
                className=" w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-200"
                alt="profile pic"
              />
            </button>
            <Popup isOpen={isProfilePopup} top={45} right={8}>
              <div className="p-5 w-40 sm:w-70 bg-dark-fig text-white-fig rounded-2xl sm:mt-4 flex flex-col items-center justify-center">
                <div className="m-auto bg-red-400 rounded-full p-1 sm:p-2 mb-3">
                  <img
                    src={
                      employeeInfo?.avatar_url
                        ? employeeInfo.avatar_url
                        : profile
                    }
                    className=" w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-200"
                    alt="profile pic"
                  />
                </div>
                <p className="text-[0.9rem] sm:text-[1.3rem]">
                  {userInfo?.user_name}
                </p>
                <p className="text-[0.55rem] sm:text-[0.75rem]">
                  {userInfo?.email}
                </p>
                <div className="flex gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <LoadingSpin
                        width="1rem"
                        height="1rem"
                        border_top_clr="black"
                        border_color="white"
                      />
                    ) : (
                      <div className="flex gap-2 items-center">
                        <p
                          className="bg-white-fig w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-70"
                          onClick={handleLogout}
                        >
                          <LogoutIcon sx={{ fontSize: 15, color: "gray" }} />
                        </p>
                        <p className="text-[0.5rem] sm:text-[0.8rem]">Logout</p>
                      </div>
                    )}
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
