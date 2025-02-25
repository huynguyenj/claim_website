import { Box, Typography, Stack, Chip } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const data = [
    { time: "Expense Reimbursement", value: 30 },
    { time: "Leave Approval", value: 20 },
    { time: "Overtime Request", value: 25 },
    { time: "Travel Allowance", value: 10 },
    { time: "Project Budget Approval", value: 28 },
    { time: "Contract Review", value: 35 },
    { time: "Salary Adjustment", value: 40 },
    { time: "Equipment Purchase", value: 45 },
];

export default function ProfitCard() {
    return (
        <Box
            sx={{
                p: 3,
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                bgcolor: "white",
                height: "100%",
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>Claim Categories</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    233
                </Typography>
                <Chip
                    label="24.5% ↓"
                    size="small"
                    sx={{ bgcolor: "rgba(211, 124, 10, 0.2)", color: "red" }}
                />
            </Stack>
            <BarChart
                dataset={data}
                xAxis={[{
                    scaleType: "band",
                    dataKey: "time",
                    tickLabelStyle: {
                        fontSize: 12,
                        textAnchor: 'end'
                    }
                }]}
                series={[{
                    dataKey: "value",
                    color: "rgba(77, 208, 225, 0.8)",
                }]}
                height={370}
                margin={{ left: 40, right: 20, top: 10, bottom: 75 }}
                slotProps={{ legend: { hidden: true } }}
            />
        </Box>
    );
}
