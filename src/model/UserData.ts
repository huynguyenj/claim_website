export interface User{
      _id: string;
      email: string;
      user_name: string;
      role_code:string;
      is_verified:boolean;
      verification_token:string;
      verification_token_expires:string;
      token_version:number;
      is_blocked:boolean;
      created_at:string;
      updated_at:string;
      isDelete:boolean;
      phone: string;
      department: string;
      salary: number;
      role: 'admin' | 'user' | 'BA/PM' | 'finance';
      blocked?: boolean;
  }

  export interface UserInfo{
      _id: string;
      email: string;
      user_name: string;
      role_code:string;
      is_verified:boolean;
      verification_token:string;
      verification_token_expires:string;
      token_version:number;
      is_blocked:boolean;
      created_at:string;
      updated_at:string;
      isDelete:boolean;
      __v:number
  }

export type UserForm = {
      email:string,
      password:string     
}

export type RegisterForm = {
      firstName:string,
      lastName:string,
      userName:string,
      password:string,
      email:string,
      gender:boolean,
      address:string,
      phone:string,
      birth:Date     
}
