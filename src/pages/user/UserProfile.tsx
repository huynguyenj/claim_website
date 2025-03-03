import {useState} from 'react'
import avatarPfp from '../../assets/logouser.png'

import { EditOutlined } from '../../components/Icon/AntdIcon'
import { TotalRequestIcon, PendingRequestIcon, ApprovedRequestIcon, RejectedRequestIcon } from '../../components/Icon/MuiIIcon'
import { Space, Select, DatePicker } from 'antd'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


import { Project } from '../../model/ProjectData'

const Profile = () => {
    const [avatar, setAvatar] = useState<string | undefined>(avatarPfp)
    const [phone, setPhone] = useState<string | undefined>('')

    const avatarChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAvatar(URL.createObjectURL(event.target.files[0]))
        }
    }

    const genders : string[] = ['Male','Female','Other']
    const projects: Project[] = [
        {
          project_name: "AI Automation System",
          project_code: "AI2025",
          project_department: "Research & Development",
          project_description: "A system to automate repetitive tasks using AI and machine learning.",
          project_start_date: "2025-03-01",
          project_end_date: "2025-12-31",
          created_at:'',
          updated_at:'',
          is_deleted:false,
          project_comment:'',
          updated_by:'',
          project_members: [
            { user_id: "U001", project_role: "Project Manager" },
            { user_id: "U002", project_role: "Lead Developer" },
            { user_id: "U003", project_role: "Data Scientist" }
          ]
        },
        {
          project_name: "E-Commerce Platform",
          project_code: "EC2025",
          project_department: "IT & Sales",
          project_description: "A scalable e-commerce platform with integrated payment systems.",
          project_start_date: "2025-01-15",
          project_end_date: "2025-11-30",
          created_at:'',
          updated_at:'',
          is_deleted:false,
          project_comment:'',
          updated_by:'',
          project_members: [
            { user_id: "U004", project_role: "Product Owner" },
            { user_id: "U005", project_role: "Frontend Developer" },
            { user_id: "U006", project_role: "Backend Developer" }
          ]
        },
        {
          project_name: "Healthcare Management System",
          project_code: "HMS2025",
          project_department: "Healthcare IT",
          project_description: "A cloud-based healthcare management system for hospitals.",
          project_start_date: "2025-04-10",
          project_end_date: "2026-03-31",
          created_at:'',
          updated_at:'',
          is_deleted:false,
          project_comment:'',
          updated_by:'',
          project_members: [
            { user_id: "U007", project_role: "System Architect" },
            { user_id: "U008", project_role: "Security Analyst" },
            { user_id: "U009", project_role: "Database Administrator" }
          ]
        }
      ];
      
      
      
      


    return (
        < div className = "flex flex-col items-center overflow-y-scroll" > 
            <div className="w-3/4 border-1 border-black rounded-xl flex flex-col items-center
            shadow-[2px_2px_0px_black]">
                
                <br/>
                <div className="relative w-28 h-28">
                    <div className="w-full h-full rounded-full overflow-hidden border-1 border-black
                    shadow-[2px_2px_0px_black]">
                        <img src={avatar}
                            alt="Your avatar"
                            className="w-full h-full object-cover bg-white"/>
                    </div>
                    <label className="absolute top-0 right-0 bg-cyan-400 text-black p-2 rounded-full shadow-[2px_2px_0px_black]
                    cursor-pointer hover:bg-blue-700 transition">
                        <EditOutlined/>
                        <input type="file" accept="image/*" className="hidden"
                            onChange={avatarChange}/>
                    </label>
                </div>

                <form className="relative w-full px-4 flex flex-col items-center">
                    <h1 className="mb-5 font-bold text-2xl text-black">
                        Your Information
                    </h1>

                    {/* First and Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">First name</label>
                            <input type="text" className="bg-white p-1 rounded-sm border-1 border-black w-full
                            shadow-[2px_2px_0px_black]"/>
                        </div>
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">Last name</label>
                            <input type="text" className="bg-white p-1 rounded-sm border-1 border-black w-full
                            shadow-[2px_2px_0px_black]"/>
                        </div>
                    </div>

                    {/* Username and Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">Username</label>
                            <input type="text" className="bg-white p-1 rounded-sm border-1 border-black w-full
                            shadow-[2px_2px_0px_black]"/>
                        </div>
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">Email</label>
                            <input type="text" className="bg-white p-1 rounded-sm border-1 border-black w-full
                            shadow-[2px_2px_0px_black]"/>
                        </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">Phone number</label>
                            <PhoneInput international placeholder="Enter phone number"
                                value={phone}
                                onChange={setPhone}
                                className="bg-white p-1 rounded-sm border-1 border-black w-full
                                shadow-[2px_2px_0px_black]"
                            />
                        </div>
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">Address</label>
                            <input type="text" className="bg-white p-1 rounded-sm border-1 border-black w-full
                            shadow-[2px_2px_0px_black]"/>
                        </div>
                    </div>
                    

                    {/* Birthdate, and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">Birthdate</label>
                            <DatePicker style={{ border: '1px solid black', borderRadius: '4px', boxShadow:'2px 2px 0px black' }}/>
                        </div>
                        <div className="flex flex-col mb-5 flex-grow mx-5 lg:mx-10">
                            <label className="text-black">Gender</label>
                            <Select placeholder="Unspecified"
                                options={
                                    genders.map((gender) => ({label: gender, value: gender}))
                                }
                                style={{ border: '1px solid black', borderRadius: '4px', boxShadow:'2px 2px 0px black' }}    
                            />
                        </div>
                    </div>

                    <input type='submit' value='Save Changes' 
                    className='bg-cyan-400 hover:bg-blue-700 rounded-lg p-2 m-5 font-bold
                    shadow-[4px_4px_0px_black]'/>
                </form>

            </div> 
        
            <br/>
            <div className="w-3/4 grid grid-cols-2 gap-10">

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