import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { EmployeeData } from "../../model/EmployeeData";
import authService from "../../services/AuthService";
import { AddressIcon, AssignmentIndIcon, BackArrowBackSpaceIcon, BusinessIcon, PhoneIcon, StarsIcon } from "../../components/Icon/MuiIIcon";
import { UserRoutes } from "../../consts/RoutesConst";
import LoadingScreen from "../../components/common/LoadingScreen";

function EmployeeDetail() {
      const {id} = useParams();
      const [approvalInfo,setApprovalInfo] = useState<EmployeeData>();
      const location = useLocation();
      const navigate = useNavigate();
      const [isLoading,setIsLoading] = useState<boolean>(false)
      useEffect(() => {
            const getEmployeeInfo = async () => {
                  setIsLoading(true);
                  try {
                        if(id){
                              const response = await authService.getEmployeeById(id);
                              setApprovalInfo(response)
                        }
                  } catch (error) {
                        console.log(error)
                  }finally{
                        setIsLoading(false)
                  }
            }
            getEmployeeInfo();
      },[location])
      const handleChangePage = () => {
            navigate(UserRoutes.REQUEST_PAGE)
      }
  return (
        <div className="w-full h-screen">
            <LoadingScreen loading={[isLoading]}>
      <div className="flex flex-col sm:flex-row px-4">
      <div className="bg-dark-fig sm:w-[30%] flex flex-col gap-5 items-center p-10 w-full ">
      <div className="w-20 h-20 sm:w-30 sm:h-30 lg:w-50 lg:h-50 bg-white-fig text-center flex items-center justify-center rounded-full shadow-fig border-2 border-black"><img className="w-full h-full flex rounded-full" src={approvalInfo?.avatar_url} alt="avatar" /></div>
      <p className="text-white-fig text-[1rem] sm:text-2xl">{approvalInfo?.account}</p>
      </div>
      <div className="border-2 w-full sm:w-[70%] p-10 flex flex-col gap-10">
            <p className="sm:text-2xl text-[1rem] flex items-center gap-2 font-bold"><AssignmentIndIcon/>Full name: <span className="font-normal">{approvalInfo?.full_name || "N/A"}</span></p>
            <p className="sm:text-2xl text-[1rem] flex items-center gap-2 font-bold"><AddressIcon/>Address: <span className="font-normal">{approvalInfo?.address || "N/A"}</span></p>
            <p className="sm:text-2xl text-[1rem] flex items-center gap-2 font-bold"><PhoneIcon/>Phone: <span className="font-normal">{approvalInfo?.phone || "N/A"}</span></p>
            <p className="sm:text-2xl text-[1rem] flex items-center gap-2 font-bold"><BusinessIcon/>Department name: <span className="font-normal">{approvalInfo?.department_name || "N/A"}</span></p>
            <p className="sm:text-2xl text-[1rem] flex items-center gap-2 font-bold"><StarsIcon/> Job rank: <span className="font-normal">{approvalInfo?.job_rank || "N/A"}</span></p>
            <div className="flex gap-10">
            </div>
            <button onClick={handleChangePage} className="bg-dark-fig w-20 hover:w-40 text-white-fig px-10 py-2 rounded-2xl cursor-pointer flex items-center justify-center group duration-300 ease-in-out">
                        <div className="transform-[translateX(80%)] group-hover:transform-[translateX(-20%)] duration-300 ease-in"><BackArrowBackSpaceIcon/></div>
                        <p className="transform-[scale(0)] group-hover:transform-[scale(1)] duration-500 ease-in-out">Back</p>
                  </button>
      </div>
      </div>
      </LoadingScreen>
      </div>
  )
}

export default EmployeeDetail