import { useState, useEffect } from 'react';
import { PageInfo, SearchCondition } from '../../model/ClaimData';

export interface Approval {
    _id: string;
    staff_id: string;
    staff_name: string;
    staff_email: string;
    staff_role: string | null;
    role_in_project: string | null;
    claim_name: string;
    claim_start_date: string;
    claim_end_date: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}
export interface SearchApprovalRequest {
    searchCondition: SearchCondition;
    pageInfo: {
        pageNum: number;
        pageSize: number;
    };
}
export interface ApprovalResponse {
    success: boolean;
    data: {
        pageData: Approval[];
        pageInfo: PageInfo;
    };
}

export const useApprovalSearch = (data: any) => {
    const [approvals, setApprovals] = useState<Approval[]>([]);

    useEffect(() => {
        if (data && data.success) {
            setApprovals(data.data.pageData);
        }
    }, [data]);

    return approvals;
};
