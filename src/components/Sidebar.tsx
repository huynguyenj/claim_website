import { useState } from "react"
import { SidebarItem } from "../data/SidebarData"
import {BackArrowIcon } from "./MuiIIcon"
import logo from '../assets/logouser.png'
import { Link } from "react-router-dom"


function Sidebar({itemList} :{itemList:SidebarItem[]}) {
      const [isOpen,setIsOpen] = useState<boolean>(true);
      const handleOpen = ():void=>{
            console.log(isOpen)
            setIsOpen((prev)=>!prev);
      }
  return (
    <aside className={`bg-black/100 min-h-screen w-${isOpen ? '70':'20'} rounded-r-[5rem] duration-300 ease-in-out relative`}>
      <nav className="flex flex-col px-5">
                  <div className=" w-full flex rounded-full mt-13 gap-3 items-center">
                        <img className="w-10 h-10 bg-amber-50 rounded-full" src={logo} alt="logo" />
                  <p className={`text-white font-bold text-[1.2rem] ${!isOpen&&"scale-0"}`}>System</p>
                  </div>
                  <div className="overflow-hidden w-full">
                        <ul className="mt-10 flex flex-col gap-1">
                              {itemList.map((item)=>(
                                    <Link to={item.path} key={item.title}>
                                    <li className={`flex gap-5 py-2 px-2 rounded-2xl  hover:bg-indigo-500 duration-200 ease-in-out ${item.gap&&"mb-10"}`}>
                                          <div><item.icon sx={{fontSize:'2rem',color:'white'}}/></div>
                                          <p className={`text-[1.2rem] ${!isOpen&&"scale-0"} text-cyan-400`}>{item.title}</p>
                                    </li>
                                    </Link>
                              ))}
                        </ul>
                  </div>
      </nav>
      <div className="w-8 h-8 rounded-full bg-blue-300 top-5 right-0 absolute flex justify-center items-center hover:bg-green-300 cursor-pointer">
            <div className={`${isOpen && "rotate-180"} duration-300 ease-in-out`} onClick={handleOpen}><BackArrowIcon/></div>
      </div>
    </aside>
  )
}

export default Sidebar