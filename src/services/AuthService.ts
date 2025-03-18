import { ApiResponse } from "../consts/ApiResponse";
import { ApiResponseWithDataNull, UserInfo } from "../model/UserData";
import { ClaimRequest, NewClaimRequest } from "../model/Claim";
import apiService from "./ApiService";
import { ClaimSearchCondition, PageReturn, ProjectCondition } from "../model/SearchType";
import { ClaimResponseApproval, ClaimStatusChangeApproval } from "../model/ClaimData";

const authService = {
  getInfo: () =>
    apiService.get<ApiResponse<UserInfo>>("/auth").then((res) => res),

  createClaim: (claimRequest: NewClaimRequest) =>
    apiService
      .post<ApiResponse<ClaimRequest>>("claims", claimRequest)
      .then((res) => res),

  updateClaim: (claimId: string, data: Partial<ClaimRequest>) =>
    apiService.put<ClaimRequest>(`/claims/${claimId}`, data).then((res) => res),

  getAllClaims: () =>
    apiService
      .post<ApiResponse<{ pageData: any[] }>>(`claims/search`, {
        searchCondition: {},
        pageInfo: { pageNum: 1, pageSize: 100 },
      })
      .then((res) => res.data),

  searchProjectByUserId: (searchProject: {
    searchCondition: { user_id: string; is_delete: boolean };
    pageInfo: { pageNum: number; pageSize: number };
  }) =>
    apiService
      .post<ApiResponse<ProjectCondition[]>>(`projects/search`, searchProject)
      .then((res) => res),

  updateClaimStatusForApproval: (claimStatus: ClaimStatusChangeApproval) =>
    apiService
      .put<ApiResponse<ApiResponseWithDataNull>>(
        `claims/change-status`,
        claimStatus
      )
      .then((res) => res),

  getClaimApproval: (searchTerm: ClaimSearchCondition) =>
    apiService
      .post<ApiResponse<PageReturn<ClaimResponseApproval>>>("claims/approval-search", searchTerm)
      .then((res) => res),

  searchApprovals: () =>
    apiService
      .post<ApiResponse<{ pageData: any[] }>>('/users/search', {
        searchCondition: {
          role_code: 'A003',
          is_deleted: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 50,
        },
      })
      .then((res) => res.data),
};

export default authService;
