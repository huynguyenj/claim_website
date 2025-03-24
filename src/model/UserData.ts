
export interface UserInfo {
      _id: string;
      email: string;
      user_name: string;
      role_code: string;
      is_verified: boolean;
      verification_token: string;
      verification_token_expires: string;
      token_version: number;
      is_blocked: boolean;
      created_at: string;
      updated_at: string;
      isDelete: boolean;
      __v: number
}

export type RegisterForm = {
      firstName: string,
      lastName: string,
      userName: string,
      password: string,
      email: string,
      gender: boolean,
      address: string,
      phone: string,
      birth: Date
}
export type UserForm = {
      email: string,
      password: string
}
export type Token = {
      token: string
}
export type ApiResponseWithDataNull = {
      success: boolean,
      data: null
}
export interface SearchCondition {
      keyword?: string;
      role_code?: string;
      is_blocked?: boolean;
      is_deleted?: boolean;
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
export interface ApprovalUserInfo {
      _id: string;
      email: string;
      user_name: string;
      role_code: string;
      is_verified: boolean;
      is_blocked: boolean;
      is_deleted: boolean;
      created_at: string;
      updated_at: string;
      __v: number;
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
