import { Input, Select, Space, Table, Tag } from "antd";
import { DollarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useCallback, useMemo, useState } from "react";
import ModalConfirm from "./ModalConfirm";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import {
  AccountCircleIcon,
  DateRangeIcon,
  MoreTimeIcon,
  PaidIcon,
  PersonIcon,
  WorkIcon,
} from "../../components/Icon/MuiIIcon";
interface DataType {
  key: string;
  name: string;
  roles: string[];
  project: string;
  overtime: number;
  salary: number;
  date: Date;
}
const initialData: DataType[] = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    roles: ["Developer", "Team Lead"],
    project: "E-commerce Website",
    overtime: 5,
    salary: 5000,
    date: new Date("2025-02-15"),
  },
  {
    key: "2",
    name: "Trần Thị B",
    roles: ["Designer"],
    project: "Mobile App UI",
    overtime: 2,
    salary: 4500,
    date: new Date("2025-01-20"),
  },
  {
    key: "3",
    name: "Lê Hoàng C",
    roles: ["QA Tester"],
    project: "Banking System",
    overtime: 3,
    salary: 4000,
    date: new Date("2025-01-25"),
  },
  {
    key: "4",
    name: "Phạm Minh D",
    roles: ["Developer"],
    project: "CRM System",
    overtime: 4,
    salary: 4800,
    date: new Date("2025-01-30"),
  },
  {
    key: "5",
    name: "Đỗ Thanh E",
    roles: ["Project Manager"],
    project: "Healthcare System",
    overtime: 6,
    salary: 5500,
    date: new Date("2025-02-05"),
  },
  {
    key: "6",
    name: "Võ Hải F",
    roles: ["HR Manager"],
    project: "Internal HR System",
    overtime: 1,
    salary: 4700,
    date: new Date("2025-02-10"),
  },
  {
    key: "7",
    name: "Bùi Văn G",
    roles: ["Developer"],
    project: "AI Chatbot",
    overtime: 8,
    salary: 4900,
    date: new Date("2025-02-15"),
  },
  {
    key: "8",
    name: "Ngô Thị H",
    roles: ["Data Analyst"],
    project: "Sales Dashboard",
    overtime: 0,
    salary: 4600,
    date: new Date("2025-02-20"),
  },
];

const options = initialData.map((item) => ({
  label: item.project,
  value: item.project,
}));

function SalaryTable(): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const [listProject, setListProject] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const filteredData = useMemo(() => {
    return initialData
      .filter((item) =>
        searchText
          ? item.name.toLowerCase().includes(searchText.toLowerCase())
          : true
      )
      .filter((item) =>
        listProject.length > 0 ? listProject.includes(item.project) : true
      )
      .filter((item) =>
        selectedDate && selectedDate[0] && selectedDate[1]
          ? dayjs(item.date).isAfter(selectedDate[0].startOf("day")) &&
            dayjs(item.date).isBefore(selectedDate[1].endOf("day"))
          : true
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [searchText, listProject, selectedDate]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );
  const handleDatePicker = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      setSelectedDate(dates ?? [null, null]);
    },
    []
  );

  const handleProjectChange = useCallback((value: string[]) => {
    setListProject(value);
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 sm:text-[0.7rem]  ">
          <DateRangeIcon />
          Date
        </div>
      ),
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 sm:text-[0.7rem]">
          <PersonIcon />
          Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="text-blue-500 font-medium">{text}</a>,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 sm:text-[0.7rem]">
          <WorkIcon />
          Project
        </div>
      ),
      dataIndex: "project",
      key: "project",
      responsive: ["md", "lg"],
      render: (text) => (
        <div className="text-gray-700 font-bold truncate max-w-[150px]">
          {text}
        </div>
      ),
      ellipsis: true,
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 sm:text-[0.7rem]">
          <PaidIcon />
          Salary
        </div>
      ),
      dataIndex: "salary",
      key: "salary",
      render: (salary) => (
        <p>
          {salary} <DollarOutlined />
        </p>
      ),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 sm:text-[0.7rem]">
          <MoreTimeIcon /> Overtime
        </div>
      ),
      dataIndex: "overtime",
      key: "overtime",
      render: (text) => <p>{text} Hours</p>,
      responsive: ["md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 sm:text-[0.7rem] ">
          <AccountCircleIcon />
          Role
        </div>
      ),
      key: "role",
      dataIndex: "roles",
      render: (roles: string[]) => (
        <>
          {roles.map((role: string, index: number) => {
            let color: string;
            switch (role.toLowerCase()) {
              case "developer":
                color = "blue";
                break;
              case "designer":
                color = "green";
                break;
              case "qa tester":
                color = "red";
                break;
              case "project manager":
                color = "purple";
                break;
              default:
                color = "gray";
            }
            return (
              <Tag color={color} key={index}>
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Action",
      key: "action",
      width: 240,
      render: () => (
        <Space size="small">
          <ModalConfirm
            typeConfirm={{ borderColor: "#6ef13c" }}
            text="APPROVE"
          />
          <ModalConfirm
            typeConfirm={{ borderColor: "#DC143C" }}
            text="REJECT"
          />
        </Space>
      ),
      responsive: ["sm", "md", "lg"],
    },
  ];

  return (
    <div className="p-6 rounded-xl shadow-lg bg-[#000] ">
      {/* Bộ lọc - Căn chỉnh Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          prefix={<SearchOutlined className="text-gray-500" />}
          placeholder="Search By Name"
          className="w-full rounded-lg shadow-sm"
          onChange={handleSearchChange}
        />
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Select Project"
          onChange={handleProjectChange}
          options={options}
          className="rounded-lg shadow-sm"
        />
        <DatePicker.RangePicker
          className="w-full rounded-lg shadow-sm"
          onChange={handleDatePicker}
        />
      </div>

      {/* Bảng hiển thị dữ liệu */}
      <Table
        rowKey="key"
        className="shadow-lg rounded-lg shadow-[#636466] hover:shadow-[0_0_50px_#636466] bg-[#C7C8CA]"
        columns={columns}
        dataSource={filteredData}
        pagination={{ position: ["bottomCenter"], pageSize: 8}}
      />
    </div>
  );
}
export default SalaryTable;
