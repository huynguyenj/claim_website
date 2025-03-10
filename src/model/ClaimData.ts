export interface Claim {
  _id: string;
  user_id: string;
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  remark: string;
  __v: number;

}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

export interface SearchCondition {
  keyword?: string;
  claim_status?: string;
  claim_start_date?: string;
  claim_end_date?: string;
  is_delete?: boolean;
}

export interface SearchClaimRequest {
  searchCondition: SearchCondition;
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

export interface ClaimResponse {
  success: boolean;
  data: {
    pageData: Claim[];
    pageInfo: PageInfo;
  };
}