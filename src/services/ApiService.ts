import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "../store/authStore";
import { ApiResponse, getApiErrorMessage } from "../consts/ApiResponse";
import {
  ChangeStatusClaim,
  FinanceClaimResponse,
  FinanceSearchCondition,
} from "../pages/finance/DataType";
import { ApiResponseWithDataNull } from "../model/UserData";
import { useErrorStore } from "../store/errorStore";
import { useLoadingStore } from "../store/loadingStore";

const API_BASE_URL: string = "https://management-claim-request.vercel.app/api/";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const errorMessage = getApiErrorMessage(error);
    console.log(errorMessage);
    // useAuthStore.getState().removeExpired();
    useErrorStore.setState({ message: errorMessage });
    // useErrorStore.getState().setMessage(errorMessage)
    return Promise.reject(errorMessage);
  }
);

//create object with CRUD function.
const apiService = {
  get: <T>(url: string, params?: object): Promise<T> =>
    apiClient.get(url, { params }).then((res) => res.data),
  post: <T>(url: string, data?: object): Promise<T> =>
    apiClient.post(url, data).then((res) => res.data),
  put: <T>(url: string, data?: object): Promise<T> =>
    apiClient.put(url, data).then((res) => res.data),
  delete: <T>(url: string): Promise<T> =>
    apiClient.delete(url).then((res) => res.data),
};

const privateApiService = {
  getFinanceClaimList: (
    filters: FinanceSearchCondition
  ): Promise<ApiResponse<FinanceClaimResponse> | null> => {
    return apiClient
      .post<ApiResponse<FinanceClaimResponse>>(
        API_BASE_URL + "claims/finance-search",
        filters
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });
  },
  payForEmployee: (
    status: ChangeStatusClaim
  ): Promise<ApiResponseWithDataNull> => {
    useLoadingStore.setState({ loading: true });
    return apiClient
      .put<ApiResponseWithDataNull>(
        `${API_BASE_URL}claims/change-status`,
        status
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error:", error);
        return { success: false, data: null };
      })
      .finally(() => {
        useLoadingStore.setState({ loading: false });
      });
  },
};

export { privateApiService };
export default apiService;
