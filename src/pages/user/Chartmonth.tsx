import { ChangeEvent, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Stack from "@mui/material/Stack";
import { Box, Chip, Typography, Select, MenuItem, TextField, SelectChangeEvent } from "@mui/material";
import useChartData from "../../hooks/user/Chartdata";

const chartsParams = {
    margin: { bottom: 40, left: 40, right: 10, top: 20 },
    height: 350,
    grid: { horizontal: true, stroke: "#E0E0E0", strokeDasharray: "4 4" }
};

export default function BasicColor() {
    const { chartData, setStartDate, setEndDate } = useChartData();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");

    const handleYearChange = (event: SelectChangeEvent<string>) => {
        const year = Number(event.target.value);
        setSelectedYear(year);
        setStartDate(`${year}-01-01`);
        setEndDate(`${year}-12-31`);
    };

    const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedStartDate(event.target.value);
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedEndDate(event.target.value);
        setEndDate(event.target.value);
    };

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
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Chip
                    label="24.5% ↑"
                    size="small"
                    sx={{ bgcolor: "rgba(76, 175, 80, 0.2)", color: "green" }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select value={selectedYear.toString()} onChange={handleYearChange} size="small">
                        {[...Array(5)].map((_, index) => {
                            const year = (new Date().getFullYear() - index).toString();
                            return <MenuItem key={year} value={year}>{year}</MenuItem>;
                        })}
                    </Select>
                    <TextField
                        type="date"
                        label="Start Date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                    />
                    <TextField
                        type="date"
                        label="End Date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={selectedEndDate}
                        onChange={handleEndDateChange}
                    />
                </div>
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