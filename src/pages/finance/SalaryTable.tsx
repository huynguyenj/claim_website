<<<<<<< HEAD
import { Button, Input, Select, Space, Table, Tag } from "antd";
=======
import { Input, Select, Space, Table, Tag } from "antd";
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
import { DollarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useCallback, useMemo, useState } from "react";
import ModalConfirm from "./ModalConfirm";
<<<<<<< HEAD
import { useDebounce } from "use-debounce";
import dayjs from "dayjs";
=======
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
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
interface DataType {
  key: string;
  name: string;
  roles: string[];
  project: string;
  overtime: number;
  salary: number;
  date: Date;
}
<<<<<<< HEAD
=======

>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
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
<<<<<<< HEAD
const options = [
  { label: "E-commerce Website", value: "E-commerce Website" },
  { label: "Mobile App UI", value: "Mobile App UI" },
  { label: "Banking System", value: "Banking System" },
  { label: "CRM System", value: "CRM System" },
  { label: "Healthcare System", value: "Healthcare System" },
  { label: "Internal HR System", value: "Internal HR System" },
  { label: "AI Chatbot", value: "AI Chatbot" },
  { label: "Sales Dashboard", value: "Sales Dashboard" },
];
function SalaryTable(): JSX.Element {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="text-blue-500 font-medium">{text}</a>,
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "Salary",
=======

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
        <div className="font-bold flex align-middle gap-0.5  ">
          <DateRangeIcon />
          Date
        </div>
      ),
      width:80,
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5">
          <PersonIcon />
          Name
        </div>
      ),
      width : 150,
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="text-blue-500 font-medium">{text}</a>,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5">
          <WorkIcon />
          Project
        </div>
      ),
      width:200,
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
        <div className="font-bold flex align-middle gap-0.5">
          <PaidIcon />
          Salary
        </div>
      ),
      width:100,
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
      dataIndex: "salary",
      key: "salary",
      render: (salary) => (
        <p>
          {salary} <DollarOutlined />
        </p>
      ),
<<<<<<< HEAD
    },
    {
      title: "Overtime",
      dataIndex: "overtime",
      key: "overtime",
      render: (text) => <p>{text} Hours</p>,
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "roles",
      render: (roles) => (
        <>
          {roles.map((role: string, index: number) => {
            let color = role.length > 5 ? "geekblue" : "green";
            if (role === "BA") color = "volcano";
            if (role === "developer") color = "purple";
            if (role === "Designer") color = "blue";

            return (
              <Tag color={color} key={`${role}-${index}`}>
=======
      responsive: ["sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5">
          <MoreTimeIcon /> Overtime
        </div>
      ),
      width:100,
      dataIndex: "overtime",
      key: "overtime",
      render: (text) => <p>{text} Hours</p>,
      responsive: ["md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 ">
          <AccountCircleIcon />
          Role
        </div>
      ),
      key: "role",
      dataIndex: "roles",
      width: 200,
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
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
<<<<<<< HEAD
=======
      responsive: ["sm", "md", "lg"],
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
    },
    {
      title: "Action",
      key: "action",
<<<<<<< HEAD
      render: () => (
        <Space size="middle">
          <ModalConfirm />
          <Button danger className="px-4">
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 300);

  const [listProject, setListProject] = useState<string[]>([]);
  const filteredData = useMemo(() => {
    return initialData
      .filter((item) =>
        debouncedSearch
          ? item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          : true
      )
      .filter((item) =>
        listProject.length > 0 ? listProject.includes(item.project) : true
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime()); 
  }, [debouncedSearch, listProject]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      if (value !== searchText) {
        setSearchText(value);
      }
    },
    [searchText]
  );

  const handleProjectChange = useCallback(
    (value: string[]) => {
      if (JSON.stringify(value) !== JSON.stringify(listProject)) {
        setListProject(value);
      }
    },
    [listProject]
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <Input
        prefix={<SearchOutlined className="text-gray-500" />}
        placeholder="Search By Name"
        className="w-full max-w-xs mb-4 px-4 py-2 rounded-full mr-4"
=======
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
    <div className="p-5 rounded-xl shadow-lg overflow-y-scroll bg-black bg-[radial-gradient(white_0.2px,transparent_0.1px)] bg-[size:30px_30px]">
      <Input
        prefix={<SearchOutlined className="text-gray-500" />}
        placeholder="Search By Name"
        className="max-w-xs mb-4  rounded-full mr-4"
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
        onChange={handleSearchChange}
      />
      <Select
        mode="multiple"
        allowClear
<<<<<<< HEAD
        style={{ width: "40%", marginBottom: "1rem" }}
=======
        style={{ width: "30%", marginBottom: "1rem" }}
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
        placeholder="Please select"
        onChange={handleProjectChange}
        options={options}
      />
<<<<<<< HEAD
      {/* Bảng */}
      <Table
        rowKey="key"
        className="pt-1 relative"
        style={{ borderRadius: "8px", boxShadow: "none" }}
        columns={columns}
        dataSource={filteredData}
        pagination={{ position: ["bottomCenter"], pageSize: 5 }}
=======
      <DatePicker.RangePicker
        style={{ width: "30%", marginBottom: "1rem", marginLeft: "1rem" }}
        onChange={handleDatePicker}
      />
      <Table
        rowKey="key"
        className="shadow-[0_0_35px_#939589] border-1 rounded-lg mt-4 hover:shadow-[0_0_50px_#939589]"
        columns={columns}
        dataSource={filteredData}
        pagination={{ position: ["bottomCenter"], pageSize: 5 }}
        style={{ tableLayout: "fixed" }}
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
      />
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
export default SalaryTable;
