export interface Claim {
    _id: string;
    claim_status: string;
    claim_start_date: string;
    claim_end_date: string;
    is_delete: boolean;
    created_at: string;
    updated_at: string;
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