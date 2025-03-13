import { useEffect, useState, useCallback, useMemo } from "react";
import { PaginatedResponse, User } from "../../model/UserData";
import { UserSearchCondition } from "../../model/SearchType";
import apiService from "../../services/ApiService";

export default function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userLoading, setUserLoading] = useState<boolean>(false);

  const pageSize = 10000;
  const pageNum = 1;

  const searchParams: UserSearchCondition = useMemo(() => ({
    searchCondition: { keyword: "", role_code: "", is_blocked: false, is_delete: false, is_verified: "" },
    pageInfo: { pageNum, pageSize },
  }), [pageNum, pageSize]);

  // Fetch users function
  const fetchUsers = useCallback(async () => {
    setUserLoading(true);
    try {
      const response = await apiService.post<PaginatedResponse>("/users/search", searchParams);
      if (response?.data) {
        setUsers(response.data.pageData);
        setTotalUsers(response.data.pageInfo.totalItems);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
        setUserLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, totalUsers, userLoading };
}
