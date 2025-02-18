import { Button, Input, Modal,Spin, Table} from "antd";
import { useState } from "react";
import { SearchOutlined, StopFilled } from '../../components/Icon/AntdIcon';
// import Title from "antd/es/typography/Title";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    salary: number;
    blocked: boolean;
}

const UserDashboard = () => {

    const [searchText, setSearchText] = useState<string>('');
    const [loading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(5);
    const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<User | null>(null);
    const [password, setPassword] = useState<string>("");



    const [users, setUsers] = useState<User[]>(
        [
            { id: "U001", name: "Lann", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "Staff", department: "IT", salary: 5000, blocked: false },
            { id: "U002", name: "Wenduag", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "PM", department: "IT", salary: 5000, blocked: false },
            { id: "U003", name: "Woljif", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "BA", department: "IT", salary: 5000, blocked: false },
            { id: "U004", name: "Camellia", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "Finance", department: "Financing", salary: 5000, blocked: false },
            { id: "U005", name: "Seelah", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "Admin", department: "Management", salary: 5000, blocked: false },
            { id: "U006", name: "Ember", email: "lanng@gmail.com", phone: "+84 - 91 251 8309", role: "Admin", department: "Management", salary: 5000, blocked: false },
        ]
    );


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
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Role", dataIndex: "role", key: "role" },
        { title: "Department", dataIndex: "department", key: "department" },
        { title: "Salary ($)", dataIndex: "salary", key: "salary", render: (text: number) => `$${text.toLocaleString()}` },
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
        <div className="p-6 bg-gray-100 h-screen overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">User Management Dashboard</h1>
            </div>

            <div className="mb-4">
                <Input
                    placeholder="Search by name or email"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                    className="max-w-md"
                    allowClear
                />
            </div>

            <Modal title="Confirm Deletion" visible={passwordModalVisible} onCancel={() => setPasswordModalVisible(false)} onOk={handleConfirmDelete}>
                <p>Enter your password to ban the user:</p>
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </Modal>

            {loading ? (
                <div className="text-center py-12">
                    <Spin size="large" />
                </div>
            ) : (
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
            )}
        </div>
    )
};

export default UserDashboard;
