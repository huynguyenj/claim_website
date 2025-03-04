import { useEffect, useState } from "react";
import apiService from "../../services/ApiService";
import { Notification } from "../../components/common/Notification";
import { PaginatedResponse, SearchRequest, User } from "../../model/UserData";
import { Claim, ClaimResponse, SearchClaimRequest } from "../../model/ClaimData";
import { Project, ProjectResponse, SearchProjectRequest } from "../../model/ProjectData";
import { Contract, ContractResponse } from "../../model/ContractData";

export default function useDashboardData() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [totalContracts, setTotalContracts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10000);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showBanned] = useState<boolean | null>(null);
  
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const searchParams: SearchRequest = {
        searchCondition: { keyword: searchTerm, role_code: "", is_delete: false, is_verified: "" },
        pageInfo: { pageNum: currentPage, pageSize },
      };

      if (showBanned !== null) searchParams.searchCondition.is_blocked = showBanned;

      const response = await apiService.post<PaginatedResponse>("/users/search", searchParams);
      if (response) {
        setUsers(response.data.pageData);
        setTotalUsers(response.data.pageInfo.totalItems);
      }
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const searchParams: SearchClaimRequest = {
        searchCondition: { keyword: searchTerm, claim_status: "", claim_start_date: "", claim_end_date: "", is_delete: false },
        pageInfo: { pageNum: currentPage, pageSize },
      };

      const response = await apiService.post<ClaimResponse>("/claims/search", searchParams);
      if (response) {
        setClaims(response.data.pageData);
        setTotalClaims(response.data.pageInfo.totalItems || 0);
      }
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const searchParams: SearchProjectRequest = {
        searchCondition: { keyword: "", project_start_date: "", project_end_date: "", is_delete: false, user_id: "" },
        pageInfo: { pageNum: currentPage, pageSize },
      };
  
      const response = await apiService.post<ProjectResponse>("/projects/search", searchParams);
      if (response) {
        setProjects(response.data.pageData);
        setTotalProjects(response.data.pageInfo.totalItems || 0);
      }
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<ContractResponse>("/contracts/get-all");
      if(response) {
        setContracts(response.data);
        setTotalContracts(response.data.length || 0);
      } 
    } catch (error) {
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUsers();
    fetchClaims();
    fetchProjects();
    fetchContracts();
  }, [currentPage, pageSize, searchTerm, showBanned]);

  return {  
          users, totalUsers, 
          claims, totalClaims, 
          projects, totalProjects,
          contracts, totalContracts, 
          loading, currentPage, setCurrentPage, setSearchTerm, 
          };
}
