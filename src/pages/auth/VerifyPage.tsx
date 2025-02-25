import { useRef, useState } from "react";
import { Notification } from "../../components/Notification";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../../consts/RoutesConst";
import publicApiService from "../../services/BaseApi";

function VerifyPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handleVerify = async () => {
    if(inputRef.current){
      try {
        setLoading((prev) => !prev);
        await publicApiService.verifyToken({email:inputRef.current.value});
        Notification('success','Your email verified successfully!');
        navigate(PublicRoutes.LOGIN);
      } catch (error) {
        Notification('error','Your email verified fail!')
        console.log(error)
      }finally{
        setLoading((prev) => !prev);
      }
    }
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
        <input ref={inputRef} type="text" placeholder="Enter your token" className="text-dark-fig bg-white mix-blend-difference p-2 rounded-2xl w-60" />
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
