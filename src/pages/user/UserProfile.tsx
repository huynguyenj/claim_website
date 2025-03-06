import { useState, useEffect } from 'react'
import { useAuthStore } from "../../store/authStore";

import ApiService from '../../services/ApiService'

import { ApiResponse } from "../../consts/ApiResponse";
import { Employee } from '../../model/EmployeeData'
import { Project, PaginatedResponse } from '../../model/ProjectData'


import { TotalRequestIcon, PendingRequestIcon, ApprovedRequestIcon, RejectedRequestIcon, UploadIcon } from '../../components/Icon/MuiIIcon'
import { Space, Form, Input, Button, Modal, Divider, message } from 'antd'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const roleMap: Record<string, string> = {
    A001: "Administrator",
    A002: "Finance",
    A003: "BUL, PM",
    A004: "All Members Remaining",
};


const Profile = () => {
    const user = useAuthStore((state) => state.user)
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [projects, setProjects] = useState<Project[]>([])

    const fetchEmployee = async () => {
        const employee = await ApiService.get<ApiResponse<Employee>>(`/employees/${user?._id}`).then((res) => res.data)
        
        // hard coded cuz the database requires
        employee.job_rank = "DEV1"
        employee.contract_type = "THREE YEAR"
        employee.department_code = "CMS"
        employee.end_date = new Date().toISOString()
        employee.salary = 3000001

        setEmployee(employee)
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
        const projects = await ApiService.post<PaginatedResponse>('/projects/search', searchParams).then((res) => res.data.pageData)
        setProjects(projects)
    }

    ////////////////////////
    ////////////////////////

    const [userForm] = Form.useForm()
    const [passwordForm] = Form.useForm()
    const [employeeForm] = Form.useForm()

    const updateUser = async () => {
        try {
            const values = await userForm.validateFields()
            const updateBody = {
                email: values.emailInput
                ,user_name: values.usernameInput
            }
            const response = await ApiService.put<ApiResponse<object>>(`/users/${user?._id}`, updateBody)
            if (response){
                message.success("User updated successfully!")
                setIsNameMail(false)
            }
        } catch (error) {
            message.error("Failed to update user!")
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
            if (response){
                message.success("Password changed successfully!")
                setIsPassword(false)
            }
        } catch (error) {
            message.error("Failed to change password!")
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
            if (response)
                message.success("Info updated successfully!")
        } catch (error) {
            message.error("Failed to update info!")
        } 
    }

    ////////////////////////
    ////////////////////////

    if (!employee) fetchEmployee()
    if (!projects) fetchProjects()

    const [isAvatar, setIsAvatar] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(employee?.avatar_url)

    const [isNameMail, setIsNameMail] = useState(false)
    const [isPassword, setIsPassword] = useState(false)

    useEffect(() => {
        console.log(user)
        console.log(employee)
    }, [employee, projects, isAvatar, isNameMail, isPassword])
    
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
                    src={avatarUrl}
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
                    onOk={async () => {
                        setAvatarUrl(employeeForm.getFieldValue("avatarInput"))
                        setIsAvatar(false)
                    }}
                    okText="Upload Avatar"
                    onCancel={() => setIsAvatar(false)}
                    cancelText="Cancel"
                >
                    <Form form={employeeForm} >
                        <Form.Item 
                        name="avatarInput">
                            <Input     
                            placeholder="Paste image URL here..." 
                            value={avatarUrl}
                            className="bg-white p-1 rounded-sm border-1 border-gray-300 w-full
                            shadow-[2px_2px_0px_black]"
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                
                <div className="relative w-full px-4">
                    <Form
                    form={userForm}
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
                                    value={user?.user_name}
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
                                    value={user?.email}
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
                                <Button type='primary' onClick={updateUser}>
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
                                onClick={changePassword}>
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
                                    value={employee?.full_name}
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
                                    value={employee?.phone || ""}
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
                                    value={employee?.address}
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
            <div className="w-3/4 grid grid-cols-2 gap-10">

                <div className="w-100% border-1 border-black rounded-xl flex flex-col items-center
                shadow-[2px_2px_0px_black]">
                    <h1 className="mb-5 font-bold text-2xl text-black">
                        Your Projects
                    </h1>

                    <ul className='w-4/5'>
                        {projects?.map((project) => (
                        <li className='border-1 rounded-lg m-4 px-4 shadow-[2px_2px_0px_black]
                        cursor-pointer hover:bg-gray-200 transition'>
                            <p className='font-bold text-2xl'>{project.project_name}</p>
                            <p>{project.project_start_date}</p>
                            <p>{project.project_end_date}</p>
                            
                        </li>
                        ))}
                    </ul>
                    
                </div>

                <div className="w-100% border-1 border-black rounded-xl flex flex-col items-center
                shadow-[2px_2px_0px_black]">
                    <h1 className="mb-5 font-bold text-2xl text-black">
                        Your Requests
                    </h1>

                    <ul className='w-3/4'>
                        <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
                        cursor-pointer hover:bg-gray-200 transition'>
                            <p className='col-span-1'> <TotalRequestIcon/> <Space/> </p>
                            <p className='col-span-4 text-lg'> Total Requests: </p>
                            <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
                                0
                            </p>
                        </li>
                        <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
                        cursor-pointer hover:bg-gray-200 transition'>
                            <p className='col-span-1'> <PendingRequestIcon/> <Space/> </p>
                            <p className='col-span-4 text-lg'> Pending Requests: </p>
                            <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
                                0
                            </p>
                        </li>
                        <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
                        cursor-pointer hover:bg-gray-200 transition'>
                            <p className='col-span-1'> <ApprovedRequestIcon/> <Space/> </p>
                            <p className='col-span-4 text-lg'> Approved Requests: </p>
                            <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
                                0
                            </p>
                        </li>
                        <li className='grid grid-cols-6 border-1 rounded-lg m-4 p-4 shadow-[2px_2px_0px_black]
                        cursor-pointer hover:bg-gray-200 transition'>
                            <p className='col-span-1'> <RejectedRequestIcon/> <Space/> </p>
                            <p className='col-span-4 text-lg'> Rejected Requests: </p>
                            <p className='col-span-1 text-lg bg-cyan-300 flex items-center justify-center rounded-full'>
                                0
                            </p>
                        </li>
                    </ul>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Profile