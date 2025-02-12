import {
  AppstoreOutlined,
  BellOutlined,
  ContainerOutlined,
  DesktopOutlined,
  DollarOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import logowebsite from "../../assets/logowebsite.png";

import { Button, Col, Menu, Row, Typography } from "antd";

import { useState } from "react";
import { LogoutIcon } from "../../components/MuiIIcon";
import SalaryTable from "./SalaryTable";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "1", icon: <PieChartOutlined />, label: "Option 1" },
  { key: "2", icon: <DesktopOutlined />, label: "Option 2" },
  { key: "3", icon: <ContainerOutlined />, label: "Option 3" },
  {
    key: "sub1",
    label: "Navigation One",
    icon: <MailOutlined />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      { key: "7", label: "Option 7" },
      { key: "8", label: "Option 8" },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppstoreOutlined />,
    children: [
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "11", label: "Option 11" },
          { key: "12", label: "Option 12" },
        ],
      },
    ],
  },
];

const PaidPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-700 backdrop-blur-md px-6 py-4 shadow-lg">
        <div className="flex justify-start gap-x-8 gap-y-8 py-4 antialiased md:subpixel-antialiased items-center grid-rows-4 ">
          <Button
            className="ml-3.5 mt-1 w-16 h-16 text-lg"
            onClick={toggleCollapsed}
            style={{ marginBottom: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <img
            src={logowebsite}
            className="w-12 h-12 sm:w-20 sm:h-20 rounded-full object-cover bg-amber-200"
            alt="profile pic"
          />
          <div className="flex justify-center items-center w-full">
            <Typography.Title
              level={1}
              style={{
                color: "white",
                fontWeight: 600,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Finance
              <DollarOutlined className="animate-bounce" />
            </Typography.Title>
          </div>
        </div>
        <div className="flex items-center justify-end rounded-2xl mr-4 object-cover w-full max-w-lg p-3 overflow-hidden relative">
          <div className="relative z-10">
            <img
              src="https://i.pravatar.cc/100"
              alt="User Avatar"
              className="w-14 h-14 rounded-full border-2 border-gray-500 transition-transform duration-300 hover:scale-110"
            />
          </div>
          <div className="shadow-md bg-[#1E293B] rounded-2xl -ml-6 w-fit max-w-sm p-2 flex items-center relative z-0">
            {/* Thông tin người dùng */}
            <div className="flex-1 pl-6">
              <h3 className="text-white font-semibold text-xs sm:text-sm">
                Andrew Alfred
              </h3>
              <p className="text-gray-400 text-xs text-[10px] sm:text-xs">
                Technical advisor
              </p>
            </div>

            {/* Nhóm icon */}
            <div className="flex items-center space-x-3 pr-1 pl-2 ">
              <BellOutlined style={{ fontSize: "1rem", color: "#fff" }} />
              <LogoutIcon style={{ fontSize: "1rem", color: "#fff" }} />
            </div>
          </div>
        </div>
      </div>
      <Row className="h-screen">
        {/* Cột Menu */}
        <Col sm={5} md={4} lg={3} className="h-full">
          <Menu
            className="rounded-r-lg border-x-4 border-2 border-[#334155] h-full bg-gradient-to-b from-[#1E293B] to-[#334155]"
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            style={{ fontSize: "18px", transition: "all 0.3s ease-in-out" }}
            items={items}
          />
        </Col>
        <Col sm={19} md={20} lg={21} className="w-full p-4">
          <SalaryTable />
        </Col>
      </Row>
    </div>
  );
};
export default PaidPage;
