import { useState, useEffect } from 'react'
import { useAuthStore } from "../../store/authStore";

import ApiService from '../../services/ApiService'

import { ApiResponse, getApiErrorMessage } from "../../consts/ApiResponse";
import { Employee } from '../../model/EmployeeData'
import { Project, PaginatedResponse } from '../../model/ProjectData'
import { Claim, ClaimResponse } from '../../model/ClaimData'


import { TotalRequestIcon, PendingRequestIcon, ApprovedRequestIcon, RejectedRequestIcon, UploadIcon } from '../../components/Icon/MuiIIcon'
import { Space, Form, Input, Button, Modal, Divider, message } from 'antd'

// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'


const roleMap: Record<string, string> = {
    A001: "Administrator",
    A002: "Finance",
    A003: "BUL, PM",
    A004: "All Members Remaining",
};
import { roleDefine } from "../../consts/UserRole";


function Profile() {
    const [nameMailForm] = Form.useForm()
    const [passwordForm] = Form.useForm()
    const [employeeForm] = Form.useForm()


    var user = useAuthStore((state) => state.user)
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [claims, setClaims] = useState<Claim[]>([])


    const fetchUser = async () => {
        nameMailForm.setFieldsValue({
            "usernameInput": user?.user_name,
            "emailInput": user?.email
        })
    }

    const fetchEmployee = async () => {
        const employee = await ApiService.get<ApiResponse<Employee>>(`/employees/${user?._id}`).then((res) => res.data)
        setEmployee(employee)

        employee.job_rank = "DEV1"
        employee.contract_type = "THREE YEAR"
        employee.department_code = "CMS"
        employee.end_date = new Date().toISOString()
        employee.salary = 3000001

        employeeForm.setFieldsValue({
            "avatarInput": employee.avatar_url,
            "fullnameInput": employee.full_name,
            "phoneInput": employee.phone,
            "addressInput": employee.address,
        })
    }

    const fetchProjects = async () => {
        const searchParams = {
            searchCondition: {
                project_start_date: '',
                project_end_date: '',
                is_delete: false,
                user_id: user?._id
            },
            pageInfo: {
                pageNum: 10,
                pageSize: 10
            },
        };
        const projects = await ApiService.post<PaginatedResponse>('/projects/search', searchParams).then((res) => res.data)
        setProjects(projects.pageData)
    }

    const fetchClaims = async () => {
        const searchParams = {
            searchCondition: {
                keyword: "",
                claim_status: "",
                claim_start_date: "",
                claim_end_date: "",
                is_delete: false,
            },
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
            }
        }

        switch (user?.role_code) {
            // case roleDefine.CLAIMER_ROLE: {
                
            // }
            default: {
                const claims = await ApiService.post<ClaimResponse>('/claims/search', searchParams).then((res) => res.data)
                setClaims(claims.pageData)
                console.log(claims)
            }
        }
    }

    ////////////////////////
    ////////////////////////

    const updateUser = async () => {
        try {
            const values = await nameMailForm.validateFields()
            const updateBody = {
                email: values.emailInput
                ,user_name: values.usernameInput
            }
            const response = await ApiService.put<ApiResponse<object>>(`/users/${user?._id}`, updateBody)
            if (response.success){
                message.success("User updated successfully!")

                // poo
                user!.email = values.emailInput
                user!.user_name = values.usernameInput

                setRefresh((refreshes) => refreshes+1)
            }
        } catch (error) {
            message.error(getApiErrorMessage(error))
        }
    }

    const changePassword = async () => {
        try {
            const values = await passwordForm.validateFields()
            const updateBody = {
                old_password: values.oldPasswordInput
                ,new_password: values.newPasswordInput
            }
            const response = await ApiService.put<ApiResponse<object>>('/users/change-password', updateBody)
            if (response.success){
                message.success("Password changed successfully!")

                setRefresh((refreshes) => refreshes+1)
            }
        } catch (error) {
            message.error(getApiErrorMessage(error))
        }
    }

    const updateEmployee = async () => {
        try {
            const values = await employeeForm.validateFields()
            const updateBody = {
                user_id: user?._id
                ,job_rank: employee?.job_rank
                ,contract_type: employee?.contract_type
                ,account: employee?.account
                ,address: values.addressInput
                ,phone: values.phoneInput
                ,full_name: values.fullnameInput
                ,avatar_url: values.avatarInput
                ,department_code: employee?.department_code
                ,salary: employee?.salary
                ,start_date: employee?.start_date
                ,end_date: employee?.end_date
                ,updated_by: employee?.updated_by
            }
            const response = await ApiService.put<ApiResponse<object>>(`/employees/${user?._id}`, updateBody)
            if (response.success){
                message.success("Info updated successfully!")
                
                setRefresh((refreshes) => refreshes+1)
            }
        } catch (error) {
            message.error(getApiErrorMessage(error))
        }
    }

    ////////////////////////
    ////////////////////////


    const [isAvatar, setIsAvatar] = useState(false)
    const [isNameMail, setIsNameMail] = useState(false)
    const [isPassword, setIsPassword] = useState(false)

    const [refreshes, setRefresh] = useState(0)

    useEffect(() => {
        fetchUser()
        fetchEmployee()
        fetchProjects()
        fetchClaims()
    }, [refreshes])
    
    return (
        < div className = "flex flex-col items-center overflow-y-scroll" > 
            <div className="w-3/4 border-1 border-black rounded-xl flex flex-col items-center
            shadow-[2px_2px_0px_black]">
                
                <br/>
                <Button 
                style={{position:'relative', width:'7rem', height:'7rem', borderRadius:'9999px', overflow:'hidden', 
                    borderColor:'lightgrey', boxShadow:'2px 2px 0px black', padding:'0px'}}
                onClick = {() => setIsAvatar(true)}
                >
                    <img
                    src={employee?.avatar_url}
                    alt="Your avatar"
                    className="w-full h-full object-cover z-1"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <UploadIcon/>
                    </div>
                </Button>

                {/* Modal for Image URL Input */}
                <Modal
                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                    shadow-[2px_2px_0px_black]"
                    title="Enter Image URL"
                    open={isAvatar}
                    onOk={() => {
                        employee!.avatar_url = employeeForm.getFieldValue("avatarInput")
                        setIsAvatar(false)
                    }}
                    okText="Upload Avatar"
                    onCancel={() => setIsAvatar(false)}
                    cancelText="Cancel"
                >
                    <Form 
                    form={employeeForm} 
                    >
                        <Form.Item 
                        name="avatarInput">
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
                    <Form
                    form={nameMailForm}
                    layout='vertical'
                    style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                    >
                        <Divider style={{borderColor: '#b3b3b3'}}>
                            Account Information
                        </Divider>

                        {/* Email and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                name="usernameInput"
                                label="Username"
                                rules={[{required:true, min:1, message:'Username must not be empty !'}]}>
                                    <Input 
                                    disabled={!isNameMail} 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                                
                            </div>
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                name="emailInput"
                                label="Email"
                                rules={[{required:true, type:'email', message:'Please enter a valid email !'}]}>
                                    <Input 
                                    disabled={!isNameMail} 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                        </div>
                        
                        {(!isNameMail) ? (
                            <Form.Item>
                                <Button 
                                type='default' 
                                onClick={() => {
                                    setIsNameMail(true)
                                }}>
                                    Change Username & Email
                                </Button>
                            </Form.Item>
                        ) : (<div className="flex flex-cols gap-4">
                            <Form.Item>
                                <Button type='default' 
                                onClick={() => {
                                    setIsNameMail(false)
                                }}>
                                    Cancel
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button 
                                type='primary' 
                                onClick={() => {
                                    updateUser()
                                    setIsNameMail(false)
                                }}>
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </div>)}
                    </Form>    

                    <Form
                    form={passwordForm}
                    layout='vertical'
                    style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                    >
                        {/* Birthdate, and Gender */}
                        {(isPassword) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                name="oldPasswordInput"
                                label="Old Password"
                                rules = {[{required:true, min:6, message:"Old password must be at least 6 characters !"}]}>
                                    <Input 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                name="newPasswordInput"
                                label="New Password"
                                rules = {[{required:true, min:6, message:"New password must be at least 6 characters !"}]}>
                                    <Input 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                        </div>
                        )}

                        {(!isPassword) ? (
                            <Form.Item>
                                <Button type='default' 
                                onClick={() => {
                                    setIsPassword(true)
                                }}>
                                    Change Password
                                </Button>
                            </Form.Item>
                        ) : (<div className="flex flex-cols gap-4">
                            <Form.Item>
                                <Button type='default' 
                                onClick={() => {
                                    setIsPassword(false)
                                }}>
                                    Cancel
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' 
                                onClick={() => {
                                    changePassword()
                                    setIsPassword(false)
                                }}>
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </div>)}
                    </Form>


                    <Form 
                    form={employeeForm}
                    layout='vertical'
                    style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                    >
                        <Divider style={{borderColor: '#b3b3b3'}}>
                            Personal Information
                        </Divider>

                         {/* Full name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                name="fullnameInput"
                                label="Full name"
                                rules={[{required:true, min:1, message:"Full name cannot be empty !"}]}>
                                    <Input 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                name="phoneInput"
                                label="Phone number"
                                rules={[
                                    {required:true, min:1, message:"Phone number cannot be empty !"},
                                    {pattern: /^\+?[1-9]\d{0,2} ?\d{1,4} ?\d{1,4} ?\d{1,9}$/, message:"Incorrect phone number format !"}
                                ]}>
                                    <PhoneInput international placeholder="Enter phone number"
                                    onChange={()=>{}}
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
                                rules={[{required:true, min:1, message:"Address cannot be empty !"}]}>
                                    <Input 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                        </div>

                        <Divider style={{borderColor: '#b3b3b3'}}>
                            Company Information
                        </Divider>

                        <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                label="Role">
                                    <Input 
                                    value={roleMap[user?.role_code || "A004"]}
                                    disabled={true} 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                label="Department">
                                    <Input 
                                    value={employee?.department_code}
                                    disabled={true} 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                label="Contract">
                                    <Input 
                                    value={employee?.contract_type}
                                    disabled={true} 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                label="Salary">
                                    <Input 
                                    value={employee?.salary}
                                    disabled={true} 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                            <div className="mx-5 lg:mx-10">
                                <Form.Item
                                label="Job rank">
                                    <Input 
                                    value={employee?.job_rank}
                                    disabled={true} 
                                    className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                                    shadow-[2px_2px_0px_black]"/>
                                </Form.Item>
                            </div>
                        </div>


                        <Form.Item>
                            <Button type='primary' htmlType='submit' onClick={updateEmployee}>
                                Save changes
                            </Button>
                        </Form.Item>
                    </Form>
                    
                </div>

            </div> 
        
            <br/>
            <div className="w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-10">

//                 <div className="w-100% border-1 border-black rounded-xl flex flex-col items-center
//                 shadow-[2px_2px_0px_black]">
//                     <h1 className="mb-5 font-bold text-2xl text-black">
//                         Your Requests
//                     </h1>

//                     <ul className='w-3/4'>
//                         <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
//                         cursor-pointer hover:bg-gray-200 transition'>
//                             <p className='col-span-1'> <TotalRequestIcon/> <Space/> </p>
//                             <p className='col-span-4 text-lg'> Total Requests: </p>
//                             <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
//                                 0
//                             </p>
//                         </li>
//                         <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
//                         cursor-pointer hover:bg-gray-200 transition'>
//                             <p className='col-span-1'> <PendingRequestIcon/> <Space/> </p>
//                             <p className='col-span-4 text-lg'> Pending Requests: </p>
//                             <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
//                                 0
//                             </p>
//                         </li>
//                         <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
//                         cursor-pointer hover:bg-gray-200 transition'>
//                             <p className='col-span-1'> <ApprovedRequestIcon/> <Space/> </p>
//                             <p className='col-span-4 text-lg'> Approved Requests: </p>
//                             <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
//                                 0
//                             </p>
//                         </li>
//                         <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
//                         cursor-pointer hover:bg-gray-200 transition'>
//                             <p className='col-span-1'> <RejectedRequestIcon/> <Space/> </p>
//                             <p className='col-span-4 text-lg'> Rejected Requests: </p>
//                             <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
//                                 0
//                             </p>
//                         </li>
//                     </ul>
                    
                </div>
            
                <div className="w-100% border-1 border-black rounded-xl flex flex-col items-center
                shadow-[2px_2px_0px_black]">
                    <h1 className="mb-5 font-bold text-2xl text-black">
                        Your Projects
                    </h1>

                    <ul className='w-4/5'>
                        {projects.map((project) => (
                        <li className='border-1 rounded-lg m-4 px-4 shadow-[2px_2px_0px_black]
                        cursor-pointer hover:bg-gray-200 transition'>
                            <p className='font-bold text-2xl'>{project.project_name}</p>
                            <p>{project.project_start_date}</p>
                            <p>{project.project_end_date}</p>
                            
                        </li>
                        ))}
                    </ul>
                    
                </div>                
                
            </div>
            
//         </div>
//     )
// }

export default Profile


///////////////////////

///////////////////////


function RequestModal(){
    return (
        <Modal>
            
        </Modal>
    )
}

function ProjectModal(){
    return (
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
    )
}