import { lazy } from "react";
import { RouteType } from "../model/RouteData";
import { UserRoutes, AdminRoutes } from "../consts/RoutesConst";
import { roleDefine } from "../consts/UserRole";



const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const ApprovalPage = lazy(() => import("../pages/user/ApprovalPage"));
const RequestPage = lazy(() => import("../pages/user/RequestPage"));
const UserListPage = lazy(() => import("../pages/admin/User"));
const ProjectListPage = lazy(() => import("../pages/admin/Project"));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const UserDashboard = lazy(() => import("../pages/user/UserDashboard"));
const PaidPage = lazy(() => import("../pages/finance/PaidPage"));

// // const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));

const privateRouteListFinance:RouteType[] = [
  {
    path: UserRoutes.PAID_PAGE,
    element: <PaidPage />,
    roleRoute: [roleDefine.FINANCE],
  },
  {
    path: UserRoutes.APPROVAL_PAGE,
    element: <ApprovalPage />,
    roleRoute: [roleDefine.APPROVAL_ROLE, roleDefine.FINANCE],
  },
]
const privateRouteListApproval: RouteType[] = [
  {
    path: UserRoutes.APPROVAL_PAGE,
    element: <ApprovalPage />,
    roleRoute: [roleDefine.APPROVAL_ROLE, roleDefine.FINANCE],
  },
]
const privateRouteListClaimer: RouteType[] = [
  {
    path: UserRoutes.USER_DASHBOARD,
    element: <UserDashboard />,
    roleRoute: [
      roleDefine.CLAIMER_ROLE,
      roleDefine.APPROVAL_ROLE,
      roleDefine.FINANCE,
    ],
  },

  {
    path: UserRoutes.REQUEST_PAGE,
    element: <RequestPage />,
    roleRoute: [
      roleDefine.CLAIMER_ROLE,
      roleDefine.FINANCE,
      roleDefine.APPROVAL_ROLE,
    ],
  },
  {
    path: UserRoutes.PROFILE_PAGE,
    element: <UserProfile />,
    roleRoute: [
      roleDefine.CLAIMER_ROLE,
      roleDefine.APPROVAL_ROLE,
      roleDefine.FINANCE,
    ],
  },
  
]
const privateRouteListAdmin: RouteType[] = [
  {
    path: AdminRoutes.ADMIN_DASHBOARD,
    element: <AdminDashboard />,
    roleRoute: [roleDefine.ADMIN_ROLE],
  },
  {
    path: AdminRoutes.USER_LIST_PAGE,
    element: <UserListPage />,
    roleRoute: [roleDefine.ADMIN_ROLE],
  },
  {
    path: AdminRoutes.PROJECT_LIST_PAGE,
    element: <ProjectListPage />,
    roleRoute: [roleDefine.ADMIN_ROLE],
  },

];

function getPrivateRoute(role:string | undefined) {
   switch(role){
    case roleDefine.ADMIN_ROLE:
      return privateRouteListAdmin;
    case roleDefine.APPROVAL_ROLE:
      return privateRouteListApproval;
    case roleDefine.CLAIMER_ROLE:
      return privateRouteListClaimer;
    case roleDefine.FINANCE:
      return privateRouteListFinance;
    default: return [];      
   }
}

export default getPrivateRoute;
