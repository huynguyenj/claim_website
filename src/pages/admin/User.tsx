import { Article, EditOutlined, SearchOutlined } from "@mui/icons-material";
import { Button, DatePicker, Form, Input, message, Modal, Select, Spin, Table } from "antd";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import UserCard from "../../components/Admin/UserCard";
import { PlusOutlined, StopFilled } from "../../components/Icon/AntdIcon";
import { Notification } from "../../components/common/Notification";
import { ApiResponse } from "../../consts/ApiResponse";
import { exportToExcel } from "../../consts/ExcelDownload";
import { pagnitionAntd } from "../../consts/Pagination";
import useUserData from "../../hooks/admin/useUserData";
import { Department } from "../../model/DepartmentData";
import { Employee } from "../../model/EmployeeData";
import { Role } from "../../model/RoleData";
import { PaginatedResponse, SearchRequest, User } from "../../model/UserData";
import apiService from "../../services/ApiService";
import { Rule } from "antd/es/form";

export default function UserManagement() {

    const { totalUsers, totalUsersThisMonth, totalUsersVerified, userLoading } = useUserData();

    const roleMap: Record<string, string> = {
        A001: "Administrator",
        A002: "Finance",
        A003: "BUL, PM",
        A004: "All Members Remaining",
    };

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);


    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(pagnitionAntd.pageSize);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [showBanned, setShowBanned] = useState<boolean | null>(null);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [form] = Form.useForm();

    const convertToUTC7 = (utcDate: string) => {
        return moment.utc(utcDate).tz('Asia/Jakarta').format('YYYY-MM-DD');
    };

    const validateEmail = (rule: Rule, value: string, callback: (error?: string) => void) => {
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        if (!emailRegex.test(value)) {
            callback('Invalid email address');
        } else {
            callback();
        }
    };

    const validatePassword = (rule: Rule, value: string, callback: (error?: string) => void) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(value)) {
            callback('Password must contain at least 8 characters, including uppercase, lowercase, and numbers');
        } else {
            callback();
        }
    };

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await apiService.get<ApiResponse<Department[]>>("/departments/get-all");

            console.log("Departments:", response.data);
            setDepartments(response.data);
        } catch (error) {
            message.error("Failed to fetch departments");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async (employeeId: string) => {
        try {
            setLoading(true);
            const response = await apiService.get<{ data: Employee }>(`/employees/${employeeId}`);

            if (response && response.data) {
                setSelectedEmployee(response.data);
                setEditingEmployee(response.data);
                form.setFieldsValue({
                    ...response.data,
                    start_date: moment(response.data.start_date),
                    end_date: moment(response.data.end_date),
                });
                setIsEmployeeModalOpen(true);
            } else {
                Notification("error", "Employee not found");
            }
        } catch (error) {
            Notification("error", error as string);
        } finally {
            setLoading(false);
        }
    };

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
            Notification("error", error as string);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchUsers(currentPage, pageSize, searchTerm, showBanned);
        }, 2000);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, currentPage, pageSize, showBanned]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await apiService.get<{ data: Role[] }>('/roles/get-all');
                setRoles(response.data);
                console.log(roles)
            } catch (error) {
                Notification("error", error as string);
            }
        };
        fetchRoles();
    }, []);

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
        setIsEmployeeModalOpen(false);
        form.resetFields();
    };

    const handleAddUser = async () => {
        try {
            const values = await form.validateFields();
            const response = await apiService.post("/users", values);

            if (response) {
                message.success("User added successfully!");
                fetchUsers(currentPage, pageSize, searchTerm);
                handleCancel();
            }
        } catch (error: any) {
            if (error.response && error.response.data.message.includes('already exists')) {
                form.setFields([
                    {
                        name: 'user_name',
                        errors: ['This username is already taken'],
                    },
                ]);
                Notification("error", "Username already exists!");
            }
        }
    };

    const handleUpdateUser = async () => {
        try {
            const values = await form.validateFields();
            if (!editingUser) return;

            Modal.confirm({
                title: 'Confirm Update',
                content: `Do you want to update the user ${editingUser.user_name}?`,
                onOk: async () => {
                    setLoading(true);
                    await apiService.put(`/users/${editingUser._id}`, values);
                    message.success("User updated successfully!");
                    setIsEditModalOpen(false);
                    fetchUsers(currentPage, pageSize, searchTerm);
                },
                okText: 'Update',
                cancelText: 'Cancel',
            });
        } catch (error) {
            console.error("Update failed:", error);
            message.error("Failed to update user.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmployee = async () => {
        try {
            const values = await form.validateFields();
            console.log("Form Values:", values);

            if (!editingEmployee) {
                console.error("No employee selected for editing");
                return;
            }

            const updatedEmployee = {
                user_id: editingEmployee.user_id,
                ...values,
                department_code: values.department_code,
                start_date: values.start_date.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                end_date: values.end_date.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                updated_by: values.updated_by,
            };

            console.log("Updated Employee Data:", updatedEmployee);
            console.log("Editing Employee ID:", editingEmployee.user_id);

            Modal.confirm({
                title: "Confirm Update",
                content: `Do you want to update the employee ${editingEmployee.full_name}?`,
                onOk: async () => {
                    setLoading(true);
                    const response = await apiService.put(`/employees/${editingEmployee.user_id}`, updatedEmployee);
                    console.log("API Response:", response);
                    message.success("Employee updated successfully!");
                    setIsEmployeeModalOpen(false);
                    fetchEmployees(editingEmployee.user_id);
                },
                okText: "Update",
                cancelText: "Cancel",
            });
        } catch (error) {
            console.error("Update failed:", error);
            Notification("error", "Failed to update employee.");
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

        Modal.confirm({
            title: 'Confirm Role Change',
            content: `Do you want to change ${editingUser.user_name}'s role to ${roleMap[selectedRole]}?`,
            onOk: async () => {
                try {
                    setLoading(true);
                    await apiService.put("/users/change-role", {
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
            },
            okText: 'Update Role',
            cancelText: 'Cancel',
        });
    };

    const columns = [
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Username",
            dataIndex: "user_name",
            key: "user_name",
            render: (text: string, record: User) => (
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => fetchEmployees(record._id)}
                >
                    {text}
                </button>
            ),
        },
        {
            title: "Role",
            key: "role",
            render: (_: any, record: User) => roleMap[record.role_code] || record.role_code,
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            render: (text: string) => convertToUTC7(text),
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
            render: (text: string) => convertToUTC7(text),
        },
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
                        onClick={() => {
                            Modal.confirm({
                                title: 'Confirm Status Change',
                                content: `Do you want to ${record.is_blocked ? 'unban' : 'ban'} the user ${record.user_name}?`,
                                onOk: () => handleChangeUserStatus(record._id, !record.is_blocked),
                                okText: 'Confirm',
                                cancelText: 'Cancel',
                            });
                        }}
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
                    }}></Button>

                    <Button
                        icon={<StopFilled />}
                        type="link"
                        danger
                        onClick={() => {
                            Modal.confirm({
                                title: 'Confirm Deletion',
                                content: `Do you want to delete the user ${record.user_name}?`,
                                onOk: () => handleDeleteUser(record._id),
                                okText: 'Delete',
                                cancelText: 'Cancel',
                            });
                        }}
                    ></Button>
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
                    icon={<Article />}
                    title="Total Users"
                    data={totalUsers}
                    growth={42}
                    loading={userLoading}
                />
                {/* Claims */}
                <UserCard
                    icon={<Article />}
                    title="New Users This Month"
                    data={totalUsersThisMonth}
                    growth={42}
                    loading={userLoading}
                />
                {/* Funds */}
                <UserCard
                    icon={<Article />}
                    title="Verified Users"
                    data={totalUsersVerified}
                    growth={42}
                    loading={userLoading}
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
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Email is required' },
                                { validator: validateEmail },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Password is required' },
                                { validator: validatePassword },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="user_name"
                            rules={[
                                { required: true, message: "Please enter a username" },
                                {
                                    validator: async (_, value) => {
                                        // Optional: Add client-side uniqueness check
                                        if (value && users.some(user => user.user_name === value)) {
                                            return Promise.reject('Username already exists');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
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
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
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
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Email is required' },
                                { validator: validateEmail },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="user_name"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter a username" },
                                {
                                    validator: async (_, value) => {
                                        // Optional: Add client-side uniqueness check
                                        if (value && users.some(user => user.user_name === value)) {
                                            return Promise.reject('Username already exists');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}>
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

                <Modal
                    title="Employee Details"
                    open={isEmployeeModalOpen}
                    onCancel={() => {
                        setIsEmployeeModalOpen(false);
                        form.resetFields();
                    }}
                    onOk={handleUpdateEmployee}
                    okText="Save"
                    cancelText="Cancel"
                >
                    {loading ? (
                        <Spin />
                    ) : (
                        <Form form={form} layout="vertical">
                            <Form.Item label="User ID" name="user_id">
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item label="Avatar URL" name="avatar_url">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Full Name" name="full_name" rules={[{ required: true, message: "Full name is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Job Rank" name="job_rank" rules={[{ required: true, message: "Job rank is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Contract Type" name="contract_type" rules={[{ required: true, message: "Contract type is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Account" name="account" rules={[{ required: true, message: "Account is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Address" name="address" rules={[{ required: true, message: "Address is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Phone is required" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Department" name="department_code">
                                <Select placeholder="Select a department" loading={loading}>
                                    {departments.map((dept) => (
                                        <Select.Option key={dept.department_code} value={dept.department_code}>
                                            {dept.department_code}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Salary" name="salary" rules={[{ required: true, message: "Salary is required", type: "number" }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item label="Start Date" name="start_date" rules={[{ required: true, message: "Start date is required" }]}>
                                <DatePicker format="YYYY-MM-DD" />
                            </Form.Item>

                            <Form.Item label="End Date" name="end_date" rules={[{ required: true, message: "End date is required" }]}>
                                <DatePicker format="YYYY-MM-DD" />
                            </Form.Item>

                            <Form.Item label="Updated By" name="updated_by">
                                <Input readOnly />
                            </Form.Item>
                        </Form>
                    )}
                </Modal>
            </div>
        </div >
    )
};