import { useEffect, useState } from "react";
import apiService from "../../services/ApiService";
import { Button, Input, message, Spin, Table, Form, Modal, Select } from "antd";
import { PaginatedResponse, SearchRequest, User } from "../../model/UserData";
import { exportToExcel } from "../../consts/ExcelDowload";
import UserCard from "../../components/Admin/UserCard";
import { UserIcon } from "../../components/Icon/MuiIIcon";
import { Article, EditOutlined, SearchOutlined } from "@mui/icons-material";
import { PlusOutlined, StopFilled } from "../../components/Icon/AntdIcon";
import { Notification } from "../../components/Notification";
import { getApiErrorMessage } from "../../consts/ApiResponse";
import { pagnitionAntd } from "../../consts/Pagination";

export default function UserManagement() {

    const roleMap: Record<string, string> = {
        A001: "Administrator",
        A002: "Finance",
        A003: "BUL, PM",
        A004: "All Members Remaining",
    };

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);


    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(pagnitionAntd.pageSize);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showBanned, setShowBanned] = useState<boolean | null>(null);
    const [form] = Form.useForm();

    const fetchUsers = async (page: number, size: number, keyword: string, isBlocked?: boolean | null) => {
        setLoading(true);
        try {
            const searchParams: SearchRequest = {
                searchCondition: {
                    keyword,
                    role_code: '',
                    is_delete: false,
                    is_verified: '',
                },
                pageInfo: {
                    pageNum: page,
                    pageSize: size,
                },
            };


            if (isBlocked !== null) {
                searchParams.searchCondition.is_blocked = isBlocked;
            }

            const response = await apiService.post<PaginatedResponse>('/users/search', searchParams);
            if (response) {
                setUsers(response.data.pageData);
                setTotalItems(response.data.pageInfo.totalItems);
            }

        } catch (error) {
            console.error('Failed to fetch users:', error);
            Notification('error', getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers(currentPage, pageSize, searchTerm, showBanned);
    }, [currentPage, pageSize, searchTerm, showBanned]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const showModal = () => setIsAddModalOpen(true);

    const handleCancel = () => {
        setIsAddModalOpen(false);
        form.resetFields();
    };

    const handleAddUser = async () => {

        try {
            const values = await form.validateFields();
            console.log(values)
            const response = await apiService.post("/users", values);
            if (response) {
                message.success("User added successfully!");
                fetchUsers(currentPage, pageSize, searchTerm);
                handleCancel();
            }
        } catch (error) {
            console.error("Failed to add user:", error);
            message.error("Error adding user.");
        }
    };

    const handleUpdateUser = async () => {
        try {
            const values = await form.validateFields();
            if (!editingUser) return;

            setLoading(true);
            await apiService.put(`/users/${editingUser._id}`, values);

            message.success("User updated successfully!");
            setIsEditModalOpen(false);
            fetchUsers(currentPage, pageSize, searchTerm);
        } catch (error) {
            console.error("Update failed:", error);
            message.error("Failed to update user.");
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteUser = async (id: string) => {
        try {
            await apiService.delete(`/users/${id}`);
            message.success("User deleted successfully!");
            fetchUsers(currentPage, pageSize, searchTerm);
        } catch (error) {
            message.error("Failed to delete user.");
            console.error(error);
        }
    };

    const handleChangeUserStatus = async (userId: string, isBlocked: boolean) => {
        try {
            setLoading(true);
            await apiService.put(`/users/change-status`, {
                user_id: userId,
                is_blocked: isBlocked
            });

            message.success(`User ${isBlocked ? "banned" : "unbanned"} successfully!`);
            fetchUsers(currentPage, pageSize, searchTerm);
        } catch (error) {
            console.error("Failed to change user status:", error);
            message.error("Failed to change user status.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeUserRole = async () => {
        if (!editingUser || !selectedRole) return;

        try {
            setLoading(true);
            const response = await apiService.put("/users/change-role", {
                user_id: editingUser._id,
                role_code: selectedRole,
            });

            message.success("User role updated successfully!");
            fetchUsers(currentPage, pageSize, searchTerm);
            setIsRoleModalOpen(false);
        } catch (error) {
            console.error("Failed to change role:", error);
            message.error("Error updating user role.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Username", dataIndex: "user_name", key: "user_name",
        },
        { title: "Role", dataIndex: "role_code", key: "role_code" },
        {
            title: "Status",
            key: "status",
            render: (_: string, record: User) => (
                <div className="relative">
                    <button
                        className={`p-2 rounded-lg transition-all duration-500 w-24 border ${record.is_blocked
                            ? "border-red-500 text-black hover:border-green-500 hover:text-black"
                            : "border-green-500 text-black hover:border-red-500 hover:text-black"
                            }`}
                        onMouseEnter={(e) => (e.currentTarget.innerText = record.is_blocked ? "Unban" : "Ban")}
                        onMouseLeave={(e) => (e.currentTarget.innerText = record.is_blocked ? "Banned" : "Active")}
                        onClick={() => handleChangeUserStatus(record._id, !record.is_blocked)}
                    >
                        {record.is_blocked ? "Banned" : "Active"}
                    </button>

                </div>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: string, record: User) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} type="link" onClick={() => {
                        form.setFieldsValue(record);
                        setEditingUser(record);
                        setIsEditModalOpen(true);
                    }}>
                    </Button>

                    <Button icon={<StopFilled />} type="link" danger onClick={() => handleDeleteUser(record._id)}></Button>
                </div>
            ),
        },
    ];

    return (
        <div className="overflow-y-scroll">
            <div className="flex justify-end items-center p-5">
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => exportToExcel(users, ['id', 'name', 'email', 'password', 'phone', 'role', 'department', 'salary', 'address'], 'users')}>Export users file</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FCFCFC] p-5">
                {/* Users */}
                <UserCard
                    icon={<UserIcon />}
                    title="Total Users"
                    growth={25}
                />
                {/* Claims */}
                <UserCard
                    icon={<Article />}
                    title="New Users"
                    growth={42}
                />
                {/* Funds */}
                <UserCard
                    icon={<Article />}
                    title="Funds"
                    growth={42}
                />
            </div>

            <div className="p-6 m-5 rounded-2xl border-black border-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                <div className="mb-4 flex items-center">
                    <Input
                        placeholder="Search by name or email"
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={handleSearch}
                        size="large"
                        className="max-w-md shadow-[9px_6px_0px_rgba(0,0,0,1)]"
                        allowClear
                    />

                    <div className="ml-auto flex gap-2">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showModal}
                        >
                            Add User
                        </Button>

                        <Select
                            className="w-fit"
                            placeholder="User Status"
                            value={showBanned}
                            onChange={(value) => {
                                setShowBanned(value);
                                setCurrentPage(1); // Reset pagination
                                fetchUsers(1, pageSize, searchTerm, value);
                            }}
                            options={[
                                { value: false, label: "Active Users" },
                                { value: true, label: "Banned Users" },
                            ]}
                        />
                    </div>

                </div>

                <Modal
                    title="Add New User"
                    open={isAddModalOpen}
                    onCancel={handleCancel}
                    onOk={handleAddUser}
                    okText="Add User"
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please enter an email" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter a password" }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="user_name"
                            rules={[{ required: true, message: "Please enter a username" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name="role_code"
                            rules={[{ required: true, message: "Please select a role" }]}
                        >
                            <Select>
                                <Select.Option value="A001">Administrator</Select.Option>
                                <Select.Option value="A002">Finance</Select.Option>
                                <Select.Option value="A003">BUL, PM</Select.Option>
                                <Select.Option value="A004">All Members Remaining</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                {loading ? (
                    <div className="text-center py-12">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="overflow-x">
                        <Table
                            columns={columns}
                            dataSource={users}
                            loading={loading}
                            rowKey="_id"
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10", "20"],
                            }}
                            onChange={handleTableChange}
                        />
                    </div>
                )}

                <Modal
                    title="Edit User"
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    onOk={handleUpdateUser}
                    okText="Save"
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email is required" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="user_name" label="Username" rules={[{ required: true, message: "Username is required" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="role_code" label="Role">
                            <Input value={roleMap[editingUser?.role_code || ""]} readOnly />
                            <div
                                className="text-blue-500 flex justify-end font-medium p-2 hover:text-blue-600 hover:underline cursor-pointer"
                                onClick={() => {
                                    setSelectedRole(editingUser?.role_code || "");
                                    setIsRoleModalOpen(true);
                                }}
                            >
                                Change role
                            </div>

                            <Modal
                                title="Change User Role"
                                open={isRoleModalOpen}
                                onCancel={() => setIsRoleModalOpen(false)}
                                onOk={handleChangeUserRole}
                                okText="Update Role"
                                cancelText="Cancel"
                            >
                                <Form layout="vertical">
                                    <Form.Item label="Select New Role">
                                        <Select value={selectedRole} onChange={setSelectedRole}>
                                            <Select.Option value="A001">Administrator</Select.Option>
                                            <Select.Option value="A002">Finance</Select.Option>
                                            <Select.Option value="A003">BUL, PM</Select.Option>
                                            <Select.Option value="A004">All Members Remaining</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Modal>


                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        </div>
    )
};