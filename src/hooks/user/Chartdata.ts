import useDashboardData from "./Userdata";

export default function useChartData() {
    const { claims } = useDashboardData();
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const claimCountPerMonth = Array(12).fill(0);
    claims.forEach((claim) => {
        if (claim.created_at) {
            const monthIndex = new Date(claim.created_at).getMonth();
            claimCountPerMonth[monthIndex]++;
        }
    });
    const chartData = months.map((month, index) => ({
        name: month,
        claims: claimCountPerMonth[index],
    }));
    const statusCounts = {
        Draft: claims.filter((c) => c.claim_status === "Draft").length,
        Approved: claims.filter((c) => c.claim_status === "Approved").length,
        Canceled: claims.filter((c) => c.claim_status === "Canceled").length,
        PendingApproval: claims.filter((c) => c.claim_status === "Pending Approval").length,
    };
    return { chartData, statusCounts };
}