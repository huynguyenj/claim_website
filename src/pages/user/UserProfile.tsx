import {useState} from 'react'

import logouser from '../../assets/logouser.png'
import { EditOutlined } from '@ant-design/icons'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import { Select, DatePicker } from 'antd'

const Profile = () => {
    const [avatar, setAvatar] = useState<string | undefined>(logouser)
    const [phone, setPhone] = useState<string | undefined>('')

    const avatarChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAvatar(URL.createObjectURL(event.target.files[0]))
        }
    }

    const genders : string[] = ['Male','Female','Others']

  return (
    < div className = "flex flex-col items-center" > 
        <div className="w-1/2 min-w-sm bg-black rounded-4xl flex flex-col items-center">
            
            <div className="relative w-28 h-28 bottom-14">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-cyan-400 border-dotted">
                    <img src={avatar}
                        alt="Your avatar"
                        className="w-full h-full object-cover bg-white"/>
                </div>
                <label className="absolute bottom-0 right-0 bg-cyan-400 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition">
                    <EditOutlined/>
                    <input type="file" accept="image/*" className="hidden"
                        onChange={avatarChange}/>
                </label>
            </div>

            <div className="relative bottom-7 w-full px-4 flex flex-col items-center">
                <h1 className="mb-5 font-bold text-2xl text-white">
                    Profile Information
                </h1>

                {/* First and Last Name */}
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">First name</label>
                        <input type="text" className="bg-white p-1 rounded-lg border-2 border-cyan-400 border-dotted w-full"/>
                    </div>
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">Last name</label>
                        <input type="text" className="bg-white p-1 rounded-lg border-2 border-cyan-400 border-dotted w-full"/>
                    </div>
                </div>

                {/* Username and Password */}
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">Username</label>
                        <input type="text" className="bg-white p-1 rounded-lg border-2 border-cyan-400 border-dotted w-full"/>
                    </div>
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">Email</label>
                        <input type="text" className="bg-white p-1 rounded-lg border-2 border-cyan-400 border-dotted w-full"/>
                    </div>
                </div>

                {/* Email and Phone */}
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">Phone number</label>
                        <PhoneInput international placeholder="Enter phone number"
                            value={phone}
                            onChange={setPhone}
                            className="bg-white p-1 rounded-lg border-2 border-cyan-400 border-dotted w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">Address</label>
                        <input type="text" className="bg-white p-1 rounded-lg border-2 border-cyan-400 border-dotted w-full"/>
                    </div>
                </div>
                

                {/* Birthdate, and Gender */}
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">Birthdate</label>
                        <DatePicker className="w-full"/>
                    </div>
                    <div className="flex flex-col mb-5 flex-grow">
                        <label className="text-white">Gender</label>
                        <Select placeholder="Unspecified"
                            options={
                                genders.map((gender) => ({label: gender, value: gender}))
                            }
                            className="w-full"    
                        />
                    </div>
                </div>

                <button className='bg-cyan-400 hover:bg-blue-700 rounded-lg p-2 font-bold'>
                    Save Changes
                </button>
            </div>

        </div> 
    
    </div>
  )
}

export default Profile