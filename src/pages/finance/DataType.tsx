import { Dayjs } from "dayjs";

interface FinanceSearchCondition {
  searchCondition?: {
    keyword?: string;
    claim_status?: string;
    claim_start_date?: Date|Dayjs;
    claim_end_date?: Date|Dayjs;
    is_delete?: boolean;
  };
  pageInfo?: {
    pageNum?: number;
    pageSize?: number;
  };
}

interface FinanceClaim {
  _id: string;
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_role: null;
  role_in_project: string;
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export type { FinanceClaim,FinanceSearchCondition };
