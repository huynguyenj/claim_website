import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { Box, Chip, Typography, Stack } from "@mui/material";
import useChartData from "../../hooks/user/Chartdata";

const COLORS = ["#8884d8", "#00C49F", "#FF8042", "#0088FE"];
type Variable = {
    cx:number,
    cy:number,
    midAngle:number,
    innerRadius:number,
    outerRadius:number,
    percentage:number

}
const ChartOverview: React.FC = () => {
    const { statusCounts } = useChartData();

    const total = Object.values(statusCounts).reduce((acc, curr) => acc + curr, 0);

    const data = [
        { name: "Draft", value: statusCounts.Draft },
        { name: "Approved", value: statusCounts.Approved },
        { name: "Canceled", value: statusCounts.Canceled },
        { name: "Pending Approval", value: statusCounts.PendingApproval },
    ].map(item => ({
        ...item,
        percentage: ((item.value / total) * 100).toFixed(1)
    }));

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percentage
    }: Variable) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: '12px', fontWeight: 'bold' }}
            >
                {`${percentage}%`}
            </text>
        );
    };
    return (
        <Box
            sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "12px",
                height: "100%",
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }}>Claim Status Overview</Typography>

            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>

                <Chip
                    label="24.5% ↑"
                    size="small"
                    sx={{ bgcolor: "rgba(76, 175, 80, 0.2)", color: "green" }}
                    style={{ marginRight: "150px", marginTop: "10px" }}
                />
            </Stack>

            <PieChart width={400} height={350}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="55%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${props.payload.percentage}% (${value})`, name]} />
                <Legend verticalAlign="bottom" align="center" height={50} />
            </PieChart>
        </Box>
    );
};

export default ChartOverview;
