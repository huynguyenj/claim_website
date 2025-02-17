import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { SidebarItem } from "../data/SidebarData";
import { useAuthStore } from "../store/authStore";
import {
  ApprovalIcon,
  CheckListIcon,
  DashBoard,
  LogoutIcon,
  PaidIcon,
  RequestPageIcon,
  SettingIcon,
  UserList,
  UserProfile,
} from "../components/MuiIIcon";
import Navbar from "./Navbar";

const sideBarUser: SidebarItem[] = [
  { title: "Claim data", icon: DashBoard, path: "/userDashboard" },
  { title: "Request", icon: RequestPageIcon, path: "/requestPage" },
  {
    title: "Approval",
    icon: ApprovalIcon,
    path: "/approvalPage",
    role: "BA",
    gap: true,
  },
  { title: "Profile", icon: UserProfile, path: "/userprofile" },
  { title: "Paid", icon: PaidIcon, path: "/paidPage", role: "finance" },
  { title: "Setting", icon: SettingIcon, path: "/setting", gap: true },
  {
    title: "Logout",
    icon: LogoutIcon,
    action: () => useAuthStore.getState().removeExpired(),
  },
];
=======
import { SidebarItem } from "../model/SidebarData";
import { useAuthStore } from "../store/authStore";
import { ApprovalIcon, CheckListIcon, DashBoard,PaidIcon, RequestPageIcon, SettingIcon, UserList, UserProfile } from "../components/Icon/MuiIIcon";
import Navbar from "./Navbar";
import { UserRoutes,AdminRoutes } from "../consts/RoutesConst";
import { roleDefine } from "../consts/UserRole";

const sideBarUser:SidebarItem[]=[
  {title:'Claim data',icon:DashBoard,path:'/userDashboard'},
  {title:'Request',icon:RequestPageIcon, path:UserRoutes.REQUEST_PAGE},
  {title:'Approval',icon:ApprovalIcon, path:UserRoutes.APPROVAL_PAGE, role:roleDefine.APPROVAL_ROLE, gap:true},
  {title:'Profile',icon:UserProfile,path:'/userprofile'},
  {title:'Paid',icon:PaidIcon,path:'/paidPage', role:roleDefine.FINANCE},
  {title:'Setting',icon:SettingIcon,path:'/setting',gap:true},
]

const sideBarAdmin:SidebarItem[]=[
  {title:'Dashboard',icon:DashBoard,path:AdminRoutes.ADMIN_DASHBOARD, gap:true},
  {title:'User Management',icon:UserList,path:AdminRoutes.USER_LIST_PAGE},
  {title:'Project Management',icon:CheckListIcon,path:AdminRoutes.PROJECT_LIST_PAGE, gap:true},
  {title:'Setting',icon:SettingIcon,path:'/setting'},

]
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb

const sideBarAdmin: SidebarItem[] = [
  { title: "Dashboard", icon: DashBoard, path: "/adminDashboard", gap: true },
  { title: "User Management", icon: UserList, path: "/userlist" },
  {
    title: "Project Manager",
    icon: CheckListIcon,
    path: "/projectManage",
    gap: true,
  },
  { title: "Setting", icon: SettingIcon, path: "/setting" },
  {
    title: "Logout",
    icon: LogoutIcon,
    action: () => useAuthStore.getState().removeExpired(),
  },
];

export default function MainLayout() {
  const [item, setItem] = useState<SidebarItem[]>([]);
  const userRole = useAuthStore.getState().role;
  useEffect(() => {
    console.log(userRole);
    setItem(
      sideBarUser.filter(
        (item) => item.role === userRole || item.role === undefined
      )
    );
  }, [userRole]);
  return (
    <>
<<<<<<< HEAD
      <div className="flex">
        {userRole == "admin" ? (
          <Sidebar itemList={sideBarAdmin} />
        ) : (
          <Sidebar itemList={item} />
        )}

        <main className="flex-1 flex flex-col">
          <Navbar />
          <Outlet />
        </main>
      </div>
=======
    <div className="flex h-screen overflow-hidden">
      {userRole == roleDefine.ADMIN_ROLE ? <Sidebar itemList={sideBarAdmin}/>:<Sidebar itemList={item}/>}
  
      <main className="flex-1 flex flex-col">
            <Navbar/>
            <Outlet/>              
      </main>
    </div>
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb
    </>
  );
}
