import { ApiResponse } from "../consts/ApiResponse";
import { UserInfo } from "../model/UserData";
import { ClaimRequest, NewClaimRequest } from "../model/Claim";
import apiService from "./ApiService";
import { ProjectCondition } from "../model/SearchType";

const authService = {
  getInfo: () => apiService.get<ApiResponse<UserInfo>>('/auth').then((res) => res),

  createClaim: (claimRequest: NewClaimRequest) =>
    apiService.post<ApiResponse<ClaimRequest>>('claims', claimRequest)
      .then((res) => res),

  updateClaim: (claimId: string, data: Partial<ClaimRequest>) =>
    apiService
      .put<ClaimRequest>(`/claims/${claimId}`, data)
      .then((res) => res),


  getAllClaims: () =>
    apiService.post<ApiResponse<{ pageData: any[] }>>(`claims/search`, {
      // Không truyền searchCondition cụ thể để lấy toàn bộ claim
      searchCondition: {},
      pageInfo: { pageNum: 1, pageSize: 100 },
    }).then((res) => res.data),

  searchProjectByUserId: (searchProject: { searchCondition: { user_id: string; is_delete: boolean }; pageInfo: { pageNum: number; pageSize: number } }) =>
    apiService.post<ApiResponse<ProjectCondition[]>>(`projects/search`, searchProject)
      .then((res) => res),

}

export default authService