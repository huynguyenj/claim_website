export interface Project {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    budget: number;
    assignedUsers?: string[];
}