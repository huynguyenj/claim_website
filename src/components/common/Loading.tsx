import shiba from "../../assets/loadingshiba.png";
import LoadingSpin from "./LoadingSpin";
function Loading() {
  return (
    <div className="relative w-full h-screen bg-black">
      <div className="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]">
        <img className="w-50 h-50" src={shiba} alt="shiba" />
        <div className="absolute top-[100%] left-[50%] transform-[translate(-50%,-50%)]"><LoadingSpin width="2rem" height="2rem" border_color="white" border_top_clr="black"/>
      </div>
    </div>
    </div>
  );
}

export default Loading;
