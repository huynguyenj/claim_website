import { useMemo, useState } from "react";
import useDashboardData from "./Userdata";
import dayjs from "dayjs";

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
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const filteredClaims = useMemo(() => {
        return claims.filter((claim) => {
            const claimDate = dayjs(claim.created_at);
            if (startDate && claimDate.isBefore(dayjs(startDate), "day")) return false;
            if (endDate && claimDate.isAfter(dayjs(endDate), "day")) return false;
            return true;
        });
    }, [claims, startDate, endDate]);

    const claimCountPerMonth = Array(12).fill(0);

    filteredClaims.forEach((claim) => {
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
        Draft: filteredClaims.filter((c) => c.claim_status === "Draft").length,
        Approved: filteredClaims.filter((c) => c.claim_status === "Approved").length,
        Canceled: filteredClaims.filter((c) => c.claim_status === "Canceled").length,
        PendingApproval: filteredClaims.filter((c) => c.claim_status === "Pending Approval").length,
    };

    return { chartData, statusCounts, setStartDate, setEndDate, filteredClaims };
}