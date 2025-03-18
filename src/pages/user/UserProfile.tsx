import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

import ApiService from "../../services/ApiService";

import { ApiResponse } from "../../consts/ApiResponse";
import { Employee } from "../../model/EmployeeData";
import { Project, PaginatedResponse } from "../../model/ProjectData";
import {
  FinanceClaim,
  FinanceClaimResponse,
} from "../../pages/finance/DataType";

import {
  TotalRequestIcon,
  PendingRequestIcon,
  ApprovedRequestIcon,
  RejectedRequestIcon,
  UploadIcon,
} from "../../components/Icon/MuiIIcon";
import {
  Space,
  Form,
  Input,
  Button,
  Modal,
  Divider,
  Card,
  Spin,
  message,
} from "antd";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const roleMap: Record<string, string> = {
  A001: "Administrator",
  A002: "Finance",
  A003: "BUL, PM",
  A004: "All Members Remaining",
};

const formatDate = (dateTimeString: string | undefined) => {
  const dateTime = new Date(dateTimeString as string);
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(dateTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function Profile() {
  const [nameMailForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [employeeForm] = Form.useForm();

  const user = useAuthStore((state) => state.user);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [claims, setClaims] = useState<FinanceClaim[]>([]);

  const [totalClaims, setTotalClaims] = useState<FinanceClaim[]>([]);
  const [pendingClaims, setPendingClaims] = useState<FinanceClaim[]>([]);
  const [approvedClaims, setApprovedClaims] = useState<FinanceClaim[]>([]);
  const [rejectedClaims, setRejectedClaims] = useState<FinanceClaim[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedClaim, setSelectedClaim] = useState<FinanceClaim | null>(null);
  // const [selectedProject, setSelectecProject] = useState<Project | null>(null)

  const fetchUser = async () => {
    setFetchingUser(true);

    nameMailForm.setFieldsValue({
      usernameInput: user?.user_name,
      emailInput: user?.email,
    });

    setFetchingUser(false);
  };

  const fetchEmployee = async () => {
    setFetchingEmployee(true);

    const employee = await ApiService.get<ApiResponse<Employee>>(
      `/employees/${user?._id}`
    ).then((res) => res.data);
    setEmployee(employee);

    employee.job_rank = "DEV1";
    employee.contract_type = "THREE YEAR";
    employee.department_code = "CMS";
    employee.end_date = new Date().toISOString();
    employee.salary = 3000001;

    employeeForm.setFieldsValue({
      avatarInput: employee.avatar_url,
      fullnameInput: employee.full_name,
      phoneInput: employee.phone,
      addressInput: employee.address,
    });

    setFetchingEmployee(false);
  };

  const fetchProjects = async () => {
    setFetchingProjects(true);

    const searchParams = {
      searchCondition: {
        project_start_date: "",
        project_end_date: "",
        is_delete: false,
        user_id: user?._id,
      },
      pageInfo: {
        pageNum: 10,
        pageSize: 10,
      },
    };
    const projects = await ApiService.post<PaginatedResponse>(
      "/projects/search",
      searchParams
    ).then((res) => res.data);
    setProjects(projects.pageData);

    setFetchingProjects(false);
  };

  const fetchClaims = async () => {
    setFetchingClaims(true);

    const searchParams = {
      searchCondition: {
        // keyword: "",
        // claim_status: "",
        // claim_start_date: "", // lower the scope
        // claim_end_date: "",
        // is_delete: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
      },
    };

    const myClaims = await ApiService.post<ApiResponse<FinanceClaimResponse>>(
      "/claims/search",
      searchParams
    ).then((res) => res.data);
    const totalClaims = myClaims.pageData.filter((claim) => {
      return claim!.staff_id == user?._id;
    });
    //const totalClaims = claims.pageData
    setTotalClaims(totalClaims);

    const pendingClaims = totalClaims.filter(
      (claim) => claim.claim_status == "Pending Approval"
    );
    setPendingClaims(pendingClaims);

    const approvedClaims = totalClaims.filter(
      (claim) => claim.claim_status == "Approved"
    );
    setApprovedClaims(approvedClaims);

    const rejectedClaims = totalClaims.filter(
      (claim) => claim.claim_status == "Rejected"
    );
    setRejectedClaims(rejectedClaims);

    setFetchingClaims(false);
  };

  ////////////////////////
  ////////////////////////

  const updateUser = async () => {
    try {
      const values = await nameMailForm.validateFields();
      const updateBody = {
        email: values.emailInput,
        user_name: values.usernameInput,
      };
      const response = await ApiService.put<ApiResponse<object>>(
        `/users/${user?._id}`,
        updateBody
      );
      if (response.success) {
        message.success("User updated successfully!");

        // poo
        user!.email = values.emailInput;
        user!.user_name = values.usernameInput;

        setRefresh((refreshes) => refreshes + 1);
      }
    } catch (error) {
      // message.error(getApiErrorMessage(error))
      console.log(error);
    }
  };

  const changePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      const updateBody = {
        old_password: values.oldPasswordInput,
        new_password: values.newPasswordInput,
      };
      const response = await ApiService.put<ApiResponse<object>>(
        "/users/change-password",
        updateBody
      );
      if (response.success) {
        message.success("Password changed successfully!");
        setRefresh((refreshes) => refreshes + 1);
      }
    } catch (error) {
      // message.error(getApiErrorMessage(error))
      console.log(error);
    }
  };

  const updateEmployee = async () => {
    try {
      const values = await employeeForm.validateFields();
      const updateBody = {
        user_id: user?._id,
        job_rank: employee?.job_rank,
        contract_type: employee?.contract_type,
        account: employee?.account,
        address: values.addressInput,
        phone: values.phoneInput,
        full_name: values.fullnameInput,
        avatar_url: employee?.avatar_url, //values.avatarInput
        department_code: employee?.department_code,
        salary: employee?.salary,
        start_date: employee?.start_date,
        end_date: employee?.end_date,
        updated_by: employee?.updated_by,
      };
      const response = await ApiService.put<ApiResponse<object>>(
        `/employees/${user?._id}`,
        updateBody
      );
      if (response.success) {
        message.success("Info updated successfully!");

        setRefresh((refreshes) => refreshes + 1);
      }
    } catch (error) {
      // message.error(getApiErrorMessage(error))
      console.log(error);
    }
  };

  ////////////////////////
  ////////////////////////

  const [fetchingUser, setFetchingUser] = useState(false);
  const [fetchingEmployee, setFetchingEmployee] = useState(false);
  const [fetchingClaims, setFetchingClaims] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(false);

  const [isAvatarModal, setIsAvatarModal] = useState(false);
  const [isNameMailModal, setIsNameMailModal] = useState(false);
  const [isPasswordModal, setIsPasswordModal] = useState(false);

  // const [isProjectModal, setIsProjectModal] = useState(false)
  const [isClaimModal, setIsClaimModal] = useState(false);
  const [claimModalTitle, setClaimModalTitle] = useState("");
  const [isClaimModal2, setIsClaimModal2] = useState(false);

  const [refreshes, setRefresh] = useState(0);

  useEffect(() => {
    console.log(fetchingProjects);
    fetchUser();
    fetchEmployee();
    fetchProjects();
    fetchClaims();
  }, [refreshes]);

  return (
    <div className="flex flex-col items-center overflow-y-scroll">
      <div
        className="w-3/4 border-1 border-black rounded-xl flex flex-col items-center
            shadow-[2px_2px_0px_black]"
      >
        <br />

        <Spin tip="Loading" size="large" spinning={fetchingEmployee}>
          <Button
            style={{
              position: "relative",
              width: "7rem",
              height: "7rem",
              borderRadius: "9999px",
              overflow: "hidden",
              borderColor: "lightgrey",
              boxShadow: "2px 2px 0px black",
              padding: "0px",
            }}
            onClick={() => setIsAvatarModal(true)}
          >
            <img
              src={employee?.avatar_url}
              alt="Your avatar"
              className="w-full h-full object-cover z-1"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <UploadIcon />
            </div>
          </Button>
        </Spin>

        {/* Modal for Image URL Input */}
        <Modal
          className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                    shadow-[2px_2px_0px_black]"
          title="Enter Image URL"
          open={isAvatarModal}
          onOk={() => {
            employee!.avatar_url = employeeForm.getFieldValue("avatarInput");
            setIsAvatarModal(false);
          }}
          okText="Upload Avatar"
          onCancel={() => setIsAvatarModal(false)}
          cancelText="Cancel"
        >
          <Form form={employeeForm}>
            <Form.Item name="avatarInput">
              <Input
                placeholder="Paste image URL here..."
                className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                            shadow-[2px_2px_0px_black]"
              />
            </Form.Item>
          </Form>
          <img
            src={employee?.avatar_url}
            alt="Your avatar"
            className="w-full h-full object-cover z-1"
          />
        </Modal>

        <div className="relative w-full px-4">
          <Spin tip="Loading" size="large" spinning={fetchingUser}>
            <Form
              form={nameMailForm}
              layout="vertical"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Divider style={{ borderColor: "#b3b3b3" }}>
                Account Information
              </Divider>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                <div className="mx-5 lg:mx-10">
                  <Form.Item
                    name="usernameInput"
                    label="Username"
                    rules={[
                      {
                        required: true,
                        min: 1,
                        message: "Username must not be empty !",
                      },
                    ]}
                  >
                    <Input
                      disabled={!isNameMailModal}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
                <div className="mx-5 lg:mx-10">
                  <Form.Item
                    name="emailInput"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please enter a valid email !",
                      },
                    ]}
                  >
                    <Input
                      disabled={!isNameMailModal}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
              </div>

              {!isNameMailModal ? (
                <Form.Item>
                  <Button
                    type="default"
                    onClick={() => {
                      setIsNameMailModal(true);
                    }}
                  >
                    Change Username & Email
                  </Button>
                </Form.Item>
              ) : (
                <div className="flex flex-cols gap-4">
                  <Form.Item>
                    <Button
                      type="default"
                      onClick={() => {
                        setIsNameMailModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        updateUser();
                        setIsNameMailModal(false);
                      }}
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form>

            <Form
              form={passwordForm}
              layout="vertical"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Birthdate, and Gender */}
              {isPasswordModal && (
                <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                  <div className="mx-5 lg:mx-10">
                    <Form.Item
                      name="oldPasswordInput"
                      label="Old Password"
                      rules={[
                        {
                          required: true,
                          min: 6,
                          message:
                            "Old password must be at least 6 characters !",
                        },
                      ]}
                    >
                      <Input
                        className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                      />
                    </Form.Item>
                  </div>
                  <div className="mx-5 lg:mx-10">
                    <Form.Item
                      name="newPasswordInput"
                      label="New Password"
                      rules={[
                        {
                          required: true,
                          min: 6,
                          message:
                            "New password must be at least 6 characters !",
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
                          message:
                            "Must include uppercase, lowercase, number, and special character!",
                        },
                      ]}
                    >
                      <Input
                        className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                      />
                    </Form.Item>
                  </div>
                </div>
              )}

              {!isPasswordModal ? (
                <Form.Item>
                  <Button
                    type="default"
                    onClick={() => {
                      setIsPasswordModal(true);
                    }}
                  >
                    Change Password
                  </Button>
                </Form.Item>
              ) : (
                <div className="flex flex-cols gap-4">
                  <Form.Item>
                    <Button
                      type="default"
                      onClick={() => {
                        setIsPasswordModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        changePassword();
                        setIsPasswordModal(false);
                      }}
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form>
          </Spin>

          <Spin tip="Loading" size="large" spinning={fetchingEmployee}>
            <Form
              form={employeeForm}
              layout="vertical"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Divider style={{ borderColor: "#b3b3b3" }}>
                Personal Information
              </Divider>

              {/* Full name */}
              <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                <div className="mx-5 lg:mx-10">
                  <Form.Item
                    name="fullnameInput"
                    label="Full name"
                    rules={[
                      {
                        required: true,
                        min: 1,
                        message: "Full name cannot be empty !",
                      },
                    ]}
                  >
                    <Input
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
                <div className="mx-5 lg:mx-10">
                  <Form.Item
                    name="phoneInput"
                    label="Phone number"
                    rules={[
                      {
                        required: true,
                        min: 1,
                        message: "Phone number cannot be empty !",
                      },
                      {
                        pattern: /^\+?[1-9]\d{0,2} ?\d{1,4} ?\d{1,4} ?\d{1,9}$/,
                        message: "Incorrect phone number format !",
                      },
                    ]}
                  >
                    <PhoneInput
                      international
                      placeholder="Enter phone number"
                      onChange={() => {}}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Address and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-1 w-full">
                <div className="mx-5 lg:mx-10">
                  <Form.Item
                    name="addressInput"
                    label="Address"
                    rules={[
                      {
                        required: true,
                        min: 1,
                        message: "Address cannot be empty !",
                      },
                    ]}
                  >
                    <Input
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
              </div>

              <Divider style={{ borderColor: "#b3b3b3" }}>
                Company Information
              </Divider>

              <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                <div className="mx-5 lg:mx-10">
                  <Form.Item label="Role">
                    <Input
                      value={roleMap[user?.role_code || "A004"]}
                      disabled={true}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
                <div className="mx-5 lg:mx-10">
                  <Form.Item label="Department">
                    <Input
                      value={employee?.department_code}
                      disabled={true}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                <div className="mx-5 lg:mx-10">
                  <Form.Item label="Contract">
                    <Input
                      value={employee?.contract_type}
                      disabled={true}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
                <div className="mx-5 lg:mx-10">
                  <Form.Item label="Salary">
                    <Input
                      value={employee?.salary}
                      disabled={true}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
                <div className="mx-5 lg:mx-10">
                  <Form.Item label="Job rank">
                    <Input
                      value={employee?.job_rank}
                      disabled={true}
                      className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                        shadow-[2px_2px_0px_black]"
                    />
                  </Form.Item>
                </div>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={updateEmployee}
                >
                  Save changes
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>

      <br />
      <div className="w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div
          className="w-100% border-1 border-black rounded-xl flex flex-col items-center
                shadow-[2px_2px_0px_black]"
        >
          <h1 className="mb-5 font-bold text-2xl text-black">Your Requests</h1>

          <Spin tip="Loading" size="large" spinning={fetchingClaims}>
            <ul className="flex flex-col items-center">
              <Button
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "0.5rem",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalTitle("Total Requests");
                  setClaims(totalClaims);
                  setIsClaimModal(true);
                }}
              >
                <p className="col-span-1">
                  {" "}
                  <TotalRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-lg"> Total Requests: </p>
                <p className="col-span-1 text-lg bg-gray-200 flex items-center justify-center rounded-full">
                  {totalClaims.length}
                </p>
              </Button>
              <Button
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "0.5rem",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalTitle("Pending Requests");
                  setClaims(pendingClaims);
                  setIsClaimModal(true);
                }}
              >
                <p className="col-span-1">
                  {" "}
                  <PendingRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-lg"> Pending Requests: </p>
                <p className="col-span-1 text-lg bg-gray-200 flex items-center justify-center rounded-full">
                  {pendingClaims.length}
                </p>
              </Button>
              <Button
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "0.5rem",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalTitle("Approved Requests");
                  setClaims(approvedClaims);
                  setIsClaimModal(true);
                }}
              >
                <p className="col-span-1">
                  {" "}
                  <ApprovedRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-lg"> Approved Requests: </p>
                <p className="col-span-1 text-lg bg-gray-200 flex items-center justify-center rounded-full">
                  {approvedClaims.length}
                </p>
              </Button>
              <Button
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "0.5rem",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalTitle("Rejected Requests");
                  setClaims(rejectedClaims);
                  setIsClaimModal(true);
                }}
              >
                <p className="col-span-1">
                  {" "}
                  <RejectedRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-lg"> Rejected Requests: </p>
                <p className="col-span-1 text-lg bg-gray-200 flex items-center justify-center rounded-full">
                  {rejectedClaims.length}
                </p>
              </Button>
            </ul>
          </Spin>
        </div>

        <Modal
          title={claimModalTitle}
          open={isClaimModal}
          footer={null}
          onCancel={() => setIsClaimModal(false)}
        >
          <ul className="flex flex-col item-center">
            {claims.map((claim) => (
              <Card
                hoverable
                style={{ borderColor: "gray", margin: "0.5rem" }}
                onClick={() => {
                  setSelectedClaim(claim);
                  setIsClaimModal2(true);
                }}
              >
                <div className="grid grid-cols-3 rounded-md">
                  <span className="col-span-2 font-bold text-2xl">
                    {claim.claim_name}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      {
                        Draft: "bg-gray-200",
                        "Pending Approval": "bg-yellow-200",
                        Approved: "bg-green-200",
                        Rejected: "bg-red-200",
                        "Pending Payment": "bg-blue-200",
                        Paid: "bg-purple-200",
                      }[claim.claim_status]
                    }`}
                  >
                    {claim.claim_status}
                  </span>
                </div>
              </Card>
            ))}
          </ul>
        </Modal>

        <Modal
          title="Request Details"
          open={isClaimModal2}
          footer={null}
          onCancel={() => setIsClaimModal2(false)}
        >
          <Form>
            <Form.Item label="Request Name">
              <Input disabled value={selectedClaim?.claim_name} />
            </Form.Item>
            <Form.Item label="Start Date">
              <Input
                disabled
                value={formatDate(selectedClaim?.claim_start_date)}
              />
            </Form.Item>
            <Form.Item label="End Date">
              <Input
                disabled
                value={formatDate(selectedClaim?.claim_start_date)}
              />
            </Form.Item>
            <Form.Item label="Total Work Time">
              <Input
                disabled
                value={`${selectedClaim?.total_work_time} hours`}
              />
            </Form.Item>
            <Form.Item label="Status">
              <Input disabled value={selectedClaim?.claim_status} />
            </Form.Item>
          </Form>
        </Modal>

        <div
          className="w-100% border-1 border-black rounded-xl flex flex-col items-center
                shadow-[2px_2px_0px_black]"
        >
          <h1 className="mb-5 font-bold text-2xl text-black">Your Projects</h1>

          <ul className="w-4/5">
            {projects.map((project) => (
              <li
                className="border-1 rounded-lg m-4 px-4 shadow-[2px_2px_0px_black]
                        cursor-pointer hover:bg-gray-200 transition"
              >
                <p className="font-bold text-2xl">{project.project_name}</p>
                <p>{project.project_start_date}</p>
                <p>{project.project_end_date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;

///////////////////////

///////////////////////

// function ProjectModal(){
// return (
//     <Modal
//       title="Edit Project"
//       open={isEditModalOpen}
//       onCancel={() => setIsEditModalOpen(false)}
//       onOk={handleUpdateProject}
//       okText="Save"
//       cancelText="Cancel"
//       width={800}
//     >
//       <Form form={form} layout="vertical" initialValues={editingProject || {}}>
//         <Form.Item
//           label="Project Name"
//           name="project_name"
//           rules={[{ required: true, message: "Please enter the project name" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Project Code"
//           name="project_code"
//           rules={[{ required: true, message: "Please enter the project code" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item label="Project Department" name="project_department">
//           <Select placeholder="Select a department" loading={loading}>
//             {departments.map((dept) => (
//               <Select.Option key={dept.department_name} value={dept.department_name}>
//                 {dept.department_name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Project Description"
//           name="project_description"
//           rules={[{ required: true, message: "Write the project description" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Project Start Date"
//           name="project_start_date"
//           rules={[{ required: true, message: "Please select the project start date" }]}
//         >
//           <DatePicker format="YYYY-MM-DD" />
//         </Form.Item>

//         <Form.Item
//           label="Project End Date"
//           name="project_end_date"
//           rules={[
//             { required: true, message: "Please select the project end date" },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue('project_start_date') <= value) {
//                   return Promise.resolve();
//                 }
//                 return Promise.reject(new Error('End date must be later than start date'));
//               },
//             }),
//           ]}
//         >
//           <DatePicker format="YYYY-MM-DD" />
//         </Form.Item>

//         <Form.List name="project_members">
//           {(fields, { add, remove }) => (
//             <>
//               {fields.map(({ key, name, ...restField }) => (
//                 <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
//                   <Form.Item
//                     {...restField}
//                     name={[name, 'user_id']}
//                     rules={[{ required: true, message: 'Please select a user' }]}
//                     style={{ flex: 1, marginRight: 8 }}
//                   >
//                     <Select placeholder="Select a user">
//                       {users.map((user) => (
//                         <Select.Option key={user._id} value={user._id}>
//                           {user.user_name} ({user.email})
//                         </Select.Option>
//                       ))}
//                     </Select>
//                   </Form.Item>

//                   <Form.Item
//                     {...restField}
//                     name={[name, 'project_role']}
//                     rules={[{ required: true, message: 'Please select a role' }]}
//                     style={{ flex: 1 }}
//                   >
//                     <Select placeholder="Select a role">
//                       <Select.Option value="Project Manager">Project Manager</Select.Option>
//                       <Select.Option value="Developer">Developer</Select.Option>
//                       <Select.Option value="Designer">Designer</Select.Option>
//                       <Select.Option value="Tester">Tester</Select.Option>
//                     </Select>
//                   </Form.Item>

//                   <Button
//                     type="link"
//                     danger
//                     onClick={() => remove(name)}
//                     style={{ marginLeft: 8 }}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               ))}

//               <Button
//                 type="dashed"
//                 onClick={() => add()}
//                 style={{ width: '100%' }}
//               >
//                 Add Member
//               </Button>
//             </>
//           )}
//         </Form.List>
//       </Form>
//     </Modal>
// )
// }
