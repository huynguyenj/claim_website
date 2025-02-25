import { Button, Col, Form, Input, Modal, Row, Spin, Table } from "antd";
import { useState } from "react";
import { PlusOutlined, SearchOutlined, StopFilled } from '../../components/Icon/AntdIcon';
import { exportToExcel } from "../../consts/ExcelDowload";
// import Title from "antd/es/typography/Title";

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    department: string;
    salary: number;
    address: string;
    blocked: boolean;
}

const UserDashboard = () => {

    const [searchText, setSearchText] = useState<string>('');
    const [loading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(5);
    const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<User | null>(null);
    const [password, setPassword] = useState<string>("");
    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();

    const [users, setUsers] = useState<User[]>(
        [
            { id: "U001", name: "Lann", email: "lanng@gmail.com", password: "123", phone: "+84 - 91 251 8309", role: "Staff", department: "IT", salary: 5000, address: "25 St.Michael Str, Rockefeller Ave.", blocked: false },
            { id: "U002", name: "Wenduag", email: "lanng@gmail.com", password: "123", phone: "+84 - 91 251 8309", role: "PM", department: "IT", salary: 5000, address: "25 St.Michael Str, Rockefeller Ave.", blocked: false },
            { id: "U003", name: "Woljif", email: "lanng@gmail.com", password: "123", phone: "+84 - 91 251 8309", role: "BA", department: "IT", salary: 5000, address: "25 St.Michael Str, Rockefeller Ave.", blocked: false },
            { id: "U004", name: "Camellia", email: "lanng@gmail.com", password: "123", phone: "+84 - 91 251 8309", role: "Finance", department: "Financing", salary: 5000, address: "25 St.Michael Str, Rockefeller Ave.", blocked: false },
            { id: "U005", name: "Seelah", email: "lanng@gmail.com", password: "123", phone: "+84 - 91 251 8309", role: "Admin", department: "Management", salary: 5000, address: "25 St.Michael Str, Rockefeller Ave.", blocked: false },
            { id: "U006", name: "Ember", email: "lanng@gmail.com", password: "123", phone: "+84 - 91 251 8309", role: "Admin", department: "Management", salary: 5000, address: "25 St.Michael Str, Rockefeller Ave.", blocked: false },
        ]
    );


    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
    };

    const handleAddUser = (values: any) => {
        const newUser: User = {
            id: `P${users.length + 1}`.padStart(4, "0"),
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            role: values.role,
            department: values.department,
            salary: values.salary,
            address: values.address,
            blocked: false,
        };
        setUsers([...users, newUser]);
        handleAddCancel();
    };


    const handleDeleteClick = (project: User) => {
        setSelectedProject(project);
        setPasswordModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (password === "adminpassword") { // Replace with actual authentication check
            setUsers(users.filter(p => p.id !== selectedProject?.id));
            setPasswordModalVisible(false);
            setPassword("");

        } else {
            alert("Incorrect password!");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Role", dataIndex: "role", key: "role" },
        { title: "Department", dataIndex: "department", key: "department" },
        { title: "Salary ($)", dataIndex: "salary", key: "salary", render: (text: number) => `$${text.toLocaleString()}` },
        { title: "Address", dataIndex: "address", key: "address" },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: string, record: User) => (
                <Button icon={<StopFilled />} danger onClick={() => handleDeleteClick(record)} />

            ),
        },
    ];

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.department.toLowerCase().includes(searchText.toLowerCase())
    );

    return (

        <>
            <div className="flex justify-between items-center p-5">
                <div className="font-bold text-2xl">Welcome Back, John</div>
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => exportToExcel(users, ['id', 'name', 'email', 'password', 'phone', 'role', 'department', 'salary', 'address'], 'users')}>Export users file</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FCFCFC] p-5 overflow-auto">
                {/* Users */}
                <div className="col-span-1 relative bg-white p-3 rounded-xl border border-gray-200 flex flex-col shadow-[9px_6px_0px_rgba(0,0,0,1)]">
                    <p className="text-md text-gray-600 font-bold">Total Projects</p>
                    <p className="text-sm text-gray-400">6</p>
                </div>
                {/* Claims */}
                <div className="col-span-1 relative bg-white p-3 rounded-xl border border-gray-200 flex flex-col shadow-[9px_6px_0px_rgba(0,0,0,1)]">
                    <p className="text-md text-gray-600 font-bold">Recent Projects</p>
                    <p className="text-sm text-gray-400">2</p>
                </div>
                {/* Funds */}
                <div className="col-span-1 relative bg-white p-3 rounded-xl border border-gray-200 flex flex-col shadow-[9px_6px_0px_rgba(0,0,0,1)]">
                    <p className="text-md text-gray-600 font-bold">Finished Projects</p>
                    <p className="text-sm text-gray-400">1</p>
                </div>
            </div>

            <div className="p-6 m-5 rounded-2xl border-black border-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]">

                <div className="mb-4 flex justify-between items-center">
                    <Input
                        placeholder="Search by name or email"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                        className="max-w-md shadow-[9px_6px_0px_rgba(0,0,0,1)]"
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}
                    >
                        Add User
                    </Button>
                </div>


                <Modal
                    title="Add User"
                    visible={isAddModalVisible}
                    onCancel={handleAddCancel}
                    onOk={() => form.submit()}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddUser}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Phone"
                                    name="phone"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Role"
                                    name="role"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Department"
                                    name="department"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Salary"
                                    name="salary"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>

                <Modal title="Confirm Deletion" visible={passwordModalVisible} onCancel={() => setPasswordModalVisible(false)} onOk={handleConfirmDelete}>
                    <p>Enter your password to ban the user:</p>
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                </Modal>

                {loading ? (
                    <div className="text-center py-12">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="overflow-x">
                        <Table
                            columns={columns}
                            dataSource={filteredUsers}
                            rowKey="id"
                            className="shadow-sm w-full p-2"
                            pagination={{
                                pageSize: pageSize,
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10"],
                                showTotal: (total) => `Total ${total} users`,
                                onShowSizeChange: (_, size) => setPageSize(size),
                            }}
                            scroll={{ x: true }}
                        />
                    </div>
                )}
            </div >
        </>
    )
};

export default UserDashboard;
