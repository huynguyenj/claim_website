import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { SidebarItem } from "../data/SidebarData";
import { useAuthStore } from "../store/store";
import { ApprovalIcon, CheckListIcon, DashBoard, LogoutIcon, PaidIcon, RequestPageIcon, SettingIcon, UserList, UserProfile } from "../components/MuiIIcon";

const sideBarUser:SidebarItem[]=[
  {title:'Claim data',icon:DashBoard,path:'/userDashboard'},
  {title:'Request',icon:RequestPageIcon,path:'/requestPage',gap:true},
  {title:'Approval',icon:ApprovalIcon,path:'/approvalPage',role: "ba", gap:true},
  {title:'Profile',icon:UserProfile,path:'/userprofile'},
  {title:'Paid',icon:PaidIcon,path:'/paidPage', role:"finance"},
  {title:'Setting',icon:SettingIcon,path:'/setting',gap:true},
  {title:'Logout',icon:LogoutIcon, action:()=>useAuthStore.getState().removeExpired()},

]

const sideBarAdmin:SidebarItem[]=[
  {title:'Dashboard',icon:DashBoard,path:'/adminDashboard', gap:true},
  {title:'User Management',icon:UserList,path:'/userlist'},
  {title:'Project Manager',icon:CheckListIcon,path:'/projectManage',gap:true},
  {title:'Setting',icon:SettingIcon,path:'/setting'},
  {title:'Logout',icon:LogoutIcon, action:()=>useAuthStore.getState().removeExpired()},

]


export default function MainLayout() {
  const [item,setItem] = useState<SidebarItem[]>([])
  const userRole = useAuthStore.getState().role;
  useEffect(()=>{
    setItem(sideBarUser.filter((item)=>item.role === userRole || item.role === undefined));
  },[userRole])
  return (
    <div className="flex">
      {userRole == "admin" ? <Sidebar itemList={sideBarAdmin}/>:<Sidebar itemList={item}/>}
      
      <main>
            <Outlet/>
      </main>
    </div>
  )
}
