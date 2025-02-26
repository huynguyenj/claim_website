import { useRef, useState } from "react";
import { Notification } from "../../components/Notification";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../../consts/RoutesConst";
import publicApiService from "../../services/BaseApi";
import { BackArrowBackSpaceIcon } from "../../components/Icon/MuiIIcon";
import { getApiErrorMessage } from "../../consts/ApiResponse";

function VerifyPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handleVerify = async () => {
    if (inputRef.current) {
      try {
        setLoading((prev) => !prev);
        await publicApiService.verifyToken({ email: inputRef.current.value });
        Notification("success", "Your email verified successfully!");
        navigate(PublicRoutes.LOGIN);
      } catch (error) {
        Notification("error", getApiErrorMessage(error));
        console.log(error);
      } finally {
        setLoading((prev) => !prev);
      }
    }
  };
  const handleChangePage = () => {
    navigate(PublicRoutes.HOME);
  };
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[linear-gradient(to_right_bottom,black_50%,white_50%)]">
      <div className="leading-10 flex flex-col items-center justify-center relative">
        <div className="text-center relative mb-5 ">
          <h1 className="font-bold text-5xl uppercase mix-blend-difference text-white-fig ">
            Verify your email
          </h1>
          <p className="mix-blend-difference text-white-fig ">
            Click to this button to verify your email!
          </p>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your token"
          className="text-dark-fig bg-white mix-blend-difference p-2 rounded-2xl w-60 border-none outline-none"
        />
        <button
          onClick={handleVerify}
          className="w-50 sm:w-70 flex items-center justify-center rounded-[0.5rem] py-2 mix border-dark-fig ring-1 border-2 text-3xl transform-[translateY(-5px)] active:shadow-fig-active active:transform-[translateY(5px)] duration-300 mt-4 bg-white-fig cursor-pointer shadow-fig hover:scale-[0.95]"
        >
          {!loading ? (
            <p>Verify</p>
          ) : (
            <div className="w-10 h-10 rounded-full border-dark-fig border-4 border-t-white-fig animate-loading"></div>
          )}
        </button>
        <button
          onClick={handleChangePage}
          className="w-15 sm:w-20 sm:h-20 hover:w-60 hover:h-20 flex items-center justify-center rounded-full py-2 mix border-dark-fig ring-1 border-2 text-3xl transform-[translateY(-5px)] active:shadow-fig-active active:transform-[translateY(5px)] duration-300 mt-4 bg-white-fig cursor-pointer shadow-fig hover:scale-[0.95] group"
        >
          <div className="transform-[translateX(120%)] group-hover:transform-[translateX(-10%)] duration-300 ease-in">
            <BackArrowBackSpaceIcon sx={{ fontSize: 30 }} />
          </div>
          <p className="transform-[scale(0)] group-hover:transform-[scale(1)] duration-500 ease-in-out ">
            Back
          </p>
        </button>
      </div>
    </div>
  );
}

export default VerifyPage;
