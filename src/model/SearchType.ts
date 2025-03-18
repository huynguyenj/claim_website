interface PageInfo {
      pageNum?: number;
      pageSize?: number
}
interface PageInfoExtends extends PageInfo{
      totalItems:number,
      totalPages:number
}
export interface PageReturn<T> {
      pageData: T[],
      pageInfo: PageInfoExtends
}

//Claim
export interface ClaimCondition {
      keyword?: string;
      claim_status?: string;
      claim_start_date?: string;
      claim_end_date?: string;
      is_delete?: boolean;
}

//Claim logs
export interface ClaimLogCondition {
      claim_id?: string;
      is_delete?: boolean;
}
export interface ClaimLogCondition {
      searchCondition?: ClaimLogCondition;
      pageInfo?: PageInfo
}
export interface ClaimSearchCondition {
      searchCondition?: ClaimCondition;
      pageInfo?: PageInfo
}
//Project
export interface ProjectCondition {
      keyword?: string;
      project_start_date?: string;
      project_end_date?: string;
      is_delete?: boolean;
      user_id?: string;
}
export interface ProjectSearchCondition {
      searchCondition?: ProjectCondition;
      pageInfo?: PageInfo
}

//User
export interface UserCondition {
      keyword?: string;
      role_code?: string;
      is_blocked?: boolean;
      is_delete: boolean;
      is_verified?: string;
}
export interface UserSearchCondition {
      searchCondition?: UserCondition;
      pageInfo?: PageInfo
}