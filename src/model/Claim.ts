export interface ClaimRequest {
    user_id: string;
    project_id: string;
    approval_id: string;
    claim_name: string;
    claim_status: string;
    claim_start_date: string;
    claim_end_date: string;
    total_work_time: number;
    is_deleted: boolean;
    _id: string;
    created_at: string;
    updated_at: string;
    remark: string;
    __v: number;
}

export interface ClaimResponseId {
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
  __v: number;
}

export interface NewClaimRequest {
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  remark: string;
  
}
