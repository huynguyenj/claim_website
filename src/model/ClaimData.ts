import { Employee } from "./EmployeeData";
import { ProjectInfoForApproval } from "./ProjectData";
import { ApprovalUserInfo } from "./UserData";

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
export interface ClaimRequest {
      id: string,
      title: string,
      description: string,
      status: string,
      createdAt: string,
      projectName: string,
      startDate: string,
      endDate: string,
      workTime: string,
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

export interface ClaimStatusChangeApproval{
    _id:string,
    claim_status:string,
    comment:string
}

export interface ClaimResponseApproval{
    _id: string;
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_role: string | null;
  employee_info: Employee;
  approval_info: ApprovalUserInfo;
  project_info: ProjectInfoForApproval;
  role_in_project: string;
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  claim_status: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

