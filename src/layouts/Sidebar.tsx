import { useState } from "react";
import { SidebarItem } from "../model/SidebarData";
import { BackRightKeyboardIcon } from "../components/Icon/MuiIIcon";
import logo from "../assets/logowebsite.png";
import { Link } from "react-router-dom";

function Sidebar({ itemList }: { itemList: SidebarItem[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const handleOpen = (): void => {
    setIsOpen((prev) => !prev);
  };
  return (
    <aside
      className={`bg-black/100 h-screen ${
        isOpen ? "w-60" : "w-22"
      } duration-400 ease-in-out relative`}
    >
      <nav className="flex flex-col ">
        <div className="w-full flex rounded-full mt-13 gap-3 items-center px-5">
          <img
            className="w-7 h-7 sm:w-10 sm:h-10 bg-amber-50 rounded-full"
            src={logo}
            alt="logo"
          />
          <p
            className={`text-white font-bold text-[0.9rem] sm:text-[1.2rem] overflow-hidden ${
              !isOpen && "hidden"
            }`}
          >
            System
          </p>
        </div>
        <ul className="p-5 pt-10 overflow-hidden">
          {itemList.map((item) => (
            <li key={item.title}>
              <Link
                  to={item.path as string}
                  className={`flex gap-x-5 p-2 rounded-2xl items-center hover:bg-indigo-500 duration-500 ease-in-out ${
                    item.gap && "mb-8"
                  } relative`}
                >
                  <div>
                    <item.icon sx={{ fontSize: "2rem", color: "white" }} />
                  </div>
                  <span
                    className={`text-[0.8rem] sm:text-[1.1rem] ${
                      !isOpen && "hidden"
                    } text-cyan-400 origin-left`}
                  >
                    {item.title}
                  </span>
                </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-10 h-10 bg-black bottom-10 right-6 absolute flex justify-center items-center ">
            {isOpen&& <p className="text-white">Collapse</p>}
        <div
          className={`${isOpen && "rotate-180"} duration-300 ease-in-out hover:opacity-75 cursor-pointer`}
          onClick={handleOpen}
        >
          <BackRightKeyboardIcon sx={{color:'white'}} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
