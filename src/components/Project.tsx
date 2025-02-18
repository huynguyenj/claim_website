import { Button, Input, Spin, Table, Tag, Modal, Form, DatePicker, InputNumber, Select } from "antd";
import { useState } from "react";
import { PlusOutlined, SearchOutlined, StopFilled } from "./AntdIcon";

const { Option } = Select;

interface User {
    id: string;
    name: string;
    role: string;
    department: string;
    blocked: boolean;
}

interface Project {
    id: string;
    projectName: string;
    startDate: string;
    endDate: string;
    budget: number;
    users: User[];
}

const ProjectDashboard = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [loading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(5);

    const [projects, setProjects] = useState<Project[]>([
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
        },
        {
            id: "P003",
            projectName: "Samsung",
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
        },
        {
            id: "P004",
            projectName: "Huion",
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
        },
        {
            id: "P005",
            projectName: "Walmart",
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
        },
        {
            id: "P006",
            projectName: "Starbucks",
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
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [users, setUsers] = useState<User[]>([]);
    const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [password, setPassword] = useState<string>("");

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setUsers([]);
    };

    const handleAddProject = (values: any) => {
        const newProject: Project = {
            id: `P${projects.length + 1}`.padStart(4, "0"),
            projectName: values.projectName,
            startDate: values.startDate.format("YYYY-MM-DD"),
            endDate: values.endDate.format("YYYY-MM-DD"),
            budget: values.budget,
            users: users,
        };
        setProjects([...projects, newProject]);
        handleCancel();
    };

    const addUser = () => {
        setUsers([...users, { id: `U${users.length + 1}`.padStart(4, "0"), name: "", role: "", department: "", blocked: false }]);
    };

    const handleUserChange = (index: number, field: keyof User, value: string | boolean) => {
        const newUsers = [...users];
        newUsers[index][field] = value as never;
        setUsers(newUsers);
    };

    const handleDeleteClick = (project: Project) => {
        setSelectedProject(project);
        setPasswordModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (password === "adminpassword") { // Replace with actual authentication check
            setProjects(projects.filter(p => p.id !== selectedProject?.id));
            setPasswordModalVisible(false);
            setPassword("");
        } else {
            alert("Incorrect password!");
        }
    };

    const columns = [
        { title: "Project Name", dataIndex: "projectName", key: "projectName" },
        { title: "Start Date", dataIndex: "startDate", key: "startDate" },
        { title: "End Date", dataIndex: "endDate", key: "endDate" },
        { title: "Budget ($)", dataIndex: "budget", key: "budget", render: (text: number) => `$${text.toLocaleString()}` },
        {
            title: "Actions",
            key: "actions",
            render: (_: string, record: Project) => (
                <Button icon={<StopFilled />} danger onClick={() => handleDeleteClick(record)} />
            ),
        },
    ];

    const filteredProjects = projects.filter(project =>
        project.projectName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">Project Management Dashboard</h1>

                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Add Project
                </Button>

            </div>


            <div className="mb-4">
                <Input
                    placeholder="Search project name"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                    className="max-w-md"
                    allowClear
                />
            </div>

            <Modal title="Add Project" visible={isModalVisible} onCancel={handleCancel} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={handleAddProject}>
                    <Form.Item label="Project Name" name="projectName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Budget ($)" name="budget" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <h3>Users</h3>
                    {users.map((user, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <Input placeholder="Name" value={user.name} onChange={(e) => handleUserChange(index, "name", e.target.value)} />
                            <Select placeholder="Role" value={user.role} onChange={(value) => handleUserChange(index, "role", value)}>
                                <Option value="Staff">Staff</Option>
                                <Option value="PM">Project Manager</Option>
                            </Select>
                            <Input placeholder="Department" value={user.department} onChange={(e) => handleUserChange(index, "department", e.target.value)} />
                        </div>
                    ))}
                    <Button onClick={addUser} type="dashed">+ Add User</Button>
                </Form>
            </Modal>

            <Modal title="Confirm Deletion" visible={passwordModalVisible} onCancel={() => setPasswordModalVisible(false)} onOk={handleConfirmDelete}>
                <p>Enter your password to delete the project:</p>
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </Modal>

            {loading ? (
                <div className="text-center py-12">
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredProjects}
                    rowKey="id"
                    className="shadow-sm w-full p-2"
                    pagination={{
                        pageSize: pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10"],
                        showTotal: (total) => `Total ${total} projects`,
                        onShowSizeChange: (_, size) => setPageSize(size),
                    }}
                    scroll={{ x: true }}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                columns={[
                                    { title: "Name", dataIndex: "name", key: "name" },
                                    { title: "Role", dataIndex: "role", key: "role" },
                                    { title: "Department", dataIndex: "department", key: "department" },
                                    { title: "Status", dataIndex: "blocked", key: "blocked", render: (blocked) => (<Tag color={blocked ? "red" : "green"}>{blocked ? "Blocked" : "Active"}</Tag>) },
                                ]}
                                dataSource={record.users}
                                pagination={false}
                                rowKey="id"
                            />
                        ),
                    }}
                />
            )}
        </div>
    );
};

export default ProjectDashboard;
