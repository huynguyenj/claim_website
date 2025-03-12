import { useEffect, useState, useCallback, useMemo } from "react";
import { ProjectSearchCondition } from "../../model/SearchType";
import apiService from "../../services/ApiService";
import { Project, ProjectResponse } from "../../model/ProjectData";

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [projectLoading, setProjectLoading] = useState<boolean>(false);

  const pageSize = 10000;
  const pageNum = 1;

  const searchParams: ProjectSearchCondition = useMemo(() => ({
    searchCondition: { keyword: "", project_start_date: "", project_end_date: "", is_delete: false, user_id: "" },
    pageInfo: { pageNum, pageSize },
  }), [pageNum, pageSize]);

  // Fetch projects function
  const fetchProjects = useCallback(async () => {
    setProjectLoading(true);
    try {
      const response = await apiService.post<ProjectResponse>("/projects/search", searchParams);
      if (response?.data) {
        setProjects(response.data.pageData);
        setTotalProjects(response.data.pageInfo.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
        setProjectLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, totalProjects, projectLoading };
}
