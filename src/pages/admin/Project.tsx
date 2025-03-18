import { AccountTree, Article, CheckCircleOutline, Comment, DehazeOutlined, Description, EditCalendar, EditOutlined, History, SearchOutlined, SettingsEthernet, Today, Update, Visibility } from "@mui/icons-material";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Spin, Table, TablePaginationConfig } from "antd";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/Admin/ProjectCard";
import { Notification } from "../../components/common/Notification";
import { PlusOutlined, StopFilled } from "../../components/Icon/AntdIcon";
import { UserIcon, WorkIcon } from "../../components/Icon/MuiIIcon";
import { ApiResponse, getApiErrorMessage } from "../../consts/ApiResponse";
import { exportToExcel } from "../../consts/ExcelDownload";
import { pagnitionAntd } from "../../consts/Pagination";
import useProjectData from "../../hooks/admin/useProjectData";
import { Department } from "../../model/DepartmentData";
import { PaginatedResponse, Project, ProjectMember, ProjectRole, SearchRequest } from "../../model/ProjectData";
import { User } from "../../model/UserData";
import apiService from "../../services/ApiService";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ProjectManagement() {

  const { totalProjects, totalProjectsThisMonth, projectLoading } = useProjectData();

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userCurrentPage, setUserCurrentPage] = useState<number>(1);
  const [userPageSize, setUserPageSize] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userSearchTerm, setUserSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pagnitionAntd.pageSize);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState<boolean>(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<Project["project_members"]>([]);
  const [addProjectForm] = Form.useForm();
  const [editProjectForm] = Form.useForm();

  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

  const handleViewDescription = (description: string) => {
    setSelectedDescription(description);
  };

  const handleCloseDescriptionModal = () => {
    setSelectedDescription(null);
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

  const fetchUsers = async (page: number, size: number, keyword: string = "") => {
    setLoading(true);
    try {
      const searchParams = {
        searchCondition: {
          keyword,
          is_deleted: false,
        },
        pageInfo: {
          pageNum: page,
          pageSize: size,
        },
      };

      const response = await apiService.post<{ data: { pageData: User[]; pageInfo: { totalItems: number } } }>("/users/search", searchParams);

      if (response?.data?.pageData && response?.data?.pageInfo) {
        setUsers(response.data.pageData);
        setTotalUsers(response.data.pageInfo.totalItems);
      } else {
        throw new Error("Invalid response format: Missing pageData or pageInfo");
      }
    } catch (error) {
      message.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMembers = async (projectId: string) => {
    setLoading(true);
    try {
      const response = await apiService.get<{ data: Project }>(`/projects/${projectId}`);

      if (response && response.data) {
        setProjectMembers(response.data.project_members);
        setIsMembersModalOpen(true);
      } else {
        Notification("error", "Employee not found");
      }
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchProjectRoles = async () => {
    try {
      const response = await apiService.get<{ data: ProjectRole[] }>('/projects/roles');
      setProjectRoles(response.data);
      console.log(response.data);
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditProjectModalOpen) {
      const fetchData = async () => {
        await fetchDepartments();
        await fetchProjectRoles();
      };
      fetchData();
    }
  }, [isEditProjectModalOpen]);

  useEffect(() => {
    if (isAddProjectModalOpen) {
      const fetchData = async () => {
        await fetchDepartments();
        await fetchProjectRoles();
      };
      fetchData();
    }
  }, [isAddProjectModalOpen]);

  useEffect(() => {
    fetchProjects(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize]);

  const handleTableChange = (pagination: TablePaginationConfig): void => {
    setCurrentPage(pagination.current || currentPage);
    setPageSize(pagination.pageSize || pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    if (keyword === "") {
      setCurrentPage(1);
      fetchProjects(1, pageSize, "");
    }
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchProjects(1, pageSize, searchTerm);
  };

  const handleAddProjectCancel = () => {
    setIsAddProjectModalOpen(false);
    setDepartments([]);
    addProjectForm.resetFields();
  };

  const handleUpdateProjectCancel = () => {
    setIsEditProjectModalOpen(false);
    setDepartments([]);
    addProjectForm.resetFields();
  };

  const handleUpdateProject = async () => {
    try {
      setLoading(true);
      const values = await editProjectForm.validateFields();
      console.log(editProjectForm.getFieldsValue())
      const simplifiedMembers: ProjectMember[] = values.project_members.map((member: any) => ({
        user_id: member.user_id,
        user_name: member.user_name,
        project_role: member.project_role,

      }));

      const updatedProject = {
        ...values,
        project_start_date: values.project_start_date ? values.project_start_date.toISOString() : null,
        project_end_date: values.project_end_date ? values.project_end_date.toISOString() : null,
        project_members: simplifiedMembers,
      };

      console.log("Updated Project Payload:", updatedProject);
      console.log("Updated Project:", values);

      const response = await apiService.put(`/projects/${editingProject?._id}`, updatedProject);
      message.success("Project updated successfully!");
      setIsEditProjectModalOpen(false);
    } catch (error: any) {
      const errorMessage = getApiErrorMessage(error);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await apiService.delete(`/projects/${id}`);
      message.success("Project deleted successfully!");
      fetchProjects(currentPage, pageSize, searchTerm);
    } catch (error) {
      Notification("error", "Failed to delete projects.");
    }
  };

  const showModal = () => setIsAddProjectModalOpen(true);

  const handleAddProject = async () => {
    try {
      setLoading(true);
      const values = await addProjectForm.validateFields();

      const projectMembers = values.project_members.map((member: any) => ({
        user_id: member.user_id,
        project_role: member.project_role,
      }));

      const projectData = {
        ...values,
        project_members: projectMembers,
      };

      const response = await apiService.post("/projects", projectData);

      if (response) {
        message.success("Project added successfully!");
        fetchProjects(currentPage, pageSize, searchTerm);
        handleAddProjectCancel();
      }
    } catch (error: any) {
      const errorMessage = getApiErrorMessage(error);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
          <WorkIcon />
          Name
        </div>
      ),
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
    {
      title: (
        <div className="flex items-center gap-2">
          <AccountTree />
          Department
        </div>
      ), dataIndex: "project_department", key: "project_department",
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <SettingsEthernet />
          Project Code
        </div>
      ), dataIndex: "project_code", key: "project_code",
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <Description />
          Description
        </div>
      ),
      dataIndex: "project_description",
      key: "project_description",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            icon={<Visibility />}
            onClick={() => handleViewDescription(text)}
          >
            View
          </Button>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <EditCalendar />
          Start Date
        </div>
      ),
      dataIndex: "project_start_date",
      key: "project_start_date",
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <Today />
          End Date
        </div>
      ),
      dataIndex: "project_end_date",
      key: "project_end_date",
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <History />
          Created At
        </div>
      ),
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <Update />
          Updated At
        </div>
      ),
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <Comment />
          Comment
        </div>
      ), dataIndex: "project_comment", key: "project_comment"
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <CheckCircleOutline />
          Status
        </div>
      ),
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
      title: (
        <div className="flex items-center gap-2">
          <DehazeOutlined />
          Action
        </div>
      ),
      key: "actions",
      render: (_: string, record: Project) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {

              editProjectForm.setFieldsValue({
                ...record,
                project_start_date: record.project_start_date ? dayjs(record.project_start_date) : null,
                project_end_date: record.project_end_date ? dayjs(record.project_end_date) : null,
              });

              setEditingProject(record);
              setIsEditProjectModalOpen(true);
            }}
          ></Button>

          <Button
            icon={<StopFilled />}
            type="link"
            danger
            onClick={() => {
              Modal.confirm({
                title: "Delete Project",
                content: "Are you sure you want to delete this project?",
                onOk: () => handleDeleteProject(record._id),
                okText: 'Delete',
                cancelText: 'Cancel',
              });
            }}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 bg-[#FCFCFC] p-5">
        <ProjectCard
          icon={<UserIcon />}
          title="Total Projects"
          data={totalProjects}
          growth={25}
          loading={projectLoading}
        />
        <ProjectCard
          icon={<Article />}
          title="New Projects This Month"
          data={totalProjectsThisMonth}
          growth={42}
          loading={projectLoading}
        />
      </div>

      <div className="p-6 m-5 rounded-2xl border-black border-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 flex items-center">
          <Input
            placeholder="Search by project name"
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
              Add Project
            </Button>
          </div>


        </div>

        <Modal
          title="Project Description"
          open={!!selectedDescription}
          onCancel={handleCloseDescriptionModal}
          footer={null}
        >
          <p>{selectedDescription}</p>
        </Modal>

        <Modal
          title="Add New Project"
          open={isAddProjectModalOpen}
          onCancel={handleAddProjectCancel}
          onOk={handleAddProject}
          okText="Add Project"
          cancelText="Cancel"
          width={1200}
        >
          <Form form={addProjectForm} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={16}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Project Name"
                      name="project_name"
                      rules={[{ required: true, message: "Please enter the project name" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project Code"
                      name="project_code"
                      rules={[{ required: true, message: "Please enter the project code" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project Department"
                      name="project_department"
                      rules={[{ required: true, message: 'Please select a department' }]}
                    >
                      <Select placeholder="Select department" loading={loading}>
                        {departments.map((dept) => (
                          <Select.Option key={dept.department_code} value={dept.department_code}>
                            {dept.department_code}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Project Description"
                      name="project_description"
                      rules={[{ required: true, message: "Write the project description" }]}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project Start Date"
                      name="project_start_date"
                      rules={[{ required: true, message: "Please select start date" }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project End Date"
                      name="project_end_date"
                      rules={[{ required: true, message: "Please select end date" }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* Right Column - Members (Scrollable) */}
              <Col xs={24} md={8}>
                <div className="border-l-2 pl-4 h-[500px] overflow-y-auto">
                  <div className="mb-4">Project Members</div>
                  <Form.List name="project_members">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className="flex gap-2 mb-4">
                            <Form.Item
                              {...restField}
                              name={[name, 'user_name']}
                              rules={[{ required: true, message: 'Select member' }]}
                              className="flex-1"
                            >
                              <Select
                                placeholder="Select a member"
                                showSearch
                                onSearch={value => {
                                  setUserSearchTerm(value);
                                  fetchUsers(1, userPageSize, value);
                                }}
                                filterOption={false}
                              >
                                {users.map(user => (
                                  <Select.Option key={user._id} value={user._id}>
                                    {user.user_name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'project_role']}
                              rules={[{ required: true, message: 'Select role' }]}
                              className="flex-1"
                            >
                              <Select placeholder="Select a role">
                                {projectRoles.map(role => (
                                  <Select.Option key={role.name} value={role.name}>
                                    {role.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Button
                              type="link"
                              danger
                              onClick={() => remove(name)}
                              icon={<StopFilled />}
                              className="mt-1"
                            />
                          </div>
                        ))}

                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          className="mb-4"
                        >
                          Add Member
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>
              </Col>
            </Row>
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
                components={components}
              />

            </div>

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
          open={isEditProjectModalOpen}
          onCancel={handleUpdateProjectCancel}
          onOk={handleUpdateProject}
          okText="Save"
          cancelText="Cancel"
          width={1200}
        >
          <Form form={editProjectForm} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={16}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Project Name"
                      name="project_name"
                      rules={[{ required: true, message: "Please enter the project name" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project Code"
                      name="project_code"
                      rules={[{ required: true, message: "Please enter the project code" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project Department"
                      name="project_department"
                      rules={[{ required: true, message: 'Please select a department' }]}
                    >
                      <Select placeholder="Select department" loading={loading}>
                        {departments.map((dept) => (
                          <Select.Option key={dept.department_code} value={dept.department_code}>
                            {dept.department_code}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Project Description"
                      name="project_description"
                      rules={[{ required: true, message: "Write the project description" }]}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project Start Date"
                      name="project_start_date"
                      rules={[{ required: true, message: "Please select start date" }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Project End Date"
                      name="project_end_date"
                      rules={[{ required: true, message: "Please select end date" }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* Right Column - Members (Scrollable) */}
              <Col xs={24} md={8}>
                <div className="border-l-2 pl-4 h-[500px] overflow-y-auto">
                  <div className="mb-4">Project Members</div>
                  <Form.List name="project_members">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className="flex gap-2 mb-4">
                            <Form.Item
                              {...restField}
                              name={[name, 'user_id']}
                              rules={[{ required: true, message: 'Select member' }]}
                              className="flex-1"
                            >
                              <Select
                                placeholder="Select a member"
                                showSearch
                                onSearch={value => {
                                  setUserSearchTerm(value);
                                  fetchUsers(1, userPageSize, value);
                                }}
                                onPopupScroll={(e) => {
                                  const { target } = e;
                                  if ((target as HTMLElement).scrollTop + (target as HTMLElement).clientHeight === (target as HTMLElement).scrollHeight) {
                                    if (users.length < totalUsers) {
                                      fetchUsers(userCurrentPage + 1, userPageSize, userSearchTerm);
                                      setUserCurrentPage(userCurrentPage + 1);
                                    }
                                  }
                                }}
                                filterOption={false}
                                notFoundContent={loading ? <Spin size="small" /> : null}
                              >
                                {users.map(user => (
                                  <Select.Option key={user._id} value={user._id}>
                                    {user.user_name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'project_role']}
                              rules={[{ required: true, message: 'Select role' }]}
                              className="flex-1"
                            >
                              <Select placeholder="Select a role">
                                {projectRoles.map(role => (
                                  <Select.Option key={role.name} value={role.name}>
                                    {role.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Button
                              type="link"
                              danger
                              onClick={() => remove(name)}
                              icon={<StopFilled />}
                              className="mt-1"
                            />
                          </div>
                        ))}

                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          className="mb-4"
                        >
                          Add Member
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  )
};
