// src/pages/UserManagement.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import apiService from '../services/ApiService';
import { User } from '../types/user';

const { Option } = Select;

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiService.get<{ data: User[] }>('/users');
            setUsers(response.data);
        } catch (error) {
            message.error('Failed to fetch users');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await apiService.delete(`/users/${id}`);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleBlockUser = async (user: User) => {
        // Assume blocking a user means updating a “blocked” property.
        try {
            await apiService.put(`/users/${user.id}`, { ...user, blocked: true });
            message.success('User blocked successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to block user');
        }
    };

    const handleFormSubmit = async (values: any) => {
        try {
            if (editingUser) {
                await apiService.put(`/users/${editingUser.id}`, values);
                message.success('User updated successfully');
            } else {
                await apiService.post('/users', values);
                message.success('User added successfully');
            }
            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            message.error('Failed to submit user form');
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Salary', dataIndex: 'salary', key: 'salary' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <div className="flex space-x-2">
                    <Button type="primary" onClick={() => handleEditUser(record)}>Edit</Button>
                    <Button danger onClick={() => handleDeleteUser(record.id)}>Delete</Button>
                    <Button onClick={() => handleBlockUser(record)}>Block</Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Button type="primary" onClick={handleAddUser}>Add User</Button>
            </div>
            <Table
                dataSource={Array.isArray(users) ? users : []}
                columns={columns}
                rowKey="id"
                loading={loading}
                className="bg-white"
            />

            <Modal
                title={editingUser ? "Edit User" : "Add User"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleFormSubmit} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input the email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: 'Please input the phone!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="department"
                        label="Department"
                        rules={[{ required: true, message: 'Please input the department!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="salary"
                        label="Salary"
                        rules={[{ required: true, message: 'Please input the salary!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select the role!' }]}
                    >
                        <Select>
                            <Option value="admin">Admin</Option>
                            <Option value="user">User</Option>
                            <Option value="BA/PM">BA/PM</Option>
                            <Option value="finance">Finance</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingUser ? "Update" : "Add"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
