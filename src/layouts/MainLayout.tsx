import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { SidebarItem } from "../model/SidebarData";
import { useAuthStore } from "../store/authStore";
import {
  ApprovalIcon,
  CheckListIcon,
  DashBoard,
  PaidIcon,
  RequestPageIcon,
  UserList,
  UserProfile,
} from "../components/Icon/MuiIIcon";
import Navbar from "./Navbar";
import { UserRoutes, AdminRoutes } from "../consts/RoutesConst";
import { roleDefine } from "../consts/UserRole";
import {useErrorStore} from "../store/errorStore";
import { Notification } from "../components/common/Notification";


const sideBarUser: SidebarItem[] = [
  { title: "Claim data", icon: DashBoard, path: UserRoutes.USER_DASHBOARD },
  { title: "Request", icon: RequestPageIcon, path: UserRoutes.REQUEST_PAGE },
  {
    title: "Approval",
    icon: ApprovalIcon,
    path: UserRoutes.APPROVAL_PAGE,
    role: roleDefine.APPROVAL_ROLE,
    gap: true,
  },
  {
    title: "Paid",
    icon: PaidIcon,
    path: UserRoutes.PAID_PAGE,
    role: roleDefine.FINANCE,
    gap:true
  },
  { title: "Profile", icon: UserProfile, path: UserRoutes.PROFILE_PAGE},
];

const sideBarAdmin: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: DashBoard,
    path: AdminRoutes.ADMIN_DASHBOARD,
    gap: true,
  },
  {
    title: "User Management",
    icon: UserList,
    path: AdminRoutes.USER_LIST_PAGE,
  },
  {
    title: "Project Management",
    icon: CheckListIcon,
    path: AdminRoutes.PROJECT_LIST_PAGE,
    gap: true,
  },
];

export default function MainLayout() {
  const [item, setItem] = useState<SidebarItem[]>([]);
  const userRole = useAuthStore((state) => state.user?.role_code);
  const errorMessage = useErrorStore((state) => state.message);
  useEffect(() => {
    setItem(
      sideBarUser.filter(
        (item) => item.role === userRole || item.role === undefined
      )
    );
  }, [userRole]);

  useEffect(() => {
    if(errorMessage){
      Notification('error',errorMessage)
      useErrorStore.setState({ message: null });
    }
  },[errorMessage])

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {userRole == roleDefine.ADMIN_ROLE ? (
          <Sidebar itemList={sideBarAdmin} />
        ) : (
          <Sidebar itemList={item} />
        )}

        <main className="flex-1 flex flex-col">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </>
  
  );
}
