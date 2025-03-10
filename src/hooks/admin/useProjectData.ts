import { useEffect, useState } from "react";
import { Project, ProjectResponse} from "../../model/ProjectData";
import { ProjectSearchCondition } from "../../model/SearchType";
import apiService from "../../services/ApiService";
import { Notification } from "../../components/common/Notification";


export default function useDashboardData() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsThisMonth, setProjectsThisMonth] = useState<Project[]>([]);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [totalProjectsThisMonth, setTotalProjectsThisMonth] = useState<number>(0);
    const [projectLoading, setProjectLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10000);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchProjects = async () => {
        setProjectLoading(true);
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
            setProjectLoading(false);
        }
    };

    const fetchProjectsThisMonth = async () => {
        try {
            setProjectLoading(true);

            const searchParams: ProjectSearchCondition = {
                searchCondition: { keyword: "", project_start_date: "", project_end_date: "", is_delete: false, user_id: "" },
                pageInfo: { pageNum: currentPage, pageSize },
            };

            const response = await apiService.post<ProjectResponse>("/projects/search", searchParams);

            if (response) {
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const endOfMonth = new Date();
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                endOfMonth.setDate(0);
                endOfMonth.setHours(23, 59, 59, 999);

                const filteredProjects = response.data.pageData.filter(user => {
                    const createdAt = new Date(user.created_at);
                    return createdAt >= startOfMonth && createdAt <= endOfMonth;
                });

                setProjectsThisMonth(filteredProjects);
                setTotalProjectsThisMonth(filteredProjects.length);
            }
        } catch (error) {
            console.error("Error fetching projects this month", error);
            Notification("error", "Failed to fetch projects this month");
        } finally {
            setProjectLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
        fetchProjectsThisMonth();
    }, [currentPage, searchTerm]);

    return {
        projects, totalProjects,
        projectsThisMonth, totalProjectsThisMonth,
        projectLoading, currentPage, setCurrentPage, setSearchTerm
    };
};
