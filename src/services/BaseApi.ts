import axios, { AxiosInstance} from 'axios'
const API_BASE_URL:string = ''

const apiClient:AxiosInstance = axios.create({
      baseURL:API_BASE_URL,
      headers:{
            "Content-Type":"application/json"
      }
})

//Public API
const publicApiService = {
      login: async (infoLogin:object)=>{
            const response = await apiClient.post(API_BASE_URL+'/login',infoLogin)
            return response.data;
      },
      register: async(infoRegister:object)=>{
            const response = await apiClient.post(API_BASE_URL+'/register',infoRegister)
            return response.data;
      }
}

export default publicApiService