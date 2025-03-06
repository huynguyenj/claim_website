import { Form, Input, Modal } from "antd";
import useProfile, { FormUpdateProfile, PasswordUpdate } from "../../hooks/userHook/useProfile"
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import LoadingSpin from "../../components/common/LoadingSpin";

function ProfilePage() {
      const {employeeInfo,handleUpdateEmployeeInfoForUser,loading,handleChangePassword} = useProfile();
      const userInfo = useAuthStore((state) => state.user?.user_name)
      const [isModalOpen,setIsModalOpen] = useState<boolean>(false);
      const [isModalOpen2,setIsModalOpen2] = useState<boolean>(false);

      const [form] = Form.useForm();
      const [form2] = Form.useForm();

      const handleOpenModal = (modalNum: number):void =>{
            switch(modalNum){
                  case 1:
                   setIsModalOpen((prev) => !prev);
                   break;
                  case 2:
                   setIsModalOpen2((prev) => !prev);
                   break;
            }
      }
      const handleCloseModal = (modalNum: number) =>{
            switch(modalNum){
                  case 1:
                   setIsModalOpen((prev) => !prev);
                   break;
                  case 2:
                   setIsModalOpen2((prev) => !prev);
                   break;
            }
            form.resetFields();
      }
     
      const handleOk =  async (modalNum:number) =>{
            switch(modalNum){
                  case 1:
                   form.submit();
                   break;
                  case 2:
                   form2.submit();
                   break;
            }
          
      }
  return (
      <div className="w-full h-screen flex p-5">
            <div className="bg-dark-fig w-[30%] flex flex-col gap-5 items-center p-10 ">
            <div className="w-50 h-50 bg-white-fig flex items-center justify-center rounded-full shadow-fig border-2 border-black"><img className="w-full h-full flex rounded-full" src={employeeInfo?.avatar_url} alt="avatar" /></div>
            <p className="text-white-fig text-2xl">{userInfo}</p>
            </div>
            <div className="border-2 w-[80%] p-10 flex flex-col gap-10">
                  <p className="text-2xl">Full name: <span>{employeeInfo?.full_name}</span></p>
                  <p className="text-2xl">Address: <span>{employeeInfo?.address}</span></p>
                  <p className="text-2xl">Phone: <span>{employeeInfo?.phone}</span></p>
                  <p className="text-2xl">Department code: <span>{employeeInfo?.department_code}</span></p>
                  <p className="text-2xl">Job rank: <span>{employeeInfo?.job_rank}</span></p>
                  <div className="flex gap-10">
                  <button onClick={() => handleOpenModal(1)} className="bg-dark-fig w-fit text-white-fig px-10 py-2 rounded-2xl cursor-pointer">Edit</button>
                  <button onClick={() => handleOpenModal(2)} className="bg-dark-fig w-fit text-white-fig px-10 py-3 rounded-2xl cursor-pointer">Change password</button>
                  </div>
            </div>
            <Modal
                  open={isModalOpen}
                  onCancel={() => handleCloseModal(1)}
                  onOk={() => handleOk(1)}
                  title='Update profile'
            >     
              {loading ? 
                  <div className="flex justify-center mt-5">
                        <LoadingSpin width="2rem" border_color="black" border_top_clr="white" height="2rem"/>
                  </div>  :
                  <>
                  <Form onFinish={handleUpdateEmployeeInfoForUser} form={form}
                    initialValues={{
                        full_name: employeeInfo?.full_name,
                        address: employeeInfo?.address,
                        account: userInfo,
                        phone: employeeInfo?.phone
                      }}>
                        <Form.Item<FormUpdateProfile> label='Full name' name='full_name' rules={[{required:true, message:'Please enter your full name!'}]}>
                              <Input/>
                        </Form.Item>
                        <Form.Item<FormUpdateProfile> label='Address' name='address' rules={[{required:true, message:'Please enter your address!'}]}>
                              <Input />
                        </Form.Item>
                        <Form.Item<FormUpdateProfile> label='Username' name='account' rules={[{required:true, message:'Please enter your username!'}]}>
                              <Input/>
                        </Form.Item>
                        <Form.Item<FormUpdateProfile> label='Phone' name='phone' rules={[{required:true, message:'Please enter your phone number!'},
                              {pattern: /^\+?\d{1,3}[-.\s]?\d{9,10}$/,
                              message:"Please enter international Format (+84 for Vietnam, +1 for US, etc.)",}]}>
                              <Input/>
                        </Form.Item>
                  </Form>
                  </>
              }
            </Modal>
            <Modal open={isModalOpen2} onOk={() => handleOk(2)} onCancel={() => handleCloseModal(2)} title='Change password'>
                  {loading ? 
                  <div className="flex justify-center mt-5">
                        <LoadingSpin width="2rem" border_color="black" border_top_clr="white" height="2rem"/>
                  </div>  :
                  <>
                  <Form onFinish={handleChangePassword} form={form2}>
                        <Form.Item<PasswordUpdate> label='Old password' name='old_password' rules={[{required:true, message:'Please enter your full name!'}]}>
                              <Input.Password/>
                        </Form.Item>
                        <Form.Item<PasswordUpdate> label='New password' name='new_password' rules={[{required:true, message:'Please enter your address!'},   
                        {
                              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
                              message:"Must include uppercase, lowercase, number, and special character!",
                        }]}>
                              <Input.Password/>
                        </Form.Item>
                  </Form>
                  </>}
            </Modal>
      </div>
  )
}

export default ProfilePage