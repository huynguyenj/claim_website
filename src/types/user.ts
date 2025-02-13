export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    salary: number;
    role: 'admin' | 'user' | 'BA/PM' | 'finance';
    blocked?: boolean;
}