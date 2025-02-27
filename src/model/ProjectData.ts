export interface Project {
    project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
    project_members: [
        user_id: string,
        project_role: string,
    ]
}
