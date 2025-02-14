import dayjs, { Dayjs } from "dayjs";
 interface Claim {
    id: string;
    user_id: string;
    title: string;
    description: string;
    time: 'Morning' | 'Noon' | 'Afternoon' | 'Night';
    status: 'Draft' | 'Pending_Approval' | 'Approved' | 'Rejected' | 'Pending_Payment' | 'Paid'
    createdAt: Dayjs;
}
 interface User  {
    id: string,
    name:string,
    email:string,
    phone: string,
    department: string,
    salary: number,
    role:string
    createdAt: Dayjs;
}
interface Funds {
    amount: number,
    receivedAt: Dayjs;
}
const dataset: { users: User[], claims:Claim[], funds:Funds[]} = {
    users: [
        {
            id: "1",
            name: "Nguyen Trong Quy",
            email: "quyntce180596@fpt.edu.vn",
            phone: "0328718050",
            department: "FPT",
            salary: 0,
            role: "admin",
            createdAt: dayjs("2025-01-11"),
        },
        {
            id: "2",
            name: "Johnny Nguyen",
            email: "johnnynguyen@gmail.com",
            phone: "0728318050",
            department: "America",
            salary: 0,
            role: "staff",
            createdAt: dayjs("2025-01-12"),
        },
        {
            id: "3",
            name: "April Nguyen",
            email: "aprilnguyen@gmail.com",
            phone: "0111118050",
            department: "Bmerica",
            salary: 0,
            role: "staff",
            createdAt: dayjs("2025-01-20"),
        }
    ],
    claims: [
        {
            id:"1",
            user_id: "1",
            title: "Work extra morning",
            description: "Hi, I would like to work extra tomorow morning",
            time: "Morning",
            status: "Pending_Approval",
            createdAt: dayjs("2025-01-13"),
        }
    ],
    funds: [
        {
            amount: 300,
            receivedAt: dayjs("2025-01-7")
        },
        {
            amount: 400,
            receivedAt: dayjs("2025-01-8")
        },
        {
            amount: 500,
            receivedAt: dayjs("2025-01-9")
        },
    ]

};
export function totalFunds() {
    return dataset.funds.reduce((total, fund) => total + fund.amount, 0);
}
export default dataset;
