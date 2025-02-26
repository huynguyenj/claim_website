import { AxiosError } from "axios"

export interface ApiResponse<T>{
      success: string,
      data:T,
}

export const getApiErrorMessage = (error: unknown):string =>{
      const axiosError = error as AxiosError<{message?:string}>;
      return axiosError.response?.data.message || "An unexpected error occurred."

}
