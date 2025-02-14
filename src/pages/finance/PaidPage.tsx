import { Col, Row } from "antd";
import SalaryTable from "./SalaryTable";
import Sidebar from "../../layouts/Sidebar";
import { SidebarItem } from "../../data/SidebarData";
import {
  DashBoard,
  LogoutIcon,
  PersonIcon,
  SettingsIcon,
} from "../../components/MuiIIcon";
import Navbar from "../../layouts/Navbar";

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
    <div>
      <Row className="h-screen">
        <Navbar />
        <Col sm={5} md={4} lg={3} className="h-full">
          <Sidebar itemList={sidebarItems} />
        </Col>
        <Col sm={19} md={20} lg={21} className="w-full p-4">
          <SalaryTable />
        </Col>
      </Row>
    </div>
  );
};
export default PaidPage;
