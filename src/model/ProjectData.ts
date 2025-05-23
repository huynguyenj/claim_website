export interface ProjectMember {
  project_role: string;
  user_id: string;
  employee_id: string;
  user_name: string;
  full_name: string;
}

export interface Project {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  updated_by: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  project_comment: string;
  project_members: ProjectMember[];
}

export interface ProjectRole {
  name: string;
  value: string;
}

export interface SearchCondition {
  keyword?: string;
  project_start_date?: string;
  project_end_date?: string;
  is_delete?: boolean;
  user_id?: string;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface SearchRequest {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}

export interface PaginatedResponse {
  success: boolean;
  data: {
    pageData: Project[];
    pageInfo: {
      pageNum: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}
export interface ProjectResponse {
  pageData: Project[];
    data: {
      pageData: Project[];
      pageInfo: {
        totalItems: number;
      };
    }
  
}

interface ProjectMember2 {
  user_id: string;
  project_role: string;
  _id: string;
}

export interface ProjectInfoForApproval {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_members: ProjectMember2[];
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  updated_by: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}