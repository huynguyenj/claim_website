import { Button, Input, Space, Table, Tag } from "antd";
import { DollarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useState } from "react";

interface DataType {
  key: string;
  name: string;
  roles: string[];
  project: string;
  overtime: number;
  department: string;
  salary: number;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a className="text-blue-500 font-medium">{text}</a>,
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "department",
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
    render:(salary) => <p>{salary}   <DollarOutlined/></p>
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
    dataIndex: "role",
    render: (_, { roles }) => (
      <>
        {roles.map((role) => {
          let color = role.length > 5 ? "geekblue" : "green";
          if (role === "BA") color = "volcano";
          if (role === "developer") color = "purple";
          if (role === "Designer") color = "blue";

          return (
            <Tag color={color} key={role} className="px-3 py-1 rounded-full">
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
        <Button
          style={{           
            color: "#000",
            borderColor: '#1D4',
          }}
        >
          Approve
        </Button>
        <Button danger className="px-4">
          Reject
        </Button>
      </Space>
    ),
  },
];

const initialData: DataType[] = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    roles: ["Developer", "Team Lead"],
    project: "E-commerce Website",
    overtime: 5,
    department: "IT",
    salary: 500,
  },
  {
    key: "2",
    name: "Trần Thị B",
    roles: ["Designer"],
    project: "Mobile App UI",
    overtime: 2,
    department: "Design",
    salary: 3000,
  },
  {
    key: "3",
    name: "Lê Hoàng C",
    roles: ["QA Tester"],
    project: "Banking System",
    overtime: 3,
    department: "Quality Assurance",
    salary: 3000,
  },
  {
    key: "4",
    name: "Phạm Minh D",
    roles: ["Developer"],
    project: "CRM System",
    overtime: 4,
    department: "IT",
    salary: 3000,
  },
  {
    key: "5",
    name: "Đỗ Thanh E",
    roles: ["Project Manager"],
    project: "Healthcare System",
    overtime: 6,
    department: "Management",
    salary: 3000,
  },
  {
    key: "6",
    name: "Võ Hải F",
    roles: ["HR Manager"],
    project: "Internal HR System",
    overtime: 1,
    department: "Human Resources",
    salary: 3000,
  },
  {
    key: "7",
    name: "Bùi Văn G",
    roles: ["Developer"],
    project: "AI Chatbot",
    overtime: 8,
    department: "IT",
    salary: 3000,
  },
  {
    key: "8",
    name: "Ngô Thị H",
    roles: ["Data Analyst"],
    project: "Sales Dashboard",
    overtime: 0,
    department: "Data Science",
    salary: 3000,
  },
];

function SalaryTable(): JSX.Element {
  const [searchText, setSearchText] = useState("");

  const filteredData = initialData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <Input
        prefix={<SearchOutlined className="text-gray-500" />}
        placeholder="Search By Name"
        className="w-full max-w-xs mb-4 px-4 py-2 rounded-full  border-2 border-gray-700 focus:border-blue-500 transition-all"
        onChange={(e) => setSearchText(e.target.value)}
      />
      {/* Bảng */}
      <Table<DataType>
        className="pt-1 rounded-2xl relative shadow-lg "
        columns={columns}
        dataSource={filteredData}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
}

export default SalaryTable;
