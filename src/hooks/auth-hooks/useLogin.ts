import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { FormProps } from "antd";
import publicApiService from "../../services/BaseApi";
import authService from "../../services/AuthService";
import { AdminRoutes, UserRoutes } from "../../consts/RoutesConst";
import { Notification } from "../../components/common/Notification";
import { roleDefine } from "../../consts/UserRole";
import { useNavigate } from "react-router-dom";
import { UserForm } from "../../model/UserData";

export default function useLogin() {
  const navigate = useNavigate();
  const addAuthInfo = useAuthStore((state) => state.setAuth);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const [loading,setLoading] = useState<boolean>(false);

  const handleSubmitLogin: FormProps<UserForm>["onFinish"] = async (values) => {
    console.log(handleSubmitLogin === handleSubmitLogin)
    try {
      setLoading((prev)=>!prev)
      const response = await publicApiService.login(values);
      addAuthInfo(response.data.token);
      const userInfo = await authService.getInfo();
      setUserInfo(userInfo.data);
      navigate(userInfo.data.role_code === roleDefine.ADMIN_ROLE ? AdminRoutes.ADMIN_DASHBOARD : UserRoutes.USER_DASHBOARD);      
      Notification("success", "Login successful!")
    } catch (error) {
      Notification(
        "error",
        "Login fail!",
        error as string
      );
    }finally{
      setLoading((prev)=>!prev)
    }
  };
  return {handleSubmitLogin, loading}
}
