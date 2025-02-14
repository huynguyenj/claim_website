import { Button, Input, Select, Space, Table, Tag } from "antd";
import { DollarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useCallback, useMemo, useState } from "react";
import ModalConfirm from "./ModalConfirm";
import { useDebounce } from "use-debounce";
import dayjs from "dayjs";
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
      dataIndex: "salary",
      key: "salary",
      render: (salary) => (
        <p>
          {salary} <DollarOutlined />
        </p>
      ),
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
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
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
        onChange={handleSearchChange}
      />
      <Select
        mode="multiple"
        allowClear
        style={{ width: "40%", marginBottom: "1rem" }}
        placeholder="Please select"
        onChange={handleProjectChange}
        options={options}
      />
      {/* Bảng */}
      <Table
        rowKey="key"
        className="pt-1 relative"
        style={{ borderRadius: "8px", boxShadow: "none" }}
        columns={columns}
        dataSource={filteredData}
        pagination={{ position: ["bottomCenter"], pageSize: 5 }}
      />
    </div>
  );
}

export default SalaryTable;
