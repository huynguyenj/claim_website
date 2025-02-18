export interface User{
      id: string;
      name: string;
      email: string;
      phone: string;
      department: string;
      salary: number;
      role: 'admin' | 'user' | 'BA/PM' | 'finance';
      blocked?: boolean;
  }

export type UserForm = {
      userName:string,
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
