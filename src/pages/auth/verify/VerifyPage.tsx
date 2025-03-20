import {useRef} from "react";
import { BackArrowBackSpaceIcon } from "../../../components/Icon/MuiIIcon";
import LoadingSpin from "../../../components/common/LoadingSpin";
import useVerify from "../../../hooks/auth-hooks/useVerify";
import useNavigateHome from "../../../hooks/navigate-hooks/useNavigateHome";

function VerifyPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {loading, tokenSuccess, resendVerification} = useVerify();
  const {changeToHomePage} = useNavigateHome();
  const handleVerifyEmail = () => {
    if(inputRef.current?.value){
        resendVerification(inputRef.current.value)
    }
  }
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[linear-gradient(to_right_bottom,black_50%,white_50%)]">
      <div className="leading-10 flex flex-col items-center justify-center relative">
        <div className="text-center relative mb-5 ">
          <h1 className="font-bold text-5xl uppercase mix-blend-difference text-white-fig ">
            Verify email
          </h1>
          {tokenSuccess ? (
            <div className="flex flex-col items-center justify-center mt-3">
                <p className="text-[1.2rem] text-white mix-blend-difference">
                  Your email is verified!
                </p>
                <button
                    onClick={changeToHomePage}
                    className="w-15 sm:w-20 sm:h-20 hover:w-60 hover:h-20 flex items-center justify-center rounded-full py-2 mix border-dark-fig ring-1 border-2 text-3xl transform-[translateY(-5px)] active:shadow-fig-active active:transform-[translateY(5px)] duration-300 mt-4 bg-white-fig cursor-pointer shadow-fig hover:scale-[0.95] group"
                  >
                    <div className="transform-[translateX(150%)] group-hover:transform-[translateX(-20%)] duration-300 ease-in">
                      <BackArrowBackSpaceIcon sx={{ fontSize: 30 }} />
                    </div>
                    <p className="transform-[scale(0)] group-hover:transform-[scale(1)] duration-500 ease-in-out ">
                      Home
                    </p>
                  </button>
            </div>
            
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="mix-blend-difference text-white-fig ">
                Click to this button to verify your email!
              </p>
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter your email"
                className="text-dark-fig bg-white mix-blend-difference p-2 rounded-2xl w-60 border-none outline-none"
              />
              {!loading  ? (
                <div className="flex flex-col justify-center items-center">
                  <button
                    onClick={handleVerifyEmail}
                    className="w-50 sm:w-70 flex items-center justify-center rounded-[0.5rem] py-2 mix border-dark-fig ring-1 border-2 text-3xl transform-[translateY(-5px)] active:shadow-fig-active active:transform-[translateY(5px)] duration-300 mt-4 bg-white-fig cursor-pointer shadow-fig hover:scale-[0.95]"
                  >
                    <p>Verify</p>
                  </button>
                  <button
                    onClick={changeToHomePage}
                    className="w-15 sm:w-20 sm:h-20 hover:w-60 hover:h-20 flex items-center justify-center rounded-full py-2 mix border-dark-fig ring-1 border-2 text-3xl transform-[translateY(-5px)] active:shadow-fig-active active:transform-[translateY(5px)] duration-300 mt-4 bg-white-fig cursor-pointer shadow-fig hover:scale-[0.95] group"
                  >
                    <div className="transform-[translateX(150%)] group-hover:transform-[translateX(-20%)] duration-300 ease-in">
                      <BackArrowBackSpaceIcon sx={{ fontSize: 30 }} />
                    </div>
                    <p className="transform-[scale(0)] group-hover:transform-[scale(1)] duration-500 ease-in-out ">
                      Home
                    </p>
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <LoadingSpin
                    width="2.5rem"
                    height="2.5rem"
                    border_color="black"
                    border_top_clr="white"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;
