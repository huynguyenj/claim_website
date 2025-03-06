import { useEffect, useState } from "react";
import { PaginatedResponse, SearchRequest, User } from "../../model/UserData";
import apiService from "../../services/ApiService";
import { Notification } from "../../components/common/Notification";

export default function useUserData() {
    const [users, setUsers] = useState<User[]>([]);
    const [usersThisMonth, setUsersThisMonth] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [userLoading, setUserLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10000);
    const [showBanned] = useState<boolean | null>(null);

    const fetchUsers = async () => {
        try {
            setUserLoading(true);
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
            setUserLoading(false);
        }
    };

    const fetchUsersThisMonth = async () => {
        try {
            setUserLoading(true);

            const searchParams: SearchRequest = {
                searchCondition: { keyword: searchTerm, role_code: "", is_delete: false, is_verified: "" },
                pageInfo: { pageNum: currentPage, pageSize },
            };

            if (showBanned !== null) searchParams.searchCondition.is_blocked = showBanned;

            console.log("Fetching all users:", searchParams);

            const response = await apiService.post<PaginatedResponse>("/users/search", searchParams);

            if (response) {
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const endOfMonth = new Date();
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                endOfMonth.setDate(0);
                endOfMonth.setHours(23, 59, 59, 999);

                const filteredUsers = response.data.pageData.filter(user => {
                    const createdAt = new Date(user.created_at);
                    return createdAt >= startOfMonth && createdAt <= endOfMonth;
                });

                setUsers(filteredUsers);
                setTotalUsers(filteredUsers.length);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            Notification("error", "Failed to fetch users for this month");
        } finally {
            setUserLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchUsersThisMonth();
    }, [currentPage, searchTerm, showBanned]);

    return {
        users, totalUsers,
        usersThisMonth, setUsersThisMonth,
        userLoading, currentPage, setCurrentPage, setSearchTerm,
    };
}