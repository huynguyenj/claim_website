import { useState } from "react";
import { Notification } from "../../components/Notification";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../../consts/RoutesConst";

function VerifyPage() {
  const [loading, setLoading] = useState<boolean>(false);
//   const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleVerify = async () => {
    const interval = setInterval(() => {
      setLoading((prev) => !prev);
      Notification('success','Your email verify success!')
      navigate(PublicRoutes.LOGIN)
}, 3000);
    setLoading((prev) => !prev);
    setTimeout(() => clearInterval(interval), 4000);
  };
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[linear-gradient(to_right_bottom,black_50%,white_50%)]">
      <div className="leading-10 flex flex-col items-center justify-center relative">
        <div className="text-center relative ">
          <h1 className="font-bold text-5xl uppercase mix-blend-difference text-white-fig ">
            Verify your email
          </h1>
          <p className="mix-blend-difference text-white-fig ">
            Click to this button to verify your email!
          </p>
        </div>
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
      </div>
    </div>
  );
}

export default VerifyPage;
