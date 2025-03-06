import React, { useEffect, useState } from "react";
import { PaginatedResponse, Project, SearchRequest } from "../../model/ProjectData";
import { Notification } from "../../components/common/Notification";
import { ApiResponse } from "../../consts/ApiResponse";
import apiService from "../../services/ApiService";
import { pagnitionAntd } from "../../consts/Pagination";
import { Button, DatePicker, Form, Input, message, Modal, Select, Spin, Table } from "antd";
import { exportToExcel } from "../../consts/ExcelDowload";
import ProjectCard from "../../components/Admin/ProjectCard";
import { UserIcon } from "../../components/Icon/MuiIIcon";
import { Article, EditOutlined, SearchOutlined } from "@mui/icons-material";
import { PlusOutlined, StopFilled } from "../../components/Icon/AntdIcon";
import { User } from "../../model/UserData";
import moment from 'moment-timezone';
import { Department } from "../../model/DepartmentData";

export default function ProjectManagement() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pagnitionAntd.pageSize);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<Project["project_members"]>([]);
  const [
    departments, setDepartments] = useState<Department[]>([]);
  const [form] = Form.useForm();

  const convertToUTC7 = (utcDate: string) => {
    return moment.utc(utcDate).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
  };

  const fetchProjects = async (page: number, size: number, keyword: string) => {
    setLoading(true);
    try {
      const searchParams: SearchRequest = {
        searchCondition: {
          keyword,
          project_start_date: '',
          project_end_date: '',
          is_delete: false,
          user_id: '',
        },
        pageInfo: {
          pageNum: page,
          pageSize: size
        },
      };

      const response = await apiService.post<PaginatedResponse>('projects/search', searchParams);
      if (response) {
        setProjects(response.data.pageData);
        setTotalItems(response.data.pageInfo.totalItems);
      }

    } catch (error) {
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const searchParams = {
        searchCondition: {
          keyword: "",
          is_deleted: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
      };

      const response = await apiService.post<{ data: { pageData: User[] } }>("/users/search", searchParams);
      if (response?.data) {
        setUsers(response.data.pageData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      message.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMembers = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await apiService.get<{ data: Project }>(`/projects/${projectId}`);

      if (response && response.data) {
        setProjectMembers(response.data.project_members);
        setIsMembersModalOpen(true);
      }
    } catch (error) {
      message.error(error as string);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (isAddModalOpen) {
      fetchUsers();
      fetchDepartments();
    }
  }, [isAddModalOpen]);


  useEffect(() => {
    fetchProjects(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  const handleDeleteProject = async (id: string) => {
    try {
      await apiService.delete(`/projects/${id}`);
      message.success("Project deleted successfully!");
      fetchProjects(currentPage, pageSize, searchTerm);
    } catch (error) {
      message.error("Failed to delete project.");
      console.error(error);
    }
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const handleUpdateProject = async () => {
    try {
      const values = await form.validateFields();

      const projectData = {
        ...values,
        project_start_date: values.project_start_date ? values.project_start_date.utc().format() : null,
        project_end_date: values.project_end_date ? values.project_end_date.utc().format() : null,
        project_members: values.project_members.map((userId: string) => ({
          user_id: userId,
          project_role: values.project_role,
        })),
      };
      console.log(projectData);
      const response = await apiService.put(`/projects/${editingProject?._id}`, projectData);
      if (response) {
        message.success("Project updated successfully!");
        fetchProjects(currentPage, pageSize, searchTerm);
        setIsEditModalOpen(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      message.error("Error updating project.");
    }
  };

  const showModal = () => setIsAddModalOpen(true);

  const handleAddProject = async () => {
    try {
      const values = await form.validateFields();

      // Map selected users to the required structure
      const projectMembers = values.project_members.map((userId: string) => ({
        user_id: userId, // Ensure this is a valid ObjectId
        project_role: values.project_role, // Assign the selected role to all members
      }));

      const projectData = {
        ...values,
        project_members: projectMembers, // Send as an array of objects
      };

      const response = await apiService.post("/projects", projectData);
      if (response) {
        message.success("Project added successfully!");
        fetchProjects(currentPage, pageSize, searchTerm);
        handleCancel();
      }
    } catch (error) {
      console.error("Failed to add project:", error);
      message.error("Error adding project.");
    }
  };

  const handleEditClick = (project: Project) => {
    form.setFieldsValue({
      ...project,
      project_start_date: project.project_start_date ? moment(project.project_start_date) : null, // Convert to moment object
      project_end_date: project.project_end_date ? moment(project.project_end_date) : null, // Convert to moment object
      project_members: project.project_members.map((member) => ({
        user_id: member.user_id,
        project_role: member.project_role,
      })),
    });
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
      render: (text: string, record: Project) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => fetchProjectMembers(record._id)}
        >
          {text}
        </button>
      ),
    },
    { title: "Project Department", dataIndex: "project_department", key: "project_department", },
    { title: "Project Code", dataIndex: "project_code", key: "project_code", },
    { title: "Project Description", dataIndex: "project_description", key: "project_description" },
    {
      title: "Project Start Date",
      dataIndex: "project_start_date",
      key: "project_start_date",
      render: (text: string) => convertToUTC7(text),
    },
    {
      title: "Project End Date",
      dataIndex: "project_end_date",
      key: "project_end_date",
      render: (text: string) => convertToUTC7(text),
    },
    { title: "Updated By", dataIndex: "updated_by", key: "updated_by", },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => convertToUTC7(text),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) => convertToUTC7(text),
    },
    { title: "Project Comment", dataIndex: "project_comment", key: "project_comment" },
    {
      title: "Project Status",
      key: "project_status",
      render: (_: string, record: Project) => {
        const getStatusClasses = (status: string) => {
          switch (status) {
            case "New":
              return "bg-amber-400 text-white";
            default:
              return "bg-gray-400 text-white";
          }
        };

        return (
          <span className={`p-2 rounded-lg text-sm font-semibold ${getStatusClasses(record.project_status)}`}>
            {record.project_status}
          </span>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: Project) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEditClick(record)}
          >
          </Button>
          <Button
            icon={<StopFilled />}
            type="link"
            danger
            onClick={() => handleDeleteProject(record._id)}
          >
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="overflow-y-scroll">
      <div className="flex justify-end items-center p-5 over ">
        <div className="flex gap-2">
          <Button type="primary" onClick={() => exportToExcel(projects, ['id', 'project name', 'start date', 'enddate', 'budget'], 'project')}>Export project list</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FCFCFC] p-5">
        {/* Users */}
        <ProjectCard
          icon={<UserIcon />}
          title="Total Users"
          growth={25}
        />
        {/* Claims */}
        <ProjectCard
          icon={<Article />}
          title="New Users"
          growth={42}
        />
        {/* Funds */}
        <ProjectCard
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
              Add Project
            </Button>
          </div>


        </div>

        <Modal
          title="Add New Project"
          open={isAddModalOpen}
          onCancel={handleCancel}
          onOk={handleAddProject}
          okText="Add Project"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Project Name"
              name="project_name"
              rules={[{ required: true, message: "Please enter the project name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Project Code"
              name="project_code"
              rules={[{ required: true, message: "Please enter the project code" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Project Department" name="project_department">
              <Select placeholder="Select a department" loading={loading}>
                {departments.map((dept) => (
                  <Select.Option key={dept.department_name} value={dept.department_name}>
                    {dept.department_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Project Description"
              name="project_description"
              rules={[{ required: true, message: "Write the project description" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Project Start Date"
              name="project_start_date"
              rules={[{ required: true, message: "Please select the project start date" }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Project End Date"
              name="project_end_date"
              rules={[
                { required: true, message: "Please select the project end date" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('project_start_date') <= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('End date must be later than start date'));
                  },
                }),
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item label="Project Members" name="project_members">
              <Select mode="multiple" placeholder="Select project members">
                {users.map((user) => (
                  <Select.Option key={user._id} value={user._id}>
                    {user.user_name} ({user.email})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Project Role" name="project_role">
              <Select placeholder="Select a role">
                <Select.Option value="Project Manager">Project Manager</Select.Option>
                <Select.Option value="Developer">Developer</Select.Option>
                <Select.Option value="Designer">Designer</Select.Option>
                <Select.Option value="Tester">Tester</Select.Option>
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
              dataSource={projects}
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

            <Modal
              title="Project Members"
              open={isMembersModalOpen}
              onCancel={() => setIsMembersModalOpen(false)}
              footer={null}
            >
              {projectMembers.length > 0 ? (
                <ul>
                  {projectMembers.map((member) => (
                    <li key={member.user_id} className="p-2 border-b">
                      <span className="font-bold">{member.user_name || "Unknown User"}</span> - {member.project_role}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members found for this project.</p>
              )}
            </Modal>
          </div>
        )}

        <Modal
          title="Edit Project"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onOk={handleUpdateProject}
          okText="Save"
          cancelText="Cancel"
          width={800}
        >
          <Form form={form} layout="vertical" initialValues={editingProject || {}}>
            <Form.Item
              label="Project Name"
              name="project_name"
              rules={[{ required: true, message: "Please enter the project name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Project Code"
              name="project_code"
              rules={[{ required: true, message: "Please enter the project code" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Project Department" name="project_department">
              <Select placeholder="Select a department" loading={loading}>
                {departments.map((dept) => (
                  <Select.Option key={dept.department_name} value={dept.department_name}>
                    {dept.department_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Project Description"
              name="project_description"
              rules={[{ required: true, message: "Write the project description" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Project Start Date"
              name="project_start_date"
              rules={[{ required: true, message: "Please select the project start date" }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Project End Date"
              name="project_end_date"
              rules={[
                { required: true, message: "Please select the project end date" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('project_start_date') <= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('End date must be later than start date'));
                  },
                }),
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.List name="project_members">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'user_id']}
                        rules={[{ required: true, message: 'Please select a user' }]}
                        style={{ flex: 1, marginRight: 8 }}
                      >
                        <Select placeholder="Select a user">
                          {users.map((user) => (
                            <Select.Option key={user._id} value={user._id}>
                              {user.user_name} ({user.email})
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'project_role']}
                        rules={[{ required: true, message: 'Please select a role' }]}
                        style={{ flex: 1 }}
                      >
                        <Select placeholder="Select a role">
                          <Select.Option value="Project Manager">Project Manager</Select.Option>
                          <Select.Option value="Developer">Developer</Select.Option>
                          <Select.Option value="Designer">Designer</Select.Option>
                          <Select.Option value="Tester">Tester</Select.Option>
                        </Select>
                      </Form.Item>

                      <Button
                        type="link"
                        danger
                        onClick={() => remove(name)}
                        style={{ marginLeft: 8 }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                  >
                    Add Member
                  </Button>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </div>
    </div>
  )
};
