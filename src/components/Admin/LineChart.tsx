import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useChartData from "../../hooks/admin/useChartData";

export default function LineChartComponent() {
  const { chartData } = useChartData();
  return (
    <ResponsiveContainer width="100%" height="80%">
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="linear"
          dataKey="users"
          stroke="cyan"
          activeDot={{ r: 8 }}
        />
        <Line type="linear" dataKey="claims" stroke="red" />
        <Line type="linear" dataKey="projects" stroke="blue" />
        <Line type="linear" dataKey="contracts" stroke="green" />
      </LineChart>
    </ResponsiveContainer>
  );
}
