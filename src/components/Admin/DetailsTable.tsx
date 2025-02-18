import React from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";

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
    render: (text) => <a>{text}</a>,
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
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
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
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
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
    name: "Alice White",
    age: 29,
    address: "Toronto No. 2 Lake Park",
    tags: ["friendly", "designer"],
  },
  {
    key: "5",
    name: "Michael Johnson",
    age: 35,
    address: "San Francisco No. 3 Lake Park",
    tags: ["experienced", "manager"],
  },
  {
    key: "6",
    name: "Emily Davis",
    age: 27,
    address: "Chicago No. 4 Lake Park",
    tags: ["creative", "artist"],
  },
  {
    key: "7",
    name: "David Wilson",
    age: 40,
    address: "Houston No. 5 Lake Park",
    tags: ["leader", "entrepreneur"],
  },
  {
    key: "8",
    name: "Sophia Martinez",
    age: 31,
    address: "Los Angeles No. 6 Lake Park",
    tags: ["enthusiastic", "developer"],
  },
  {
    key: "9",
    name: "James Anderson",
    age: 45,
    address: "Miami No. 7 Lake Park",
    tags: ["hardworking", "engineer"],
  },
  {
    key: "10",
    name: "Olivia Taylor",
    age: 33,
    address: "Seattle No. 8 Lake Park",
    tags: ["dedicated", "nurse"],
  },
];

const DetailsTable: React.FC = () => (
  <Table<DataType> columns={columns} dataSource={data} scroll={{ x: 1000 }} />
);

export default DetailsTable;
