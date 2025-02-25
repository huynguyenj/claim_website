import { useRef, useEffect, useState } from "react";
import { Notification } from "../../components/Notification";
import LoadingSpin from "../../components/LoadingSpin";
import publicApiService from "../../services/BaseApi";

type EmailData = {
  email:string
}

function ForgotPassword() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<EmailData>();

  const handleForgotPass = async () => {
    if(inputRef.current){
      setEmail({email :inputRef.current.value});
      try {
        setLoading((prev) => !prev)
        await publicApiService.forgetPass(email as object)
        Notification('info', 'Check your new password in email!')
      } catch (error) {
        Notification('error', 'Check your email correctly!')
        console.log('fail to call api',error)
      }finally{
        setLoading((prev) => !prev)
      }

    }
  };
  useEffect(() => {
    const checkFocus = () => {
      setIsFocused(document.activeElement === inputRef.current);
    };

    checkFocus();
    document.addEventListener("focusin", checkFocus);
    document.addEventListener("focusout", checkFocus);

    return () => {
      document.removeEventListener("focusin", checkFocus);
      document.removeEventListener("focusout", checkFocus);
    };
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[linear-gradient(to_left_bottom,black_50%,white_50%)]">
      <div className="leading-10 flex flex-col items-center justify-center relative">
        <div className="text-center relative">
          <h1 className="font-bold text-3xl sm:text-5xl uppercase mix-blend-difference text-white-fig">
            Forgot password
          </h1>
          <p className="mix-blend-difference text-white-fig">
            Enter your email in this field to get a new password!
          </p>
        </div>
        <div className="relative mt-3">
    <label htmlFor="inputPass" className={`absolute text-white mix-blend-difference left-3 text-3xl duration-300 transition-all ease-in-out ${isFocused || inputRef.current?.value!=null ? "top-[-14px] text-[1.3rem] bg-transparent w-fit":" top-[50%] transform-[translateY(-50%)]"}`}>Email</label>
          <input
            ref={inputRef}  
            type="text"
            id="inputPass"
            className="w-70 sm:w-100 h-15 bg-white mix-blend-difference text-dark-fig text-3xl border-none outline-none p-2"
          />
        </div>
        <button
          onClick={handleForgotPass}
          className="w-50 sm:w-70 flex items-center justify-center rounded-[0.5rem] py-2 mix border-dark-fig ring-1 border-2 text-3xl transform-[translateY(-5px)] active:shadow-fig-active active:transform-[translateY(5px)] duration-300 mt-4 bg-white-fig cursor-pointer shadow-fig hover:scale-[0.95]"
        >
          {!loading ? (
            <p>Submit</p>
          ) : (
           <LoadingSpin width="2.5rem" height="2.5rem" border_color="black" border_top_clr="white" />
          )}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
