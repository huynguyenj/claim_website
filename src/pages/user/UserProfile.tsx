import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from 'framer-motion'

import ApiService from "../../services/ApiService";

import { ApiResponse } from "../../consts/ApiResponse";
import { Employee } from "../../model/EmployeeData";
import { Project, PaginatedResponse } from "../../model/ProjectData";
import { Claim, ClaimResponse } from "../../model/ClaimData";

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
  Spin,
  Tabs,
  Pagination,
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

function formatDate(dateTimeString: string | undefined) {
  const dateTime = new Date(dateTimeString as string);
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(dateTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function truncate(str : string, maxlength : number) {
  return (str.length > maxlength) ?
    str.slice(0, maxlength - 1) + '…' : str;
}


function Profile() {
  const [nameMailForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [employeeForm] = Form.useForm();

  const user = useAuthStore((state) => state.user);
  console.log(useAuthStore(state => state.token))
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]); // of the claim list modal

  const [totalClaims, setTotalClaims] = useState<Claim[]>([]);
  const [pendingClaims, setPendingClaims] = useState<Claim[]>([]);
  const [approvedClaims, setApprovedClaims] = useState<Claim[]>([]);
  const [rejectedClaims, setRejectedClaims] = useState<Claim[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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
    
    employee.end_date = new Date().toISOString();

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
        is_delete: false,
        user_id: user?._id,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
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
        is_delete: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
      },
    };

    const myClaims = await ApiService.post<ClaimResponse>(
      "/claims/claimer-search", // IMPORTANT
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

  const [isProjectModal, setIsProjectModal] = useState(false)
  const [isClaimModal, setIsClaimModal] = useState(false);
  const [claimModalType, setClaimModalType] = useState("");
  const [isClaimModal2, setIsClaimModal2] = useState(false);

  const [refreshes, setRefresh] = useState(0);
  const [tabKey, setTabKey] = useState('tab1');

  const [claimPage, setClaimPage] = useState(1);
  const [claimPageSize, setClaimPageSize] = useState(6);
  const [projectPage, setProjectPage] = useState(1);
  const [memberPage, setMemberPage] = useState(1);
  const [memberPageSize, setMemberPageSize] = useState(4);

  useEffect(() => {
    console.log(fetchingProjects);
    fetchUser();
    fetchEmployee();
    fetchProjects();
    fetchClaims();
  }, [refreshes]);

  return (
    <div className="flex flex-col items-center overflow-y-scroll ">
      <div
        className="w-3/4 border-1 border-black rounded-xl flex flex-col items-center
            shadow-[2px_2px_0px_black]"
      >
        <br />

        {/* AVATAR CIRCLE  */}
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

        {/* AVATAR MODAL */}
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


        <Tabs 
        centered
        defaultActiveKey='tab1'
        onChange={(key) => {
          setTabKey(key)
        }}
        >
          <Tabs.TabPane tab="Profile" key='tab1'/>
          <Tabs.TabPane tab="Username & Email" key='tab2'/>
          <Tabs.TabPane tab="Password" key='tab3'/>
        </Tabs>

      </div>


      {/* LOWER DIV, BELOW AVATAR */}
      <motion.div 
      layout
      className="w-3/4 border-1 border-black rounded-xl flex flex-col items-center
            shadow-[2px_2px_0px_black]"
      key={tabKey}
      variants={{
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.4 } },
        exit: { y: -20, opacity: 0, transition: { duration: 0.4 } },
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      >
        {tabKey == 'tab1' && <>
          {/* PERSONAL & COMPANY INFORMATION */}
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
        </>}

        {tabKey == 'tab2' && <>
          {/* ACCOUNT INFORMATION */}
          <br/>
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
                  onClick={updateUser}
                >
                  Save changes
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </>}

        {tabKey == 'tab3' && <>
          {/* ACCOUNT INFORMATION */}
          <br/>
          <Form
            form={passwordForm}
            layout="vertical"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={changePassword}
              >
                Save changes
              </Button>
            </Form.Item>
          </Form>
        </>}

      </motion.div>

      <br />
      <div className="w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

        {/* CLAIMS DIV */}
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
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalType("Total Requests");
                  setClaims(totalClaims);
                  setIsClaimModal(true);
                }}
                className="w-50 sm:w-100"
              >
                <p className="col-span-1">
                  {" "}
                  <TotalRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-[1rem] sm:text-[1.2rem]"> Total Requests: </p>
                <p className="col-span-1 px-2 text-lg bg-blue-200 flex items-center justify-center rounded-full">
                  {totalClaims.length}
                </p>
              </Button>
              <Button
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalType("Pending Requests");
                  setClaims(pendingClaims);
                  setIsClaimModal(true);
                }}
                className="w-50 sm:w-100"
              >
                <p className="col-span-1">
                  {" "}
                  <PendingRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-[1rem] sm:text-[1.2rem]"> Pending Requests: </p>
                <p className="col-span-1 px-2 text-lg bg-blue-200 flex items-center justify-center rounded-full">
                  {pendingClaims.length}
                </p>
              </Button>
              <Button
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalType("Approved Requests");
                  setClaims(approvedClaims);
                  setIsClaimModal(true);
                }}
                className="w-50 sm:w-100"
              >
                <p className="col-span-1">
                  {" "}
                  <ApprovedRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-[1rem] sm:text-[1.2rem]"> Approved Requests: </p>
                <p className="col-span-1 px-2 text-lg bg-blue-200 flex items-center justify-center rounded-full">
                  {approvedClaims.length}
                </p>
              </Button>
              <Button
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "2px 2px 0px black",
                }}
                onClick={() => {
                  setClaimModalType("Rejected Requests");
                  setClaims(rejectedClaims);
                  setIsClaimModal(true);
                }}
                className="w-50 sm:w-100"
              >
                <p className="col-span-1">
                  {" "}
                  <RejectedRequestIcon /> <Space />{" "}
                </p>
                <p className="col-span-4 text-[1rem] sm:text-[1.2rem]"> Rejected Requests: </p>
                <p className="col-span-1 px-2 text-lg bg-blue-200 flex items-center justify-center rounded-full">
                  {rejectedClaims.length}
                </p>
              </Button>
            </ul>
          
            <br/>
          </Spin>
        </div>

        {/* CLAIMS LIST MODAL */}
        <Modal
          title={claimModalType}
          open={isClaimModal}
          footer={null}
          onCancel={() => setIsClaimModal(false)}
        >
          <AnimatePresence mode='popLayout'>
            <motion.ul 
            className="flex flex-col item-center"
            >
              {claims.map((claim, index) => {
                if ((claimPage-1)*claimPageSize <= index && index <= claimPage*claimPageSize - 1) return (
                  <motion.li
                  variants={{
                    initial: { x: -20, opacity: 0 },
                    animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
                    exit: { x: 20, opacity: 0, transition: { duration: 0.4 } },
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  >
                    <Button
                    className="w-full min-h-12 flex justify-between items-center"
                    style={{ 
                      boxShadow: "2px 2px 0px black",
                      padding: "1rem", 
                      margin: "0.5rem" 
                    }}
                    onClick={() => {
                      setSelectedClaim(claim);
                      setIsClaimModal2(true);
                    }}
                    >
                      <span className="font-semibold flex-1 text-lg text-left">
                          {claim.claim_name}
                      </span>
                      <span
                        className={`px-4 text-gray-500 text-right text-md rounded-full ${
                          {
                            Draft: "bg-gray-200",
                            "Pending Approval": "bg-yellow-200",
                            Approved: "bg-green-200",
                            Rejected: "bg-red-200",
                            "Pending Payment": "bg-blue-200",
                            Paid: "bg-purple-200",
                          }[claim.claim_status]
                        }`}
                      >{claim.claim_status}</span>
                    </Button>
                  </motion.li>
                )
              })}
            </motion.ul>
          </AnimatePresence>
        
          <Pagination
          simple showSizeChanger
          defaultCurrent={1} pageSize={claimPageSize} pageSizeOptions={[6,12,24]} 
          total={claims.length}
          onChange={(pageNum) => {
            setClaimPage(pageNum)
          }}
          onShowSizeChange={(_, size) => {
            setClaimPageSize(size)
          }}/>
        </Modal>

        {/* CLAIMS DETAIL MODAL */}
        <Modal
          title="Request Details"
          open={isClaimModal2}
          footer={null}
          onCancel={() => setIsClaimModal2(false)}
        >
          <Form>
            <Form.Item label="Title">
              <Input readOnly value={selectedClaim?.claim_name} />
            </Form.Item>
            <Form.Item label="Start Date">
              <Input
                readOnly
                value={formatDate(selectedClaim?.claim_start_date)}
              />
            </Form.Item>
            <Form.Item label="End Date">
              <Input
                readOnly
                value={formatDate(selectedClaim?.claim_start_date)}
              />
            </Form.Item>
            <Form.Item label="Total Work Time">
              <Input
                readOnly
                value={`${selectedClaim?.total_work_time} hours`}
              />
            </Form.Item>
            <Form.Item label="Status">
              <Input readOnly value={selectedClaim?.claim_status} />
            </Form.Item>
          </Form>
        </Modal>

        {/* PROJECTS DIV */}
        <div
          className="w-100% border-1 border-black rounded-xl flex flex-col items-center
                shadow-[2px_2px_0px_black]"
        >
          <h1 className="mb-5 font-bold text-2xl text-black">Your Projects</h1>

          
          <AnimatePresence mode='popLayout'>
            <motion.ul 
            className="w-4/5"
            >
              <Spin tip="Loading" size="large" spinning={fetchingProjects}>
                {projects.map((project, index) => {
                  if ((projectPage-1)*4 <= index && index <= projectPage*4 - 1) return (
                    <motion.li
                    variants={{
                      initial: { x: -20, opacity: 0 },
                      animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
                      exit: { x: 20, opacity: 0, transition: { duration: 0.4 } },
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    >
                      <Button
                      type="default"
                      className="w-full min-h-12 flex justify-between items-center"
                      style={{
                        borderRadius: "0.5rem",
                        boxShadow: "2px 2px 0px black",
                        margin: "0.5rem"
                      }}
                      onClick = {() => {
                        setSelectedProject(project)
                        setIsProjectModal(true)
                      }}
                      >
                        <span className="font-semibold flex-1 text-lg text-left">{truncate(project.project_name, 20)}</span>
                        <span className={`px-4 text-gray-500 text-right text-md rounded-full ${
                          {
                            Draft: "bg-gray-200",
                            Processing: "bg-yellow-200",
                            Active: "bg-green-200",
                            Closed: "bg-red-200",
                          }[project.project_status]
                        }`}>{project.project_status}</span>
                      </Button>
                    </motion.li>
                  )
                })}
              </Spin>
            </motion.ul>
          </AnimatePresence>


          <Pagination 
          simple 
          defaultCurrent={1} pageSize={4} pageSizeOptions={[4]} 
          total={projects.length}
          onChange={(pageNum) => {
            setProjectPage(pageNum)
          }}/>
          
        </div>

          
        {/* PROJECT DETAIL MODAL */}
        <Modal
          title="Project Details"
          open={isProjectModal}
          onCancel={() => setIsProjectModal(false)}
          footer={null}
          width={1200}
        >
          <Form layout="vertical">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              <div>

                <div className="grid grid-cols-3">
                  <div className="px-2">
                    <Form.Item label="Name">
                      <Input readOnly value={selectedProject?.project_name}/>
                    </Form.Item>
                  </div>
                  <div className="px-2">
                    <Form.Item label="Code">
                      <Input readOnly value={selectedProject?.project_code}/>
                    </Form.Item>
                  </div>
                  <div className="px-2">
                    <Form.Item label="Department">
                      <Input readOnly value={selectedProject?.project_department}/>
                    </Form.Item>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="px-2">
                    <Form.Item label="Description">
                      <Input.TextArea readOnly value={selectedProject?.project_description}
                      autoSize={{ minRows: 3, maxRows: 12 }}/>
                    </Form.Item>
                  </div>
                  <div className="px-2">
                    <Form.Item label="Comment">
                      <Input.TextArea readOnly value={selectedProject?.project_comment}
                      autoSize={{ minRows: 3, maxRows: 12 }}/>
                    </Form.Item>
                  </div>
                </div>
                

                <div className="grid grid-cols-2">
                  <div className="px-2">
                    <Form.Item label="Start date">
                      <Input readOnly value={formatDate(selectedProject?.project_start_date)}/>
                    </Form.Item>
                  </div>
                  <div className="px-2">
                    <Form.Item label="End date">
                      <Input readOnly value={formatDate(selectedProject?.project_end_date)}/>
                    </Form.Item>
                  </div>
                </div>

              </div>
              

              <div>

                <Form.Item label="Members">
                  <ul className="pl-10">
                    {selectedProject?.project_members.map((member, index) => {
                      if ((memberPage-1)*memberPageSize <= index && index <= memberPage*memberPageSize - 1) return (
                        <div className="grid grid-cols-3">
                          <Form.Item label="Role">
                            <Input readOnly value={member.project_role}/>
                          </Form.Item>
                          <Form.Item label="Full name">
                            <Input readOnly value={member.full_name}/>
                          </Form.Item>
                          <Form.Item label="Username">
                            <Input readOnly value={member.user_name}/>
                          </Form.Item>
                        </div>
                      )
                    })}
                  </ul>

                  <Pagination
                  simple showSizeChanger
                  defaultCurrent={1} pageSize={memberPageSize} pageSizeOptions={[4,8,12]} 
                  total={selectedProject?.project_members.length}
                  onChange={(pageNum) => {
                    setMemberPage(pageNum)
                  }}
                  onShowSizeChange={(_, size) => {
                    setMemberPageSize(size)
                  }}/>
                </Form.Item>

              </div>

            </div>

          </Form>
        </Modal>

      </div>
    </div>
  );
}

export default Profile;

///////////////////////

///////////////////////
