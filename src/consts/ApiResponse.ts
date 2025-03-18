import { AxiosError } from "axios"

export interface ApiResponse<T> {
      success: boolean,
      data: T,
}

export const getApiErrorMessage = (error: unknown): string | number => {
      const axiosError = error as AxiosError<{ message?: string; errors?: Array<{ message: string; field: string }> }>;

      switch (axiosError.response?.status) {
            case 400:
                  if (axiosError.response.data?.errors && axiosError.response.data.errors.length > 0) {
                        return axiosError.response.data.errors[0].message;
                  }
                  return axiosError.response.data?.message || "A validation error occurred.";
            case 403:
                  return axiosError.response?.status as number;
            case 404:
                  return axiosError.response?.status as number;
            default:
                  return axiosError.response?.data?.message || "An unexpected error occurred.";
      }
};
