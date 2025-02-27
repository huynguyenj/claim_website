import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import { Box, Chip, Typography } from '@mui/material';

const statusData = {
    categories: ['Pending', 'Approved', 'Rejected'],
    values: [42, 6, 28]
};

export default function FunctionLabel() {
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
            <Typography variant="h6" sx={{ mb: 2 }}>Claims Status</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    150
                </Typography>
                <Chip
                    label="24.5% ↑"
                    size="small"
                    sx={{ bgcolor: "rgba(76, 175, 80, 0.2)", color: "green" }}
                />
            </Stack>
            <LineChart
                height={300}
                series={[{
                    data: statusData.values,
                    color: '#4DD0E1',
                    label: 'Total Claims',
                    curve: 'linear',
                }]}
                xAxis={[{
                    data: statusData.categories,
                    scaleType: 'band',
                    tickLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                        fill: '#666'
                    }
                }]}
                margin={{ left: 40, right: 20, top: 30, bottom: 10 }}
            />
        </Box>
    );
}
