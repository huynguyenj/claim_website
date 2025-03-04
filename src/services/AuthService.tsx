import { ApiResponse } from "../consts/ApiResponse";
import { UserInfo } from "../model/UserData";
import { ClaimRequest, NewClaimRequest } from "../model/Claim";
import apiService from "./ApiService";


const authService = {
      getInfo: () => apiService.get<ApiResponse<UserInfo>>('/auth').then((res) => res),
      
      createClaim: (claimRequest: NewClaimRequest) => 
        apiService.post<ApiResponse<NewClaimRequest>>('claims', claimRequest)
          .then((res) => res.data),

      getRequests: () => 
        apiService.get<ApiResponse<ClaimRequest[]>>('claims')
          .then((res) => res.data),

      updateClaim: (claimRequest: ClaimRequest) => 
        apiService.put<ApiResponse<ClaimRequest>>(`claims/${claimRequest._id}`, claimRequest)
          .then((res) => res.data),

      deleteClaim: (id: string) => 
        apiService.delete<ApiResponse<void>>(`claims/${id}`)
          .then((res) => res.data),
}

export default authService