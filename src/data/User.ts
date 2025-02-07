export type User = {
      id: string,
      name:string,
      email:string,
      phone: string,
      department: string,
      salary: number,
      role:string
}

export type UserForm = {
      userName?:string,
      password?:string     
}
