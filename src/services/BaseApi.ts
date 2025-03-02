import axios, { AxiosInstance, AxiosResponse} from 'axios'
import { ApiResponse, getApiErrorMessage } from '../consts/ApiResponse';
import { ApiResponseWithDataNull, Token } from '../model/UserData';
      const API_BASE_URL:string = 'https://management-claim-request.vercel.app/api'

      const apiClient:AxiosInstance = axios.create({
            baseURL:API_BASE_URL,
            headers:{
                  "Content-Type":"application/json"
            }
      })

      apiClient.interceptors.request.use(
                  (config)=>{
                        return config;
                  },
                  (error)=>Promise.reject(error)
            )
      
      apiClient.interceptors.response.use((response: AxiosResponse)=>response, 
                  (error)=>{
                        const errorMessage = getApiErrorMessage(error);
                              return Promise.reject(errorMessage)
                  }
            )
      //Public API
      const publicApiService = {
            login: (infoLogin:object):Promise<ApiResponse<Token>> => apiClient.post(API_BASE_URL+'/auth',infoLogin).then((res) => res.data)
            ,
            register: async(infoRegister:object)=>{
                  const response = await apiClient.post(API_BASE_URL+'/register',infoRegister)
                  return response.data;
            },
            forgetPass: (emailInfo: object): Promise<ApiResponse<ApiResponseWithDataNull>> =>  apiClient.put(API_BASE_URL+'/auth/forgot-password',emailInfo).then((res) => res.data)
            ,
            verifyToken: (token: object): Promise<ApiResponse<ApiResponseWithDataNull>> =>  apiClient.post(API_BASE_URL+'/auth/verify-token',token).then((res) => res.data)
            ,
            resendToken: (emailInfo: object): Promise<ApiResponse<ApiResponseWithDataNull>> => apiClient.post(API_BASE_URL+'/auth/resend-token',emailInfo).then((res) => res.data)
            ,

      }

      export default publicApiService