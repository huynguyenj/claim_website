import { useState } from "react";
<<<<<<< HEAD
import { SidebarItem } from "../data/SidebarData";
import { BackArrowIcon } from "../components/MuiIIcon";
=======
import { SidebarItem } from "../model/SidebarData";
import { BackRightKeyboardIcon } from "../components/Icon/MuiIIcon";
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb
import logo from "../assets/logowebsite.png";
import { Link } from "react-router-dom";

function Sidebar({ itemList }: { itemList: SidebarItem[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const handleOpen = (): void => {
    setIsOpen((prev) => !prev);
  };
  return (
    <aside
<<<<<<< HEAD
      className={`bg-black/100 fixed min-h-screen ${
        isOpen ? "w-50" : "w-22"
      } rounded-r-[4rem] duration-300 ease-in-out relative`}
=======
      className={`bg-black/100 h-screen ${
        isOpen ? "w-60" : "w-22"
      } duration-400 ease-in-out relative`}
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb
    >
      <nav className="flex flex-col ">
        <div className="w-full flex rounded-full mt-13 gap-3 items-center px-5">
          <img
            className="w-7 h-7 sm:w-10 sm:h-10 bg-amber-50 rounded-full"
            src={logo}
            alt="logo"
          />
          <p
<<<<<<< HEAD
            className={`text-white font-bold text-[0.9rem] sm:text-[1.2rem] ${
=======
            className={`text-white font-bold text-[0.9rem] sm:text-[1.2rem] overflow-hidden ${
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb
              !isOpen && "hidden"
            }`}
          >
            System
          </p>
        </div>
        <ul className="p-5 pt-10 overflow-hidden">
          {itemList.map((item) => (
            <li key={item.title}>
<<<<<<< HEAD
              {item.path ? (
                <Link
                  to={item.path as string}
                  className={`flex gap-x-5 p-2 rounded-2xl items-center hover:bg-indigo-500 duration-300 ease-in-out ${
                    item.gap && "mb-10"
=======
              <Link
                  to={item.path as string}
                  className={`flex gap-x-5 p-2 rounded-2xl items-center hover:bg-indigo-500 duration-500 ease-in-out ${
                    item.gap && "mb-8"
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb
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
<<<<<<< HEAD
              ) : (
                <div
                  className={`flex gap-5 p-2 rounded-2xl items-center hover:bg-indigo-500 duration-300 ease-in-out ${
                    item.gap && "mb-10"
                  } relative`}
                  onClick={item.action}
                >
                  <div>
                    <item.icon sx={{ fontSize: "2rem", color: "white" }} />
                  </div>
                  <p
                    className={`text-[0.8rem] sm:text-[1.1rem] ${
                      !isOpen && "hidden"
                    } text-cyan-400`}
                  >
                    {item.title}
                  </p>
                </div>
              )}
=======
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb
            </li>
          ))}
        </ul>
      </nav>
<<<<<<< HEAD
      <div className="w-8 h-8 rounded-full bg-blue-300 top-5 right-0 absolute flex justify-center items-center hover:bg-green-300 cursor-pointer">
        <div
          className={`${isOpen && "rotate-180"} duration-300 ease-in-out`}
          onClick={handleOpen}
        >
          <BackArrowIcon />
=======
      <div className="w-10 h-10 bg-black bottom-10 right-6 absolute flex justify-center items-center ">
            {isOpen&& <p className="text-white">Collapse</p>}
        <div
          className={`${isOpen && "rotate-180"} duration-300 ease-in-out hover:opacity-75 cursor-pointer`}
          onClick={handleOpen}
        >
          <BackRightKeyboardIcon sx={{color:'white'}} />
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
