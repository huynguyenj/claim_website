import { Button, Input, Space, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useState } from "react";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a className="text-blue-500 font-medium">{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") color = "volcano";
          if (tag === "developer") color = "purple";
          if (tag === "teacher") color = "blue";

          return (
            <Tag color={color} key={tag} className="px-3 py-1 rounded-full">
              {tag.toUpperCase()}
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
        <Button type="primary" className="px-4">
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
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "4",
    name: "Anna Smith",
    age: 29,
    address: "Toronto No. 2 Lake Park",
    tags: ["designer", "creative"],
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
        placeholder="Tìm kiếm nhân viên..."
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
