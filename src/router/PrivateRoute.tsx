import { lazy } from "react";
import { RouteType } from "../model/RouteData";
import { UserRoutes, AdminRoutes } from "../consts/RoutesConst";
import { roleDefine } from "../consts/UserRole";

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const ApprovalPage = lazy(() => import("../pages/user/ApprovalPageBackup"));
const RequestPage = lazy(() => import("../pages/user/RequestPage"));
const UserListPage = lazy(() => import("../pages/admin/User"));
const ProjectListPage = lazy(() => import("../pages/admin/Project"));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const UserDashboard = lazy(() => import("../pages/user/UserDashboard"));
const PaidPage = lazy(() => import("../pages/finance/PaidPage"));
const EmployeeDetailPage = lazy(() => import("../pages/user/EmployeeDetail"));

const commonRoute:RouteType[] = [
  {
    path: UserRoutes.USER_DASHBOARD,
    element: <UserDashboard />,
  },
  {
    path: UserRoutes.PROFILE_PAGE,
    element: <UserProfile />,
    
  },
  {
    path: UserRoutes.REQUEST_PAGE,
    element: <RequestPage />,
    
  },

  {
    path: UserRoutes.EMPLOYEE_DETAIL,
    element: <EmployeeDetailPage />,
    
  },

]
const privateRouteListFinance:RouteType[] = [
  ...commonRoute,
  {
    path: UserRoutes.PAID_PAGE,
    element: <PaidPage />,
  },
  {
    path: UserRoutes.APPROVAL_PAGE,
    element: <ApprovalPage />,
  },
]
const privateRouteListApproval: RouteType[] = [
  ...commonRoute,
  {
    path: UserRoutes.APPROVAL_PAGE,
    element: <ApprovalPage />,
    roleRoute: [roleDefine.APPROVAL_ROLE, roleDefine.FINANCE],
  },

]

const privateRouteListAdmin: RouteType[] = [
  {
    path: AdminRoutes.ADMIN_DASHBOARD,
    element: <AdminDashboard />,
  },
  {
    path: AdminRoutes.USER_LIST_PAGE,
    element: <UserListPage />,
  },
  {
    path: AdminRoutes.PROJECT_LIST_PAGE,
    element: <ProjectListPage />,
  },

];

function getPrivateRoute(role:string | undefined):RouteType[] {
   switch(role){
    case roleDefine.ADMIN_ROLE:
      return privateRouteListAdmin;
    case roleDefine.APPROVAL_ROLE:
      return privateRouteListApproval;
    case roleDefine.CLAIMER_ROLE:
      return commonRoute;
    case roleDefine.FINANCE:
      return privateRouteListFinance;
    default: return [];      
   }
}

export default getPrivateRoute;
