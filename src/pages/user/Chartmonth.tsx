import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import { Box, Chip, Typography } from '@mui/material';
import useChartData from '../../hooks/user/Chartdata';

const chartsParams = {
    margin: { bottom: 55, left: 40, right: 10, top: 10 },
    height: 350,
};

export default function BasicColor() {
    const { chartData } = useChartData();

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: "12px",
                bgcolor: "transparent",
                boxShadow: "none",
                height: "100%",
            }}
        >

            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Claims</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                {/* 
                
                */}
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
                    data: chartData.map(item => item.claims),
                    area: true,
                    color: 'rgba(77, 208, 225, 0.8)',
                    curve: "natural",
                    showMark: true,
                    valueFormatter: (value) => `${value} claims`,
                }]}
                xAxis={[{
                    data: chartData.map(item => item.name),
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
