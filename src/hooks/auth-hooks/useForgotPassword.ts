import { useState } from "react";
import { PublicRoutes } from "../../consts/RoutesConst";
import { Notification } from "../../components/common/Notification";
import publicApiService from "../../services/BaseApi";
import { useNavigate } from "react-router-dom";

export default function useForgotPassword() {
      const [loading, setLoading] = useState<boolean>(false);
      const navigate = useNavigate();
      const handleForgotPass = async (inputEmail:string) => {
          try {
            setLoading(true);
            await publicApiService.forgetPass({ email: inputEmail });
            Notification("info", "Successfully","Check your email to get password!");
            setTimeout(()=> navigate(PublicRoutes.LOGIN), 2000)
          } catch (error) {
            Notification("error", error as string);
          } finally {
            setLoading(false);
          }
        }
  return {loading,handleForgotPass}
}
