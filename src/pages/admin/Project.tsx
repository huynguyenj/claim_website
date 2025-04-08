import {
  AccountTree,
  Article,
  CheckCircleOutline,
  DehazeOutlined,
  EditCalendar,
  EditOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  SearchOutlined,
  SettingsEthernet,
  Today,
  Visibility,
} from "@mui/icons-material";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  TablePaginationConfig,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/Admin/ProjectCard";
import { Notification } from "../../components/common/Notification";
import { PlusOutlined, StopFilled } from "../../components/Icon/AntdIcon";
import { UserIcon, WorkIcon } from "../../components/Icon/MuiIIcon";
import { ApiResponse } from "../../consts/ApiResponse";
import { exportToExcel } from "../../consts/ExcelDownload";
import { pagnitionAntd } from "../../consts/Pagination";
import useProjectData from "../../hooks/admin/useProjectData";
import { Department } from "../../model/DepartmentData";
import {
  PaginatedResponse,
  Project,
  ProjectMember,
  ProjectRole,
  SearchRequest,
} from "../../model/ProjectData";
import { User } from "../../model/UserData";
import apiService from "../../services/ApiService";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ProjectManagement() {
  const [showProjectCards, setShowProjectCards] = useState(true);

  const [globalLoading, setGlobalLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const { totalProjects, totalProjectsThisMonth } = useProjectData();
  const [selectedProjectDetails, setSelectedProjectDetails] =
    useState<Project | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userCurrentPage, setUserCurrentPage] = useState<number>(1);
  const [userPageSize] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userSearchTerm, setUserSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectSearchTerm, setSelectSearchTerm] = useState<string>("");
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pagnitionAntd.pageSize);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] =
    useState<boolean>(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<
    Project["project_members"]
  >([]);
  const [addProjectForm] = Form.useForm();
  const [editProjectForm] = Form.useForm();

  const handleFormErrors = (error: unknown) => {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: Array<{ message: string; field: string }>;
    }>;

    if (
      axiosError.response?.status === 400 &&
      axiosError.response.data?.errors
    ) {
      const fieldErrors = axiosError.response.data.errors.map((err) => ({
        name: err.field,
        errors: [err.message],
      }));

      addProjectForm.setFields(fieldErrors);
      editProjectForm.setFields(fieldErrors);
    }
  };

  const handleViewDescription = (project: Project) => {
    setSelectedProjectDetails(project);
  };

  const handleCloseDescriptionModal = () => {
    setSelectedProjectDetails(null);
  };

  const fetchProjects = async (page: number, size: number, keyword: string) => {
    setGlobalLoading(true);
    try {
      const searchParams: SearchRequest = {
        searchCondition: {
          keyword,
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
          user_id: "",
        },
        pageInfo: {
          pageNum: page,
          pageSize: size,
        },
      };

      const response = await apiService.post<PaginatedResponse>(
        "projects/search",
        searchParams
      );
      if (response) {
        setProjects(response.data.pageData);
        setTotalItems(response.data.pageInfo.totalItems);
      }
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchUsers = async (
    page: number,
    size: number,
    keyword: string = ""
  ) => {
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

      const response = await apiService.post<{
        data: { pageData: User[]; pageInfo: { totalItems: number } };
      }>("/users/search", searchParams);

      if (response?.data?.pageData && response?.data?.pageInfo) {
        setUsers(response.data.pageData);
        setTotalUsers(response.data.pageInfo.totalItems);
      } else {
        throw new Error(
          "Invalid response format: Missing pageData or pageInfo"
        );
      }
    } catch (error) {
      message.error("Failed to fetch users");
      console.error(error);
    } finally {
    }
  };

  const fetchProjectMembers = async (projectId: string) => {
    setGlobalLoading(true);
    try {
      const response = await apiService.get<{ data: Project }>(
        `/projects/${projectId}`
      );

      if (response && response.data) {
        setProjectMembers(response.data.project_members);
        setIsMembersModalOpen(true);
      } else {
        Notification("error", "Employee not found");
      }
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await apiService.get<ApiResponse<Department[]>>(
        "/departments/get-all"
      );

      setDepartments(response.data);
    } catch (error) {
      Notification("error", error as string);
    } finally {
    }
  };

  const fetchProjectRoles = async () => {
    try {
      const response = await apiService.get<{ data: ProjectRole[] }>(
        "/projects/roles"
      );
      setProjectRoles(response.data);
      console.log(response.data);
    } catch (error) {
      Notification("error", error as string);
    } finally {
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (globalLoading) {
      timer = setTimeout(() => setShowLoader(true), 100);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [globalLoading]);

  useEffect(() => {
    if (isEditProjectModalOpen) {
      const fetchData = async () => {
        await fetchDepartments();
        await fetchProjectRoles();

        if (editingProject) {
          const members = editingProject.project_members;
          const usersFromMembers = members.map(
            (m) =>
              ({
                _id: m.user_id,
                user_name: m.user_name,
              } as User)
          );

          setUsers((prev) => {
            const existingIds = new Set(prev.map((u) => u._id));
            const newUsers = usersFromMembers.filter(
              (u) => !existingIds.has(u._id)
            );
            return [...prev, ...newUsers];
          });
        }
      };
      fetchData();
    }
  }, [isEditProjectModalOpen, editingProject]);

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
    editProjectForm.resetFields();
  };

  const handleUpdateProject = async () => {
    try {
      setGlobalLoading(true);
      const values = await editProjectForm.validateFields();

      if (!editingProject) return;

      const simplifiedMembers: ProjectMember[] = values.project_members.map(
        (member: any) => ({
          user_id: member.user_id,
          user_name: member.user_name,
          project_role: member.project_role,
        })
      );

      const updatedProject = {
        ...values,
        project_start_date: values.project_start_date
          ? values.project_start_date.toISOString()
          : null,
        project_end_date: values.project_end_date
          ? values.project_end_date.toISOString()
          : null,
        project_members: simplifiedMembers,
      };

      await apiService.put(`/projects/${editingProject._id}`, updatedProject);

      message.success("Project updated successfully!");

      setIsEditProjectModalOpen(false);
      fetchProjects(currentPage, pageSize, searchTerm);
    } catch (error) {
      handleFormErrors(error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await apiService.delete(`/projects/${id}`);
      message.success("Project deleted successfully!");
      fetchProjects(currentPage, pageSize, searchTerm);
    } catch (error) {
      handleFormErrors(error);
    }
  };

  const showModal = () => setIsAddProjectModalOpen(true);

  const handleAddProject = async () => {
    try {
      setGlobalLoading(true);
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
      handleFormErrors(error);
    } finally {
      setGlobalLoading(false);
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
      ),
      dataIndex: "project_department",
      key: "project_department",
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <SettingsEthernet />
          Project Code
        </div>
      ),
      dataIndex: "project_code",
      key: "project_code",
    },
    // {
    //   title: (
    //     <div className="flex items-center gap-2">
    //       <Description />
    //       Description
    //     </div>
    //   ),
    //   dataIndex: "project_description",
    //   key: "project_description",
    //   render: (text: string) => (
    //     <div className="flex items-center gap-2">
    //       <Button
    //         type="link"
    //         icon={<Visibility />}
    //         onClick={() => handleViewDescription(text)}
    //       >
    //         View
    //       </Button>
    //     </div>
    //   ),
    // },
    {
      title: (
        <div className="flex items-center gap-2">
          <EditCalendar />
          Start Date
        </div>
      ),
      dataIndex: "project_start_date",
      key: "project_start_date",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
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
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
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
          <span
            className={`p-2 rounded-lg text-sm font-semibold ${getStatusClasses(
              record.project_status
            )}`}
          >
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
                project_start_date: record.project_start_date
                  ? dayjs(record.project_start_date)
                  : null,
                project_end_date: record.project_end_date
                  ? dayjs(record.project_end_date)
                  : null,
              });

              setEditingProject(record);
              setIsEditProjectModalOpen(true);
            }}
          ></Button>

          <Button
            icon={<Visibility />}
            type="link"
            onClick={() => handleViewDescription(record)}
          />

          <Button
            icon={<StopFilled />}
            type="link"
            danger
            onClick={() => {
              Modal.confirm({
                title: "Delete Project",
                content: "Are you sure you want to delete this project?",
                onOk: () => handleDeleteProject(record._id),
                okText: "Delete",
                cancelText: "Cancel",
              });
            }}
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-y-scroll">
      <div className="relative min-h-screen">
        {showLoader && (
          <div
            className={`
                fixed inset-0 
                bg-black/30 backdrop-blur-sm
                flex flex-col items-center justify-center 
                z-[9999]
                transition-all duration-300
                ${showLoader ? "opacity-100" : "opacity-0"}
              `}
          >
            {/* Bouncing Dots Animation */}
            <div className="flex space-x-2 mb-4">
              {["L", "O", "A", "D", "I", "N", "G"].map((char, i) => (
                <div
                  key={i}
                  className="text-white text-2xl font-bold"
                  style={{
                    animation: `bounce 1s infinite ${i * 0.1}s`,
                  }}
                >
                  {char}
                </div>
              ))}
              <div className="flex space-x-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 bg-white rounded-full"
                    style={{
                      animation: `pulse 1.5s infinite ${dot * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Antd Spin with custom styling */}
            <Spin
              size="large"
              className="!text-white"
              indicator={
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-4 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-1 border-4 border-t-transparent border-r-transparent border-b-white border-l-white rounded-full animate-spin-reverse"></div>
                </div>
              }
            />
          </div>
        )}
        <div className="flex justify-end items-center p-5 over ">
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() =>
                exportToExcel(
                  projects,
                  ["id", "project name", "start date", "enddate", "budget"],
                  "project"
                )
              }
            >
              Export project list
            </Button>
          </div>
        </div>

        <div className="bg-[#FCFCFC] p-5">
          <div
            className="flex items-center cursor-pointer mb-2"
            onClick={() => setShowProjectCards(!showProjectCards)}
          >
            <h2 className="text-lg font-bold mr-2">User Statistics</h2>
            {showProjectCards ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </div>

          {showProjectCards && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
              <ProjectCard
                icon={<UserIcon />}
                title="Total Projects"
                data={totalProjects}
              />
              <ProjectCard
                icon={<Article />}
                title="New Projects This Month"
                data={totalProjectsThisMonth}
              />
            </div>
          )}
        </div>

        <div className="p-6 m-5 rounded-2xl border-black border-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
          <div className="mb-4 flex items-center">
            <Input
              placeholder="Search by project name"
              prefix={
                <SearchOutlined
                  onClick={handleSearchSubmit}
                  style={{ cursor: "pointer" }}
                />
              }
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
            title="Project Details"
            open={!!selectedProjectDetails}
            onCancel={handleCloseDescriptionModal}
            styles={{
              body: {
                maxHeight: "60vh",
                overflowY: "auto",
                padding: "16px",
              },
              content: {
                maxHeight: "80vh",
              },
            }}
            footer={null}
          >
            {selectedProjectDetails && (
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <strong>Description:</strong>
                  <p className="p-2 mt-4 max-h-60 overflow-auto border-1 rounded-tl-lg rounded-bl-lg border-black">
                    {selectedProjectDetails.project_description}
                  </p>
                </div>

                {/* Created At */}
                <div>
                  <strong>Created At:</strong>
                  <p>
                    {dayjs(selectedProjectDetails.created_at).format(
                      "YYYY-MM-DD"
                    )}
                  </p>
                </div>

                {/* Updated At */}
                <div>
                  <strong>Updated At:</strong>
                  <p>
                    {dayjs(selectedProjectDetails.updated_at).format(
                      "YYYY-MM-DD"
                    )}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <strong>Comment:</strong>
                  <p>{selectedProjectDetails.project_comment}</p>
                </div>
              </div>
            )}
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
                        rules={[
                          {
                            required: true,
                            message: "Please enter the project name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project Code"
                        name="project_code"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the project code",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project Department"
                        name="project_department"
                        rules={[
                          {
                            required: true,
                            message: "Please select a department",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select department"
                          loading={loading}
                        >
                          {departments.map((dept) => (
                            <Select.Option
                              key={dept.department_code}
                              value={dept.department_code}
                            >
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
                        rules={[
                          {
                            required: true,
                            message: "Write the project description",
                          },
                        ]}
                      >
                        <Input.TextArea rows={3} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project Start Date"
                        name="project_start_date"
                        rules={[
                          {
                            required: true,
                            message: "Please select start date",
                          },
                        ]}
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          style={{ width: "100%" }}
                          value={
                            addProjectForm.getFieldValue("project_start_date")
                              ? dayjs(
                                  addProjectForm.getFieldValue(
                                    "project_start_date"
                                  )
                                )
                              : null
                          }
                          onChange={(date) =>
                            addProjectForm.setFieldsValue({
                              project_start_date: date,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project End Date"
                        name="project_end_date"
                        rules={[
                          { required: true, message: "Please select end date" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const startDate =
                                getFieldValue("project_start_date");
                              if (
                                value &&
                                startDate &&
                                value.isBefore(startDate)
                              ) {
                                return Promise.reject(
                                  "End date must be greater than start date"
                                );
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          style={{ width: "100%" }}
                          value={
                            addProjectForm.getFieldValue("project_end_date")
                              ? dayjs(
                                  addProjectForm.getFieldValue(
                                    "project_end_date"
                                  )
                                )
                              : null
                          }
                          onChange={(date) =>
                            addProjectForm.setFieldsValue({
                              project_end_date: date,
                            })
                          }
                        />
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
                          <div className="sticky top-0 bg-white z-10 pb-4">
                            <Button
                              type="dashed"
                              onClick={() => add({}, 0)}
                              block
                              icon={<PlusOutlined />}
                              className="mb-4"
                            >
                              Add Member
                            </Button>
                          </div>
                          {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className="flex gap-2 mb-4">
                              <Form.Item
                                {...restField}
                                name={[name, "user_id"]}
                                rules={[
                                  { required: true, message: "Select member" },
                                ]}
                                className="flex-1"
                              >
                                <Select
                                  className="truncate max-w-[150px]"
                                  placeholder="Select a member"
                                  showSearch
                                  onSearch={(value) => {
                                    setUserSearchTerm(value);
                                    fetchUsers(1, userPageSize, value);
                                  }}
                                  filterOption={false}
                                >
                                  {users.map((user) => (
                                    <Select.Option
                                      key={user._id}
                                      value={user._id}
                                    >
                                      {user.user_name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, "project_role"]}
                                rules={[
                                  { required: true, message: "Select role" },
                                ]}
                                className="flex-1"
                              >
                                <Select placeholder="Select a role">
                                  {projectRoles.map((role) => (
                                    <Select.Option
                                      key={role.name}
                                      value={role.name}
                                    >
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
                        </>
                      )}
                    </Form.List>
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal>

          {/* {loading ? (
            <div className="text-center py-12">
              <Spin size="large" />
            </div>
          ) : ( */}
          <div className="overflow-x-auto">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4"
              style={{
                maxHeight: "calc(100vh - 550px)",
                overflowY: "auto",
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE 10+ */,
              }}
            >
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
                scroll={{ x: true, y: "calc(100vh - 400px)" }}
                sticky
              />
            </div>
          </div>
          {/* )} */}

          <Modal
            title="Project Members"
            open={isMembersModalOpen}
            onCancel={() => setIsMembersModalOpen(false)}
            styles={{
              body: {
                maxHeight: "60vh",
                overflowY: "auto",
                padding: "16px",
              },
              content: {
                maxHeight: "80vh",
              },
            }}
            footer={null}
          >
            {projectMembers.length > 0 ? (
              <ul>
                {projectMembers.map((member) => (
                  <li key={member.user_id} className="p-2 border-b">
                    <span className="font-bold">
                      {member.user_name || "Unknown User"}
                    </span>{" "}
                    - {member.project_role}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members found for this project.</p>
            )}
          </Modal>
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
                        rules={[
                          {
                            required: true,
                            message: "Please enter the project name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project Code"
                        name="project_code"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the project code",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project Department"
                        name="project_department"
                        rules={[
                          {
                            required: true,
                            message: "Please select a department",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select department"
                          loading={loading}
                        >
                          {departments.map((dept) => (
                            <Select.Option
                              key={dept.department_code}
                              value={dept.department_code}
                            >
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
                        rules={[
                          {
                            required: true,
                            message: "Write the project description",
                          },
                        ]}
                      >
                        <Input.TextArea rows={3} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project Start Date"
                        name="project_start_date"
                        rules={[
                          {
                            required: true,
                            message: "Please select start date",
                          },
                        ]}
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          style={{ width: "100%" }}
                          value={
                            editProjectForm.getFieldValue("project_start_date")
                              ? dayjs(
                                  editProjectForm.getFieldValue(
                                    "project_start_date"
                                  )
                                )
                              : null
                          }
                          onChange={(date) =>
                            editProjectForm.setFieldsValue({
                              project_start_date: date,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Project End Date"
                        name="project_end_date"
                        rules={[
                          { required: true, message: "Please select end date" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const startDate =
                                getFieldValue("project_start_date");
                              if (
                                value &&
                                startDate &&
                                value.isBefore(startDate)
                              ) {
                                return Promise.reject(
                                  "End date must be greater than start date"
                                );
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          style={{ width: "100%" }}
                          value={
                            editProjectForm.getFieldValue("project_end_date")
                              ? dayjs(
                                  editProjectForm.getFieldValue(
                                    "project_end_date"
                                  )
                                )
                              : null
                          }
                          onChange={(date) =>
                            editProjectForm.setFieldsValue({
                              project_end_date: date,
                            })
                          }
                        />
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
                          <div className="sticky top-0 bg-white z-10 pb-4">
                            <Input
                              placeholder="Search existing members..."
                              value={userSearchTerm}
                              onChange={(e) =>
                                setUserSearchTerm(e.target.value)
                              }
                              allowClear
                              className="mb-4"
                            />

                            <Button
                              type="dashed"
                              onClick={() => add({}, 0)}
                              block
                              icon={<PlusOutlined />}
                              className="mb-4"
                            >
                              Add Member
                            </Button>
                          </div>

                          {fields.map(({ key, name, ...restField }) => {
                            const member = editProjectForm.getFieldValue([
                              "project_members",
                              name,
                            ]);
                            const userName = member?.user_name || "";
                            const role = member?.project_role || "";

                            const searchLower = userSearchTerm.toLowerCase();
                            const isVisible =
                              !userSearchTerm ||
                              userName.toLowerCase().includes(searchLower) ||
                              role.toLowerCase().includes(searchLower);

                            return (
                              <div
                                key={key}
                                className="flex gap-2 mb-4"
                                style={{ display: isVisible ? "flex" : "none" }}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, "user_id"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Select member",
                                    },
                                  ]}
                                  className="flex-1"
                                >
                                  <Select
                                    className="truncate max-w-[150px]"
                                    placeholder="Select a member"
                                    showSearch
                                    onSearch={(value) => {
                                      setSelectSearchTerm(value);
                                      fetchUsers(1, userPageSize, value);
                                    }}
                                    onPopupScroll={(e) => {
                                      const { target } = e;
                                      if (
                                        (target as HTMLElement).scrollTop +
                                          (target as HTMLElement)
                                            .clientHeight ===
                                        (target as HTMLElement).scrollHeight
                                      ) {
                                        if (users.length < totalUsers) {
                                          fetchUsers(
                                            userCurrentPage + 1,
                                            userPageSize,
                                            userSearchTerm
                                          );
                                          setUserCurrentPage(
                                            userCurrentPage + 1
                                          );
                                        }
                                      }
                                    }}
                                    onFocus={() =>
                                      fetchUsers(
                                        1,
                                        userPageSize,
                                        selectSearchTerm
                                      )
                                    }
                                    filterOption={false}
                                    notFoundContent={
                                      loading ? <Spin size="small" /> : null
                                    }
                                  >
                                    {users.map((user) => (
                                      <Select.Option
                                        key={user._id}
                                        value={user._id}
                                      >
                                        {user.user_name}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  {...restField}
                                  name={[name, "project_role"]}
                                  rules={[
                                    { required: true, message: "Select role" },
                                  ]}
                                  className="flex-1"
                                >
                                  <Select
                                    className="truncate max-w-[150px]"
                                    placeholder="Select a role"
                                  >
                                    {projectRoles.map((role) => (
                                      <Select.Option
                                        key={role.name}
                                        value={role.name}
                                      >
                                        {role.name}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>

                                <Button
                                  type="link"
                                  danger
                                  onClick={() => {
                                    Modal.confirm({
                                      title: "Remove Member",
                                      content:
                                        "Are you sure you want to remove this member?",
                                      okText: "Yes",
                                      cancelText: "No",
                                      onOk: () => remove(name),
                                    });
                                  }}
                                  icon={<StopFilled />}
                                  className="mt-1"
                                />
                              </div>
                            );
                          })}
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
    </div>
  );
}
