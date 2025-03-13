import { notification } from "antd"

type NotificationType = 'success' | 'error' | 'info' | 'warning'

//this is Utility Function not a react component
export const Notification = (type:NotificationType,message:string | number,description?:string)=>{
      notification[type]({
            message,
            description,
            placement:'topRight',
            duration:3
      })
}