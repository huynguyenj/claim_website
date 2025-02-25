import {
  Button,
  Input,
  Spin,
  Table,
  Tag,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Select,
  TableProps,
} from "antd";
import { useState } from "react";
import {
  PlusOutlined,
  SearchOutlined,
  StopFilled,
} from "../../components/Icon/AntdIcon";
import moment from "moment";
import { Article, EditOutlined } from "@mui/icons-material";
import { exportToExcel } from "../../consts/ExcelDowload";
import ProjectCard from "../../components/Admin/ProjectCard";
import { UserIcon } from "../../components/Icon/MuiIIcon";

const { Option } = Select;

interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  blocked: boolean;
}

interface Project {
  id: string;
  projectName: string;
  startDate: string;
  endDate: string;
  budget: number;
  users: User[];
}

const ProjectDashboard = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [loading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(5);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "P001",
      projectName: "Microsoft",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      budget: 100000,
      users: [
        {
          id: "U001",
          name: "Lann",
          role: "Staff",
          department: "IT",
          blocked: false,
        },
        {
          id: "U002",
          name: "Wenduag",
          role: "PM",
          department: "IT",
          blocked: false,
        },
        {
          id: "U003",
          name: "Woljif",
          role: "BA",
          department: "IT",
          blocked: false,
        },
        {
          id: "U004",
          name: "Camellia",
          role: "Finance",
          department: "Financing",
          blocked: false,
        },
        {
          id: "U005",
          name: "Seelah",
          role: "Admin",
          department: "Management",
          blocked: false,
        },
      ],
    },
    {
      id: "P002",
      projectName: "Apple",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      budget: 150000,
      users: [
        {
          id: "U001",
          name: "Lann",
          role: "Staff",
          department: "IT",
          blocked: false,
        },
        {
          id: "U002",
          name: "Wenduag",
          role: "PM",
          department: "IT",
          blocked: false,
        },
        {
          id: "U003",
          name: "Woljif",
          role: "BA",
          department: "IT",
          blocked: false,
        },
        {
          id: "U004",
          name: "Camellia",
          role: "Finance",
          department: "Financing",
          blocked: false,
        },
        {
          id: "U005",
          name: "Seelah",
          role: "Admin",
          department: "Management",
          blocked: false,
        },
      ],
    },
    {
      id: "P003",
      projectName: "Samsung",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      budget: 150000,
      users: [
        {
          id: "U001",
          name: "Lann",
          role: "Staff",
          department: "IT",
          blocked: false,
        },
        {
          id: "U002",
          name: "Wenduag",
          role: "PM",
          department: "IT",
          blocked: false,
        },
        {
          id: "U003",
          name: "Woljif",
          role: "BA",
          department: "IT",
          blocked: false,
        },
        {
          id: "U004",
          name: "Camellia",
          role: "Finance",
          department: "Financing",
          blocked: false,
        },
        {
          id: "U005",
          name: "Seelah",
          role: "Admin",
          department: "Management",
          blocked: false,
        },
      ],
    },
    {
      id: "P004",
      projectName: "Huion",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      budget: 150000,
      users: [
        {
          id: "U001",
          name: "Lann",
          role: "Staff",
          department: "IT",
          blocked: false,
        },
        {
          id: "U002",
          name: "Wenduag",
          role: "PM",
          department: "IT",
          blocked: false,
        },
        {
          id: "U003",
          name: "Woljif",
          role: "BA",
          department: "IT",
          blocked: false,
        },
        {
          id: "U004",
          name: "Camellia",
          role: "Finance",
          department: "Financing",
          blocked: false,
        },
        {
          id: "U005",
          name: "Seelah",
          role: "Admin",
          department: "Management",
          blocked: false,
        },
      ],
    },
    {
      id: "P005",
      projectName: "Walmart",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      budget: 150000,
      users: [
        {
          id: "U001",
          name: "Lann",
          role: "Staff",
          department: "IT",
          blocked: false,
        },
        {
          id: "U002",
          name: "Wenduag",
          role: "PM",
          department: "IT",
          blocked: false,
        },
        {
          id: "U003",
          name: "Woljif",
          role: "BA",
          department: "IT",
          blocked: false,
        },
        {
          id: "U004",
          name: "Camellia",
          role: "Finance",
          department: "Financing",
          blocked: false,
        },
        {
          id: "U005",
          name: "Seelah",
          role: "Admin",
          department: "Management",
          blocked: false,
        },
      ],
    },
    {
      id: "P006",
      projectName: "Starbucks",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      budget: 150000,
      users: [
        {
          id: "U001",
          name: "Lann",
          role: "Staff",
          department: "IT",
          blocked: false,
        },
        {
          id: "U002",
          name: "Wenduag",
          role: "PM",
          department: "IT",
          blocked: false,
        },
        {
          id: "U003",
          name: "Woljif",
          role: "BA",
          department: "IT",
          blocked: false,
        },
        {
          id: "U004",
          name: "Camellia",
          role: "Finance",
          department: "Financing",
          blocked: false,
        },
        {
          id: "U005",
          name: "Seelah",
          role: "Admin",
          department: "Management",
          blocked: false,
        },
      ],
    },
  ]);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState<boolean>(false);
  const [selectedProjectUsers, setSelectedProjectUsers] = useState<User[]>([]);

  const handleShowEmployees = (users: User[]) => {
    setSelectedProjectUsers(users);
    setIsEmployeeModalVisible(true);
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalVisible(false);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  // const showEditModal = (project: Project) => {
  //   setSelectedProject(project);
  //   setIsEditModalVisible(true);
  // };


  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    setUsers([]);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedProject(null);
  };


  const handleAddProject = (values: any) => {
    const newProject: Project = {
      id: `P${projects.length + 1}`.padStart(4, "0"),
      projectName: values.projectName,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
      budget: values.budget,
      users: users,
    };
    setProjects([...projects, newProject]);
    handleAddCancel();
  };

  const addUser = () => {
    setUsers([
      ...users,
      {
        id: `U${users.length + 1}`.padStart(4, "0"),
        name: "",
        role: "",
        department: "",
        blocked: false,
      },
    ]);
  };

  const removeUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };


  const handleUserChange = (
    index: number,
    field: keyof User,
    value: string | boolean
  ) => {
    const newUsers = [...users];
    newUsers[index][field] = value as never;
    setUsers(newUsers);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setPasswordModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (password === "adminpassword") {
      // Replace with actual authentication check
      setProjects(projects.filter((p) => p.id !== selectedProject?.id));
      setPasswordModalVisible(false);
      setPassword("");
    } else {
      alert("Incorrect password!");
    }
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    form.setFieldsValue({
      projectName: project.projectName,
      startDate: moment(project.startDate),
      endDate: moment(project.endDate),
      budget: project.budget,
    });
    setUsers([...project.users]); // Load existing employees
    setIsEditModalVisible(true);
  };



  const handleEditProject = (values: any) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === selectedProject?.id
          ? {
            ...p,
            projectName: values.projectName,
            startDate: values.startDate.format("YYYY-MM-DD"),
            endDate: values.endDate.format("YYYY-MM-DD"),
            budget: values.budget,
            users: users, // Save the edited users
          }
          : p
      )
    );
    setIsEditModalVisible(false);
  };


  const columns: TableProps<Project>["columns"] = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Project Name", dataIndex: "projectName", key: "projectName",
      render: (text, record) => (
        <Button type="link" onClick={() => handleShowEmployees(record.users)}>
          {text}
        </Button>
      ),
    },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Budget ($)",
      dataIndex: "budget",
      key: "budget",
      render: (text: number) => `$${text.toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: Project) => (
        <>
          <div className="items-center flex gap-2">

            {/* Use handleEditClick here */}
            <Button
              onClick={() => handleEditClick(record)} // 👈 Call handleEditClick
              icon={<EditOutlined />}
            >
            </Button>
            <Button
              icon={<StopFilled />}
              danger
              onClick={() => handleDeleteClick(record)}
            />
          </div>
        </>
      ),
    },
  ];



  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>

      <div className="flex justify-end items-center p-5">
        <div className="flex gap-2">
          <Button type="primary" onClick={() => exportToExcel(projects, ['id', 'project name', 'start date', 'enddate', 'budget'], 'project')}>Export project list</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FCFCFC] p-5">
        {/* Users */}
        <ProjectCard
          icon={<UserIcon />}
          title="Users"
          growth={25}
        />
        {/* Claims */}
        <ProjectCard
          icon={<Article />}
          title="Claims"
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

        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search project name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            className="max-w-md shadow-[9px_6px_0px_rgba(0,0,0,1)]"
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add Project
          </Button>
        </div>

        <Modal
          title="Add Project"
          visible={isAddModalVisible}
          onCancel={handleAddCancel}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleAddProject}>
            <Form.Item
              label="Project Name"
              name="projectName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Budget ($)"
              name="budget"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <h3>Users</h3>
            {users.map((user, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  placeholder="Name"
                  value={user.name}
                  onChange={(e) =>
                    handleUserChange(index, "name", e.target.value)
                  }
                />
                <Select
                  placeholder="Role"
                  value={user.role}
                  onChange={(value) => handleUserChange(index, "role", value)}
                >
                  <Option value="Staff">Staff</Option>
                  <Option value="PM">Project Manager</Option>
                </Select>
              </div>
            ))}
            <Button onClick={addUser} type="dashed">
              + Add User
            </Button>
          </Form>
        </Modal>

        <Modal
          title="Confirm Deletion"
          visible={passwordModalVisible}
          onCancel={() => setPasswordModalVisible(false)}
          onOk={handleConfirmDelete}
        >
          <p>Enter your password to delete the project:</p>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal>

        <Modal
          title="Edit Project"
          visible={isEditModalVisible}
          onCancel={handleEditCancel}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleEditProject}>
            <Form.Item label="Project Name" name="projectName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="Budget ($)" name="budget" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            {/* User Management Section */}
            <h3>Project Staff</h3>
            {users.map((user, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  placeholder="Name"
                  value={user.name}
                  onChange={(e) => handleUserChange(index, "name", e.target.value)}
                />
                <Select
                  placeholder="Role"
                  value={user.role}
                  onChange={(value) => handleUserChange(index, "role", value)}
                >
                  <Option value="Staff">Staff</Option>
                  <Option value="PM">Project Manager</Option>
                </Select>
                <Input
                  placeholder="Department"
                  value={user.department}
                  onChange={(e) => handleUserChange(index, "department", e.target.value)}
                />
                <Button type="text" danger onClick={() => removeUser(index)}>Remove</Button>
              </div>
            ))}
            <Button onClick={addUser} type="dashed">
              + Add User
            </Button>
          </Form>
        </Modal>

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-[#FCFCFC] p-5 overflow-auto">

            <div className="col-span-1 sm:col-span-2 lg:col-span-4">

              <Table<Project>
                columns={columns}
                dataSource={filteredProjects}
                rowKey="id"
                pagination={{
                  pageSize: pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10"],
                  showTotal: (total) => `Total ${total} projects`,
                  onShowSizeChange: (_, size) => setPageSize(size),
                }}
                scroll={{ x: true }}
              />
              <Modal
                title="Project Staff"
                visible={isEmployeeModalVisible}
                onCancel={handleCloseEmployeeModal}
                footer={null}
              >
                <Table<User>
                  columns={[
                    { title: "Name", dataIndex: "name", key: "name" },
                    { title: "Role", dataIndex: "role", key: "role" },
                    { title: "Department", dataIndex: "department", key: "department" },
                    {
                      title: "Status",
                      dataIndex: "blocked",
                      key: "blocked",
                      render: (blocked) => (
                        <Tag color={blocked ? "red" : "green"}>{blocked ? "Blocked" : "Active"}</Tag>
                      ),
                    },
                  ]}
                  dataSource={selectedProjectUsers}
                  pagination={false}
                  rowKey="id"
                />
              </Modal>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDashboard;

