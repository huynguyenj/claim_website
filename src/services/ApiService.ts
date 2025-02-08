import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { useAuthStore } from '../store/store'

const API_BASE_URL = ''

const apiClient:AxiosInstance = axios.create({
      baseURL:API_BASE_URL,
      headers:{
            "Content-Type":"application/json"
      }
})

apiClient.interceptors.request.use(
      (config)=>{
            const token = useAuthStore.getState().token;
            if(token){
                  config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
      },
      (error)=>Promise.reject(error)
)

apiClient.interceptors.response.use((response: AxiosResponse)=>response, 
      (error)=>{
            if(error.response === 401){
                  console.log('token has expired!');
                  useAuthStore.getState().removeExpired();
            }
            return Promise.reject(error)
      }
)

//create object with CRUD function.
const apiService = {
      get: <T> (url:string, params?:object): Promise<T> => apiClient.get(url,{params}).then((res)=>res.data),     
      post:<T> (url:string, data?:object): Promise<T> => apiClient.post(url,data).then((res)=> res.data),
      put: <T> (url:string, data?:object): Promise<T> => apiClient.put(url,data).then((res)=>res.data),
      delete: <T> (url:string): Promise<T> => apiClient.delete(url).then((res)=> res.data)
}

export default apiService