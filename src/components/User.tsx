import { Table, Tag } from "antd";
import React, { useState } from "react";

const UserDashboard = () => {

    const [users] = useState(
        [
            { id: "U001", name: "Lann", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "Staff", department: "IT", salary: 5000, blocked: false },
            { id: "U002", name: "Wenduag", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "PM", department: "IT", salary: 5000, blocked: false },
            { id: "U003", name: "Woljif", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "BA", department: "IT", salary: 5000, blocked: false },
            { id: "U004", name: "Camellia", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "Finance", department: "Financing", salary: 5000, blocked: false },
            { id: "U005", name: "Seelah", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "Admin", department: "Management", salary: 5000, blocked: false },
        ]
    );

    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Role", dataIndex: "role", key: "role" },
        { title: "Department", dataIndex: "department", key: "department" },
        { title: "Salary ($)", dataIndex: "salary", key: "salary", render: (text: number) => `$${text.toLocaleString()}` },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <Table
                className="shadow-lg"
                columns={columns}
                dataSource={users}
                rowKey="id"
            />
        </div>
    )
};

export default UserDashboard;
