import { Article, CheckCircleOutline, DehazeOutlined, EditCalendar, EditOutlined, PersonSearch, SearchOutlined, Today } from "@mui/icons-material";
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, Spin, Table, TablePaginationConfig } from "antd";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";
import UserCard from "../../components/Admin/UserCard";
import { PlusOutlined, StopFilled } from "../../components/Icon/AntdIcon";
import { EmailIcon, PersonIcon } from "../../components/Icon/MuiIIcon";
import { Notification } from "../../components/common/Notification";
import { ApiResponse, getApiErrorMessage } from "../../consts/ApiResponse";
import { exportToExcel } from "../../consts/ExcelDownload";
import { pagnitionAntd } from "../../consts/Pagination";
import useUserData from "../../hooks/admin/useUserData";
import { Contract } from "../../model/ContractData";
import { Department } from "../../model/DepartmentData";
import { Employee } from "../../model/EmployeeData";
import { Job } from "../../model/JobData";
import { Role } from "../../model/RoleData";
import { PaginatedResponse, SearchRequest, User } from "../../model/UserData";
import apiService from "../../services/ApiService";

dayjs.extend(utc);
dayjs.extend(timezone);

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
    const [jobs, setJobs] = useState<Job[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
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
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [employeeForm] = Form.useForm();

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await apiService.get<ApiResponse<Department[]>>("/departments/get-all");

            setDepartments(response.data);
        } catch (error) {
            Notification("error", error as string);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await apiService.get<ApiResponse<Job[]>>("/jobs/get-all");

            setJobs(response.data);
        } catch (error) {
            Notification("error", error as string);
        } finally {
            setLoading(false);
        }
    };

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const response = await apiService.get<ApiResponse<Contract[]>>("/contracts/get-all");

            setContracts(response.data);
        } catch (error) {
            Notification("error", error as string);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await apiService.get<{ data: Role[] }>('/roles/get-all');
            setRoles(response.data);
        } catch (error) {
            Notification("error", error as string);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async (employeeId: string) => {
        setLoading(true);
        try {
            const response = await apiService.get<{ data: Employee }>(`/employees/${employeeId}`);
            if (response && response.data) {
                setSelectedEmployee(response.data);
                setEditingEmployee(response.data);
                employeeForm.setFieldsValue({
                    ...response.data,
                    start_date: response.data.start_date ? dayjs(response.data.start_date) : null,
                    end_date: response.data.end_date ? dayjs(response.data.end_date) : null,
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
                    is_deleted: false,
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
        fetchUsers(currentPage, pageSize, searchTerm, showBanned);
    }, [currentPage, pageSize, showBanned]);

    useEffect(() => {
        if (isEmployeeModalOpen) {
            const fetchData = async () => {
                await fetchDepartments();
                await fetchJobs();
                await fetchContracts();
                await fetchRoles();
            };
            fetchData();
        }
    }, [isEmployeeModalOpen]);

    useEffect(() => {
        if (isEditModalOpen) {
            const fetchData = async () => {
                await fetchDepartments();
                await fetchRoles();
            };
            fetchData();
        }
    }, [isEditModalOpen]);

    useEffect(() => {
        if (isAddModalOpen) {
            const fetchData = async () => {
                await fetchRoles();
            };
            fetchData();
        }
    }, [isAddModalOpen]);

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setCurrentPage(pagination.current || currentPage);
        setPageSize(pagination.pageSize || pageSize);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearchTerm(keyword);

        if (keyword === "") {
            setCurrentPage(1);
            fetchUsers(1, pageSize, "", showBanned);
        }
    };

    const handleSearchSubmit = () => {
        setCurrentPage(1);
        fetchUsers(1, pageSize, searchTerm, showBanned);
    };

    const showModal = () => setIsAddModalOpen(true);

    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        setRoles([]);
        addForm.resetFields();
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setRoles([]);
        editForm.resetFields();
    }

    const handleEmployeeCancel = () => {
        setIsEmployeeModalOpen(false);
        setDepartments([]);
        setJobs([]);
        setContracts([]);
        setRoles([]);
        employeeForm.resetFields();
    };

    const handleAddUser = async () => {
        try {
            setLoading(true);
            const values = await addForm.validateFields();
            const response = await apiService.post("/users", values);

            if (response) {
                message.success("User added successfully!");
                fetchUsers(currentPage, pageSize, searchTerm);
                handleAddCancel();
            }
        } catch (error: any) {
            const errorMessage = getApiErrorMessage(error);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        try {
            setLoading(true);
            const values = await editForm.validateFields();
            if (!editingUser) return;

            Modal.confirm({
                title: 'Confirm Update',
                content: `Do you want to update the user ${editingUser.user_name}?`,
                onOk: async () => {
                    setLoading(true);
                    try {
                        await apiService.put(`/users/${editingUser._id}`, values);
                        message.success("User updated successfully!");
                        setIsEditModalOpen(false);
                        fetchUsers(currentPage, pageSize, searchTerm);
                    } catch (error: any) {
                        const errorMessage = getApiErrorMessage(error);
                        message.error(errorMessage);
                    } finally {
                        setLoading(false);
                    }
                },
                okText: 'Update',
                cancelText: 'Cancel',
            });
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmployee = async () => {
        try {
            setLoading(true);
            const values = await employeeForm.validateFields();

            if (!editingEmployee) return;

            const updatedEmployee = {
                user_id: editingEmployee.user_id,
                ...values,
                department_code: values.department_code,
                start_date: values.start_date ? values.start_date.toISOString() : null,
                end_date: values.end_date ? values.end_date.toISOString() : null,
                updated_by: values.updated_by,
            };

            Modal.confirm({
                title: "Confirm Update",
                content: `Do you want to update the employee ${editingEmployee.full_name}?`,
                onOk: async () => {
                    setLoading(true);
                    try {
                        const response = await apiService.put(`/employees/${editingEmployee.user_id}`, updatedEmployee);
                        message.success("Employee updated successfully!");
                        setIsEmployeeModalOpen(false);
                        fetchEmployees(editingEmployee.user_id);
                    } catch (error: any) {
                        const errorMessage = getApiErrorMessage(error);
                        message.error(errorMessage);
                    } finally {
                        setLoading(false);
                    }
                },
                okText: "Update",
                cancelText: "Cancel",
            });
        } catch (error) {
            setLoading(false);
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
            Notification("error", "Failed to delete user.");
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
            Notification("error", "Failed to change user status.");
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
                    Notification("error", "Failed to update user role.");
                } finally {
                    setLoading(false);
                }
            },
            okText: 'Update Role',
            cancelText: 'Cancel',
        });
    };

    const components = {
        body: {
            cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                <td {...props} className="border-t-[1.2px] border-black" />
            ),
        },
    };

    const columns = [
        {
            title: (
                <div className="flex items-center gap-2">
                    <EmailIcon />
                    Email
                </div>
            ), dataIndex: "email", key: "email"
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <PersonIcon />
                    User Name
                </div>
            ),
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
            title: (
                <div className="flex items-center gap-2">
                    <PersonSearch />
                    Role
                </div>
            ),
            key: "role",
            render: (_: unknown, record: User) => roleMap[record.role_code] || record.role_code,
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <EditCalendar />
                    Start Date
                </div>
            ),
            dataIndex: "start_date",
            key: "start_date",
            render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <Today />
                    End Date
                </div>
            ),
            dataIndex: "end_date",
            key: "end_date",
            render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <CheckCircleOutline />
                    Status
                </div>
            ),
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
            title: (
                <div className="flex items-center gap-2">
                    <DehazeOutlined />
                    Action
                </div>
            ),
            key: "actions",
            render: (_: string, record: User) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} type="link" onClick={() => {
                        editForm.setFieldsValue(record);
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
                        prefix={<SearchOutlined onClick={handleSearchSubmit} style={{ cursor: 'pointer' }} />}
                        value={searchTerm}
                        onChange={handleSearch}
                        onPressEnter={handleSearchSubmit}
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
                                setCurrentPage(1);
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
                    onCancel={handleAddCancel}
                    onOk={handleAddUser}
                    okText="Add User"
                    cancelText="Cancel"
                >
                    <Form form={addForm} layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Email is required' },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Password is required' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords do not match');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="user_name"
                            rules={[
                                { required: true, message: "Please enter a username" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name="role_code"
                            rules={[{ required: true, message: "Please select a role" }]}
                        >
                            <Select placeholder="Select a role">
                                {roles.map((role) => (
                                    <Select.Option key={role.role_code} value={role.role_code}>
                                        {role.role_name}
                                    </Select.Option>
                                ))}
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
                                components={components}
                            />

                        </div>
                    </div>
                )}

                <Modal
                    title="Edit User"
                    open={isEditModalOpen}
                    onCancel={handleEditCancel}
                    onOk={handleUpdateUser}
                    okText="Save"
                    cancelText="Cancel"
                >
                    <Form form={editForm} layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Email is required' },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="user_name"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter a username" },
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
                    onCancel={handleEmployeeCancel}
                    onOk={handleUpdateEmployee}
                    okText="Save"
                    cancelText="Cancel"
                >
                    {loading ? (
                        <Spin />
                    ) : (
                        <Form form={employeeForm} layout="vertical">
                            <Row gutter={16}> {/* Add gutter for spacing between columns */}
                                {/* Left Column */}
                                <Col span={12}>
                                    <Form.Item label="Avatar URL" name="avatar_url">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="Full Name" name="full_name">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="Account" name="account">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="Address" name="address">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="Phone" name="phone">
                                        <Input />
                                    </Form.Item>
                                </Col>

                                {/* Right Column */}
                                <Col span={12}>
                                    <Form.Item label="Salary" name="salary" rules={[{ required: true, message: "Salary is required", type: "number" }]}>
                                        <InputNumber style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Form.Item label="Job Rank" name="job_rank" rules={[{ required: true, message: "Job rank is required" }]}>
                                        <Select>
                                            {jobs.map((job) => (
                                                <Select.Option key={job.job_rank} value={job.job_rank}>
                                                    {job.job_rank}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Contract Type" name="contract_type" rules={[{ required: true, message: "Contract type is required" }]}>
                                        <Select>
                                            {contracts.map((contract) => (
                                                <Select.Option key={contract.contract_type} value={contract.contract_type}>
                                                    {contract.contract_type}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Department" name="department_code" rules={[{ required: true, message: "Department is required" }]}>
                                        <Select placeholder="Select a department" loading={loading}>
                                            {departments.map((dept) => (
                                                <Select.Option key={dept.department_code} value={dept.department_code}>
                                                    {dept.department_code}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Start Date and End Date on the same row */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Start Date"
                                        name="start_date"
                                        rules={[{ required: true, message: 'Start date is required' }]}
                                    >
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            value={employeeForm.getFieldValue('start_date') ? dayjs(employeeForm.getFieldValue('start_date')) : null}
                                            onChange={(date) => employeeForm.setFieldsValue({ start_date: date })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="End Date"
                                        name="end_date"
                                        rules={[{ required: true, message: 'End date is required' }]}
                                    >
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            value={employeeForm.getFieldValue('end_date') ? dayjs(employeeForm.getFieldValue('end_date')) : null}
                                            onChange={(date) => employeeForm.setFieldsValue({ end_date: date })}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal>

            </div>
        </div >
    )
};