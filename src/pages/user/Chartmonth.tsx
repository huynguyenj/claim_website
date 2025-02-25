import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import { Box, Chip, Typography } from '@mui/material';

const monthlyData = [
    { month: 'Jan', claims: 45 },
    { month: 'Feb', claims: 38 },
    { month: 'Mar', claims: 52 },
    { month: 'Apr', claims: 31 },
    { month: 'May', claims: 47 },
    { month: 'Jun', claims: 10 },
    { month: 'Jul', claims: 42 },
    { month: 'Aug', claims: 56 },
    { month: 'Sep', claims: 39 },
    { month: 'Oct', claims: 44 },
    { month: 'Nov', claims: 37 },
    { month: 'Dec', claims: 5 }
];

const chartsParams = {
    margin: { bottom: 50, left: 40, right: 10, top: 10 },
    height: 350,
};

export default function BasicColor() {
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
            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Claims</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    446
                </Typography>
                <Chip
                    label="24.5% ↑"
                    size="small"
                    sx={{ bgcolor: "rgba(76, 175, 80, 0.2)", color: "green" }}
                />
            </Stack>
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <linearGradient id="gradientFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4DD0E1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4DD0E1" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <LineChart
                {...chartsParams}
                series={[{
                    data: monthlyData.map(item => item.claims),
                    area: true,
                    color: 'rgba(77, 208, 225, 0.8)',
                    curve: "natural",
                    showMark: true,
                    valueFormatter: (value) => `${value} claims`,
                }]}
                xAxis={[{
                    data: monthlyData.map(item => item.month),
                    scaleType: "point",
                    tickLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                        fill: '#666'
                    }
                }]}
            />
        </Box>
    );
}
