import {Fragment, useState } from "react"
import { SidebarItem } from "../data/SidebarData"
import {BackArrowIcon } from "./MuiIIcon"
import logo from '../assets/logowebsite.png'
import { Link } from "react-router-dom"


function Sidebar({itemList} :{itemList:SidebarItem[]}) {
      const [isOpen,setIsOpen] = useState<boolean>(true);
      const handleOpen = ():void=>{
            setIsOpen((prev)=>!prev);
      }
  return (
    <aside className={`bg-black/100 min-h-screen w-${isOpen ? '50':'20'} sm:w-${isOpen ? '70':'20'} rounded-r-[5rem] duration-300 ease-in-out relative`}>
      <nav className="w-full">
                  <div className="w-full flex rounded-full mt-13 gap-3 items-center px-5">
                        <img className="w-7 h-7 sm:w-10 sm:h-10 bg-amber-50 rounded-full" src={logo} alt="logo" />
                  <p className={`text-white font-bold text-[0.9rem] sm:text-[1.2rem] ${!isOpen&&"hidden"}`}>System</p>
                  </div>
                  <div className="overflow-hidden w-full p-2">
                        <ul className="mt-4 flex flex-col p-2 gap-2">
                              {itemList.map((item)=>(   
                                    <li key={item.title}>
                                    {item.path ? ( 
                                    <Link to={item.path as string} className={`flex gap-5 p-2 rounded-2xl items-center hover:bg-indigo-500 duration-300 ease-in-out ${item.gap&&"mb-10"} relative`}>
                                          <div><item.icon sx={{fontSize:'1.8rem',color:'white'}}/></div>
                                          <p className={`text-[0.7rem] sm:text-[1.2rem] ${!isOpen&&"hidden"} text-cyan-400`}>{item.title}</p>
                                    </Link>):(
                                    <div className={`flex gap-5 p-2 rounded-2xl items-center hover:bg-indigo-500 duration-300 ease-in-out ${item.gap&&"mb-10"} relative`} onClick={item.action}>
                                           <div><item.icon sx={{fontSize:'1.8rem',color:'white'}}/></div>
                                           <p className={`text-[0.7rem] sm:text-[1.2rem] ${!isOpen&&"hidden"} text-cyan-400`}>{item.title}</p>
                                     </div> 
                                    )}
                                   
                                    </li>
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