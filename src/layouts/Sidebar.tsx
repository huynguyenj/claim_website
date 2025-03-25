import { useEffect,useState } from "react";
import { SidebarItem } from "../model/SidebarData";
import { BackRightKeyboardIcon } from "../components/Icon/MuiIIcon";
import logo from "../assets/logowebsite.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PublicRoutes } from "../consts/RoutesConst";

function Sidebar({ itemList }: { itemList: SidebarItem[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [active, setActive] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const handleActive = (index:number):void=>{
      setActive(index);
  }
  const handleOpen = (): void => {
    setIsOpen((prev) => !prev);
  };

  useEffect(()=>{
      const currentIndex = itemList.findIndex((item)=>item.path == location.pathname);
      if(currentIndex!=-1){
            setActive(currentIndex);
      }
  },[location.pathname,itemList])

  useEffect(()=>{
    const handleResize = () =>{
      if(window.innerWidth <= 687){
        setIsOpen(false);
      }else{
        setIsOpen( true)
      }
  
    }
    window.addEventListener('resize',handleResize);
    handleResize();
    return ()=> { window.removeEventListener('resize',handleResize)};
  },[])

  return (
    <aside
      className={`bg-black/100 h-screen ${
        isOpen ? "w-60" : "w-22"
      } duration-400 ease-in-out relative`}
    >
      <nav className="flex flex-col">
        <div className="w-full flex rounded-full mt-13 gap-3 items-center px-5 cursor-pointer" onClick={()=>navigate(PublicRoutes.HOME)}>
          <img
            className="w-9 h-9 sm:w-14 sm:h-14"
            src={logo}
            alt="logo"
          />
          <p
            className={`text-white-fig font-bold text-[0.9rem] sm:text-[1.2rem] overflow-hidden ${
              !isOpen && "hidden"
            }`}
          >
            System
          </p>
        </div>
        <ul className="p-5 pt-10 overflow-hidden">
          {itemList.map((item,index) => (
            <li key={item.title} onClick={()=>handleActive(index)}>
              <Link
                to={item.path as string}
                className={`relative flex gap-x-5 p-2 items-center hover:bg-indigo-500 duration-500 ease-in-out 
                  before:absolute before:w-[0.1rem] before:bg-white before:left-0 before:origin-top before:transition-all before:duration-500 before:ease-in-out
                  ${index === active ? "before:h-full text-white-fig" : "before:h-0 text-gray-fig"} 
                }  ${item.gap && "mb-8"} relative`} 
              >
                <div>
                  <item.icon sx={{ fontSize: "2rem", color: "white" }} />
                </div>
                <span
                  className={`text-[0.8rem] sm:text-[1.1rem] ${
                    !isOpen && "hidden"
                  } origin-left`}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-10 h-10 bg-black bottom-10 right-6 absolute flex justify-center items-center ">
        <div
          className={`${
            isOpen && "rotate-180"
          } duration-300 ease-in-out hover:opacity-75 cursor-pointer flex`}
          onClick={handleOpen}
        >
          <BackRightKeyboardIcon sx={{ color: "white"}} />
          {isOpen && <p className="text-white-fig rotate-180">Collapse</p>}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
