import axios, { AxiosInstance } from "axios";
import { FinanceClaim } from "../pages/finance/DataType";
import { ApiResponse, getApiErrorMessage } from "../consts/ApiResponse";
const API_BASE_URL: string = "https://management-claim-request.vercel.app/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Public API
const publicApiService = {
  login: async (infoLogin: object) => {
    const response = await apiClient.post(API_BASE_URL + "/auth", infoLogin);
    return response.data;
  },
  register: async (infoRegister: object) => {
    const response = await apiClient.post(
      API_BASE_URL + "/register",
      infoRegister
    );
    return response.data;
  },
  forgetPass: async (emailInfo: object) => {
    const response = await apiClient.put(
      API_BASE_URL + "/auth/forgot-password",
      emailInfo
    );
    return response.data;
  },
  verifyToken: async (token: object) => {
    const response = await apiClient.post(
      API_BASE_URL + "/auth/verify-token",
      token
    );
    return response.data;
  },
  resendToken: async (emailInfo: object) => {
    const response = await apiClient.post(
      API_BASE_URL + "/auth/resend-token",
      emailInfo
    );
    return response.data;
  },
};

const privateApiService = {
      getFinanceClaimList: async (filters: object): Promise<FinanceClaim[]> => {
        try {
          const response = await apiClient.post<ApiResponse<FinanceClaim[]>>(
            API_BASE_URL + "/claims/finance-search",
            filters
          );
          return response.data.data; 
        } catch (error) {
          throw new Error(getApiErrorMessage(error));
        }
      },
    };

export { privateApiService };
export default publicApiService;
