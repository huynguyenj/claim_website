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

    const genders : string[] = ['Male','Female','Other']

  return (
    < div className = "flex flex-col items-center overflow-y-scroll" > 
        <div className="w-3/4 flex-shrink border-1 border-black rounded-xl flex flex-col items-center
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

            <div className="relative w-full px-4 flex flex-col items-center">
                <h1 className="mb-5 font-bold text-2xl text-black">
                    Profile Information
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

                <button className='bg-cyan-400 hover:bg-blue-700 rounded-lg p-2 m-5 font-bold
                shadow-[4px_4px_0px_black]'>
                    Save Changes
                </button>
            </div>

        </div> 
    
    </div>
  )
}

export default Profile