// export interface User{
//       _id: string;
//       email: string;
//       user_name: string;
//       role_code:string;
//       is_verified:boolean;
//       verification_token:string;
//       verification_token_expires:string;
//       token_version:number;
//       is_blocked:boolean;
//       created_at:string;
//       updated_at:string;
//       isDelete:boolean;
//       phone: string;
//       department: string;
//       salary: number;
//       role: 'admin' | 'user' | 'BA/PM' | 'finance';
//       blocked?: boolean;
//   }

export interface SearchCondition {
      keyword?: string;
      role_code?: string;
      is_blocked?: boolean;
      is_delete?: boolean;
      is_verified?: string | boolean;
}

export interface PageInfo {
      pageNum: number;
      pageSize: number;
}

export interface SearchRequest {
      searchCondition: SearchCondition;
      pageInfo: PageInfo;
}

export interface User {
      _id: string;
      email: string;
      user_name: string;
      role_code: string;
      is_verified: boolean;
      is_blocked: boolean;
      is_deleted: boolean;
      created_at: string;
      updated_at: string;
      token_version: number;
}

export interface PaginatedResponse {
      success: boolean;
      data: {
            pageData: User[];
            pageInfo: {
                  pageNum: number;
                  pageSize: number;
                  totalItems: number;
                  totalPages: number;
            };
      };
}
