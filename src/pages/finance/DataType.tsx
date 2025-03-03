import { Dayjs } from "dayjs";

interface FinanceSearchCondition {
  searchCondition?: {
    keyword?: string;
    claim_status?: string;
    claim_start_date?: Date | Dayjs;
    claim_end_date?: Date | Dayjs;
    is_delete?: boolean;
  };
  pageInfo?: {
    pageNum?: number;
    pageSize?: number;
  };
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface EmployeeInfo {
  _id: string;
  user_id: string;
  job_rank: string;
  contract_type: string;
  account: string;
  address: string;
  phone: string;
  full_name: string;
  avatar_url: string;
  department_name: string;
  salary: number;
  start_date: string;
  end_date: string | null;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

interface ApprovalInfo {
  _id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  is_blocked: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectMember {
  user_id: string;
  project_role: string;
  _id: string;
}

interface ProjectInfo {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_members: ProjectMember[];
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  updated_by: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface FinanceClaim {
  _id: string;
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_role: string | null;
  employee_info: EmployeeInfo;
  approval_info: ApprovalInfo;
  project_info: ProjectInfo;
  role_in_project: string | null;
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  claim_status: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface FinanceClaimResponse {
  pageData: FinanceClaim[];
  pageInfo: PageInfo;
}

interface ChangeStatusClaim {
  claim_id: string;
  claim_status: string;
  comment: string;
}

export type {
  FinanceClaim,
  FinanceSearchCondition,
  FinanceClaimResponse,
  EmployeeInfo,
  ApprovalInfo,
  ProjectInfo,
  ProjectMember,
  ChangeStatusClaim,
};
