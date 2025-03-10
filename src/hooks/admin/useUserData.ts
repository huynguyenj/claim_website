import { useEffect, useState } from "react";
import { PaginatedResponse, SearchRequest, User } from "../../model/UserData";
import apiService from "../../services/ApiService";
import { Notification } from "../../components/common/Notification";

export default function useUserData() {
    const [users, setUsers] = useState<User[]>([]);
    const [usersThisMonth, setUsersThisMonth] = useState<User[]>([]);
    const [usersVerified, setUsersVerified] = useState<User[]>([]);
    const [totalUsersVerified, setTotalUsersVerified] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalUsersThisMonth, setTotalUsersThisMonth] = useState<number>(0);
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

            console.log("Fetching all users this month:", searchParams);

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

                setUsersThisMonth(filteredUsers);
                setTotalUsersThisMonth(filteredUsers.length);
            }
        } catch (error) {
            console.error("Error fetching users this month:", error);
            Notification("error", "Failed to fetch users for this month");
        } finally {
            setUserLoading(false);
        }
    };

    const fetchUsersVerified = async () => {
        try {
            setUserLoading(true);
            const searchParams: SearchRequest = {
                searchCondition: { keyword: searchTerm, role_code: "", is_delete: false, is_verified: true },
                pageInfo: { pageNum: currentPage, pageSize },
            };

            if (showBanned !== null) searchParams.searchCondition.is_blocked = showBanned;

            const response = await apiService.post<PaginatedResponse>("/users/search", searchParams);

            if (response) {
                setUsersVerified(response.data.pageData);
                setTotalUsersVerified(response.data.pageInfo.totalItems);
            }
        } catch (error) {
            Notification("error", error as string);
        } finally {
            setUserLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
        fetchUsersThisMonth();
        fetchUsersVerified();
    }, [currentPage, searchTerm, showBanned]);

    return {
        users, totalUsers,
        usersThisMonth, totalUsersThisMonth,
        usersVerified, totalUsersVerified,
        userLoading, currentPage, setCurrentPage, setSearchTerm,
    };
};