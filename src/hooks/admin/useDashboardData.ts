import { useEffect, useState } from "react";
import apiService from "../../services/ApiService";
import { PaginatedResponse, User } from "../../model/UserData";
import { Claim, ClaimResponse, } from "../../model/ClaimData";
import { Project, ProjectResponse, } from "../../model/ProjectData";
import { ClaimSearchCondition, ProjectSearchCondition, UserSearchCondition } from "../../model/SearchType";

export default function useDashboardData() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10000);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showBanned] = useState<boolean | null>(null);
  
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const searchParams: UserSearchCondition = {
        searchCondition: { keyword: searchTerm, role_code: "", is_delete: false, is_verified: "" },
        pageInfo: { pageNum: currentPage, pageSize },
      };

      const response = await apiService.post<PaginatedResponse>("/users/search", searchParams);
      if (response) {
        setUsers(response.data.pageData);
        setTotalUsers(response.data.pageInfo.totalItems);
      }
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const searchParams: ClaimSearchCondition = {
        searchCondition: { keyword: searchTerm, claim_status: "", claim_start_date: "", claim_end_date: "", is_delete: false },
        pageInfo: { pageNum: currentPage, pageSize },
      };

      const response = await apiService.post<ClaimResponse>("/claims/search", searchParams);
      if (response) {
        setClaims(response.data.pageData);
        setTotalClaims(response.data.pageInfo.totalItems || 0);
      }
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const searchParams: ProjectSearchCondition = {
        searchCondition: { keyword: "", project_start_date: "", project_end_date: "", is_delete: false, user_id: "" },
        pageInfo: { pageNum: currentPage, pageSize },
      };
  
      const response = await apiService.post<ProjectResponse>("/projects/search", searchParams);
      if (response) {
        setProjects(response.data.pageData);
        setTotalProjects(response.data.pageInfo.totalItems || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
 
  useEffect(() => {
    fetchUsers();
    fetchClaims();
    fetchProjects();
  }, [currentPage, pageSize, searchTerm, showBanned]);

  return {  
          users, totalUsers, 
          claims, totalClaims, 
          projects, totalProjects,
          loading, currentPage, setCurrentPage, setSearchTerm, 
          };
}
