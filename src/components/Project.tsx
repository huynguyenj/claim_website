import { Table, Tag } from "antd";
import { useState } from "react";

const ProjectDashboard = () => {
    const [projects] = useState([
        {
            id: "P001",
            projectName: "Microsoft",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            budget: 100000,
            users: [
                { id: "U001", name: "Lann", role: "Staff", department: "IT", blocked: false },
                { id: "U002", name: "Wenduag", role: "PM", department: "IT", blocked: false },
                { id: "U003", name: "Woljif", role: "BA", department: "IT", blocked: false },
                { id: "U004", name: "Camellia", role: "Finance", department: "Financing", blocked: false },
                { id: "U005", name: "Seelah", role: "Admin", department: "Management", blocked: false },
            ]
        },
        {
            id: "P002",
            projectName: "Apple",
            startDate: "2025-02-01",
            endDate: "2025-11-30",
            budget: 150000,
            users: [
                { id: "U001", name: "Lann", role: "Staff", department: "IT", blocked: false },
                { id: "U002", name: "Wenduag", role: "PM", department: "IT", blocked: false },
                { id: "U003", name: "Woljif", role: "BA", department: "IT", blocked: false },
                { id: "U004", name: "Camellia", role: "Finance", department: "Financing", blocked: false },
                { id: "U005", name: "Seelah", role: "Admin", department: "Management", blocked: false },
            ]
        }
    ]);

    const columns = [
        { title: "Project Name", dataIndex: "projectName", key: "projectName" },
        { title: "Start Date", dataIndex: "startDate", key: "startDate" },
        { title: "End Date", dataIndex: "endDate", key: "endDate" },
        { title: "Budget ($)", dataIndex: "budget", key: "budget", render: (text: number) => `$${text.toLocaleString()}` },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Project Dashboard</h1>
            <Table
                className="shadow-lg"
                columns={columns}
                dataSource={projects}
                rowKey="id"
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            columns={[
                                { title: "Name", dataIndex: "name", key: "name" },
                                { title: "Role", dataIndex: "role", key: "role" },
                                { title: "Department", dataIndex: "department", key: "department" },
                                {
                                    title: "Status",
                                    dataIndex: "blocked",
                                    key: "blocked",
                                    render: (blocked) => (
                                        <Tag color={blocked ? "red" : "green"}>{blocked ? "Blocked" : "Active"}</Tag>
                                    )
                                }
                            ]}
                            dataSource={record.users}
                            pagination={false}
                            rowKey="id"
                        />
                    )
                }}
            />
        </div>
    );
};

export default ProjectDashboard;
