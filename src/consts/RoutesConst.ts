
export const PublicRoutes = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY: "/verify-email/:token",
  FORGOTPASS:"/forgotPassword",
};

export const AdminRoutes = {
  ADMIN_DASHBOARD: `/admin-dashboard`, 
  PROJECT_LIST_PAGE: `/project-list`, 
  USER_LIST_PAGE: `/user-list`, 
};

export const UserRoutes = {
  USER_DASHBOARD: `/user-dashboard`, 
  REQUEST_PAGE: `/request`, 
  APPROVAL_PAGE: `/approval-page`, 
  PROFILE_PAGE: `/user-profile`, 
  PAID_PAGE: `/paid-page`, 
  EMPLOYEE_DETAIL: "/employee-detail/:id"
};
