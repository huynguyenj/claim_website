import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Notification } from "../../components/common/Notification";
import publicApiService from "../../services/BaseApi";
import { PublicRoutes } from "../../consts/RoutesConst";

export default function useVerify() {
      const [loading, setLoading] = useState<boolean>(false);
      const [tokenSuccess, setTokenSuccess] = useState<boolean>(false);
      const navigate = useNavigate();
      const location = useLocation();
      const {token} = useParams();

      useEffect(() => {
        const handleVerify = async () => {
          setLoading(true);
          try {
            await publicApiService.verifyToken({ token: token });
            Notification("success", "Your email verified successfully!");
            setTokenSuccess(true);
            navigate(PublicRoutes.LOGIN);
          } catch (error) {
            Notification("error", error as string);
            console.log(tokenSuccess);
          } finally{
            setLoading(false)
          }
        };
        handleVerify();
      }, [location]);


  const resendVerification = async (inputEmail: string) => {
      setLoading(true);
      try {
        await publicApiService.resendToken({ email:inputEmail });
        Notification("success", "Verify successfully!");
      } catch (error) {
        Notification("error", error as string);
      } finally {
        setLoading(false);
      }
    };
    

      return {loading , tokenSuccess, resendVerification}
}
