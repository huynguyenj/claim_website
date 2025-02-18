import SalaryTable from "./SalaryTable";
import { SidebarItem } from "../../model/SidebarData";
import {
  DashBoard,
  LogoutIcon,
  PersonIcon,
  SettingsIcon,
} from "../../components/Icon/MuiIIcon";
import Navbar from "../../layouts/Navbar";
import Sidebar from "../../layouts/Sidebar";
import { Grid2 } from "@mui/material";

const PaidPage: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: DashBoard,
      path: "/dashboard",
      role: "admin",
    },
    {
      title: "Profile",
      icon: PersonIcon,
      path: "/profile",
      role: "user",
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      path: "/settings",
      role: "admin",
      gap: true,
    },
    {
      title: "Logout",
      icon: LogoutIcon,
      action: () => console.log("User logged out"),
    },
  ];

  return (
    <Grid2 container spacing={0}>
      <Grid2 size={12}>
        <Navbar />
      </Grid2>
      <Grid2
        size={{ xs: 1, md: 2 }}
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Sidebar itemList={sidebarItems} />
      </Grid2>
      <Grid2 size={{ xs: 11, md: 10 }}>
        <SalaryTable />
      </Grid2>
    </Grid2>
  );
};
export default PaidPage;
