import { lazy, useLayoutEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { RouteType } from "../model/RouteData";
import { useAuthStore } from "../store/authStore";
import { UserRoutes, AdminRoutes } from "../consts/RoutesConst";
import { roleDefine } from "../consts/UserRole";

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
// const HomePage = lazy(()=> import("../pages/home/Home"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const ApprovalPage = lazy(() => import("../pages/user/ApprovalPage"));
const RequestPage = lazy(() => import("../pages/user/RequestPage"));
const UserListPage = lazy(() => import("../pages/admin/User"));
const ProjectListPage = lazy(() => import("../pages/admin/Project"));
const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const UserDashboard = lazy(() => import("../pages/user/UserDashboard"));
const PaidPage = lazy(() => import("../pages/finance/PaidPage"));

const privateRouteList: RouteType[] = [
  {
    path: AdminRoutes.ADMIN_DASHBOARD,
    element: <AdminDashboard />,
    roleRoute: [roleDefine.ADMIN_ROLE],
  },
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
    path: UserRoutes.APPROVAL_PAGE,
    element: <ApprovalPage />,
    roleRoute: [roleDefine.APPROVAL_ROLE],
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
    path: AdminRoutes.USER_LIST_PAGE,
    element: <UserListPage />,
    roleRoute: [roleDefine.ADMIN_ROLE],
  },
  {
    path: AdminRoutes.PROJECT_LIST_PAGE,
    element: <ProjectListPage />,
    roleRoute: [roleDefine.ADMIN_ROLE],
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
  {
    path: UserRoutes.PAID_PAGE,
    element: <PaidPage />,
    roleRoute: [
      roleDefine.FINANCE,
    ],
  },
];

function PrivateRoute() {
  const [routeRole, setRouteRole] = useState<RouteType[]>([]);
  const role = useAuthStore((state) => state.role);

  useLayoutEffect(() => {
    console.log(role);
    if (role) {
      setRouteRole(
        privateRouteList.filter((route) =>
          route.roleRoute?.includes(role.toLowerCase())
        )
      );
    } else {
      setRouteRole([]);
    }
  }, [role]);
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {routeRole.map((r, index) => (
          <Route key={index} path={r.path} element={r.element} />
        ))}
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default PrivateRoute;