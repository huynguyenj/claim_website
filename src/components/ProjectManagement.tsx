// src/pages/ProjectManagement.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, message, Select } from 'antd';
import apiService from '../services/ApiService';
import { User } from '../types/user';
import { Project } from '../types/project';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ProjectManagement: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [form] = Form.useForm();
    const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await apiService.get<{ data: Project[] }>('/projects');
            setProjects(response.data);
        } catch (error) {
            message.error('Failed to fetch projects');
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await apiService.get<{ data: User[] }>('/users');
            setUsers(response.data);
        } catch (error) {
            message.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const handleAddProject = () => {
        setEditingProject(null);
        form.resetFields();
        setAssignedUsers([]);
        setIsModalVisible(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        form.setFieldsValue({
            name: project.name,
            budget: project.budget,
            dateRange: [moment(project.startDate), moment(project.endDate)]
        });
        setAssignedUsers(project.assignedUsers || []);
        setIsModalVisible(true);
    };

    const handleDeleteProject = async (id: string) => {
        try {
            await apiService.delete(`/projects/${id}`);
            message.success('Project deleted successfully');
            fetchProjects();
        } catch (error) {
            message.error('Failed to delete project');
        }
    };

    const handleAddUserToProject = (userId: string) => {
        if (assignedUsers.length >= 6) {
            message.error('Cannot add more than 6 users to a project');
            return;
        }
        if (assignedUsers.includes(userId)) {
            message.error('User already assigned to the project');
            return;
        }
        setAssignedUsers([...assignedUsers, userId]);
    };

    const handleRemoveUserFromProject = (userId: string) => {
        setAssignedUsers(assignedUsers.filter(id => id !== userId));
    };

    const handleFormSubmit = async (values: any) => {
        const payload = {
            name: values.name,
            budget: values.budget,
            startDate: values.dateRange[0].format('YYYY-MM-DD'),
            endDate: values.dateRange[1].format('YYYY-MM-DD'),
            assignedUsers: assignedUsers
        };
        try {
            if (editingProject) {
                await apiService.put(`/projects/${editingProject.id}`, payload);
                message.success('Project updated successfully');
            } else {
                await apiService.post('/projects', payload);
                message.success('Project added successfully');
            }
            setIsModalVisible(false);
            fetchProjects();
        } catch (error) {
            message.error('Failed to submit project form');
        }
    };

    const columns = [
        { title: 'Project Name', dataIndex: 'name', key: 'name' },
        { title: 'Budget', dataIndex: 'budget', key: 'budget' },
        { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
        { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
        {
            title: 'Assigned Users',
            dataIndex: 'assignedUsers',
            key: 'assignedUsers',
            render: (assigned: string[]) => (
                <span>
                    {assigned && assigned.map((id: string) => {
                        const user = users.find(u => u.id === id);
                        return user ? user.name : id;
                    }).join(', ')}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Project) => (
                <div className="flex space-x-2">
                    <Button type="primary" onClick={() => handleEditProject(record)}>Edit</Button>
                    <Button danger onClick={() => handleDeleteProject(record.id)}>Delete</Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Project Management</h2>
                <Button type="primary" onClick={handleAddProject}>Add Project</Button>
            </div>
            <Table
                dataSource={Array.isArray(projects) ? projects : []}
                columns={columns}
                rowKey="id"
                loading={loading}
                className="bg-white"
            />

            <Modal
                title={editingProject ? "Edit Project" : "Add Project"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form form={form} onFinish={handleFormSubmit} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please input the project name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="budget"
                        label="Budget"
                        rules={[{ required: true, message: 'Please input the budget!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="dateRange"
                        label="Project Duration"
                        rules={[{ required: true, message: 'Please select the date range!' }]}
                    >
                        <RangePicker />
                    </Form.Item>
                    <Form.Item label="Assign Users">
                        <Select
                            placeholder="Select a user to add"
                            onSelect={(value: string) => handleAddUserToProject(value)}
                            style={{ width: '100%' }}
                        >
                            {(Array.isArray(users) ? users : []).map(user => (
                                <Option key={user.id} value={user.id}>
                                    {user.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {assignedUsers.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Assigned Users</h4>
                            <Table
                                dataSource={assignedUsers.map(id => {
                                    const user = users.find(u => u.id === id);
                                    return { key: id, id, name: user ? user.name : id, email: user ? user.email : '' };
                                })}
                                columns={[
                                    { title: 'Name', dataIndex: 'name', key: 'name' },
                                    { title: 'Email', dataIndex: 'email', key: 'email' },
                                    {
                                        title: 'Action',
                                        key: 'action',
                                        render: (_: any, record: any) => (
                                            <Button danger onClick={() => handleRemoveUserFromProject(record.id)}>Remove</Button>
                                        )
                                    }
                                ]}
                                pagination={false}
                                rowKey="id"
                            />
                        </div>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingProject ? "Update Project" : "Add Project"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectManagement;
