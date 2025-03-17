import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import apiService from "../../services/ApiService";
import { ApiResponse } from "../../consts/ApiResponse";
import { Notification } from "../../components/common/Notification";
import { FormProps } from "antd";

type Employee = {
      _id: string;
  user_id: string;
  job_rank: string;
  contract_type: string;
  address: string;
  phone: string;
  full_name: string;
  avatar_url: string;
  department_code: string;
  salary: number;
  start_date: string; 
  end_date: string;   
  updated_by: string;
  created_at: string; 
  updated_at: string; 
  is_deleted: boolean;
  __v: number;
}

export interface EmployeeUpdateProfile {
      user_id?: string;
      job_rank?: string;
      contract_type?: string;
      account?: string;
      address?: string;
      phone?: string;
      full_name: string;
      avatar_url?: string;
      department_code?: string;
      salary: number;
      start_date?: string; 
      end_date?: string;   
      updated_by?: string;
    }

export interface FormUpdateProfile{
      account?: string;
      address?: string;
      phone?: string;
      full_name: string;
      avatar_url?: string;
}

export interface PasswordUpdate{
   old_password: string,
   new_password: string
}

export default function useProfile() {
  const useId = useAuthStore((state) => state.user?._id);
  const useName = useAuthStore((state) => state.user?.user_name);
  const [loading,setLoading] = useState<boolean>(false);
  const [employeeInfo,setEmployeeInfo] = useState<Employee>();
  useEffect(() => {
      const getEmployeeInfo = async () =>{
            try {
                  const response = await apiService.get<ApiResponse<Employee>>(`/employees/${useId}`);
                  console.log(response.data)
                  setEmployeeInfo(response.data);
            } catch (error) {
                  console.log(error as string)
            }
      }
      getEmployeeInfo();
  },[useId]);
  const mapToEmployeeUpdate = (employee: Employee): EmployeeUpdateProfile =>{
      return (    
            {
                  user_id: employee.user_id,
                  job_rank: employee.job_rank,
                  contract_type: employee.contract_type,
                  account: useName ? useName :'',
                  address: employee.address,
                  phone: employee.phone,
                  full_name: employee.full_name,
                  avatar_url: employee.avatar_url,
                  department_code: 'CMS',
                  salary: employee.salary,
                  start_date: employee.start_date, 
                  end_date: employee.end_date,
                  updated_by: employee.updated_by, 
            }
      )
  }
  const handleUpdateEmployeeInfoForUser:FormProps<FormUpdateProfile>["onFinish"] = async (newUpdate) => {
      if(employeeInfo){
            console.log(newUpdate)
            const oldData = mapToEmployeeUpdate(employeeInfo);
            console.log(oldData)
            const newData = {...oldData,...newUpdate};
            console.log(newData)
            try {
                  setLoading(true);
                  await apiService.put<ApiResponse<Employee>>(`/employees/${useId}`,newData);
                  Notification('success','Update successfully!')
            } catch (error) {
                  Notification('error',error as string)
            }finally{
                  setLoading(false)
            }
      }

  }

  const handleChangePassword:FormProps<PasswordUpdate>["onFinish"]  = async (password) => {
      try {
            console.log(password)
            setLoading(true);
            await apiService.put('/users/change-password',password);
            Notification('success','Your password have changed!')
      } catch (error) {
            console.log(error)
      }finally{
            setLoading(false)
      }
  }
  return{employeeInfo, handleUpdateEmployeeInfoForUser,loading,handleChangePassword}
}
