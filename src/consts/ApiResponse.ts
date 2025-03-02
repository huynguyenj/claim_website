import { AxiosError } from "axios"

export interface ApiResponse<T>{
      success: string,
      data:T,
}

export const getApiErrorMessage = (error: unknown):string|number =>{
      const axiosError = error as AxiosError<{message?:string}>;
      switch(axiosError.status){
            case 403:
                  return axiosError.response?.status as number
            case 404:
                  return axiosError.response?.status as number
            default: 
                  return axiosError.response?.data.message || "An unexpected error occurred."

      }

}
