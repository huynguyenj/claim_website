import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useChartData from "../../hooks/admin/useChartData";

export default function StackedBarChart() {
  const { chartData } = useChartData();

  return (
    <ResponsiveContainer width={"100%"} height={"80%"}>
      <BarChart
        width={600}
        height={300}
        data={chartData}
        margin={{
          top: 20,
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
        <Bar
          dataKey="users"
          stackId="a"
          stroke="oklab(0.69 -0.09 -0.14 / 1)"
          fill="oklab(0.69 -0.09 -0.14 / 0.6)"
        />
        <Bar dataKey="claims" stackId="a" stroke="red" fill="red" />
        <Bar dataKey="projects" stackId="a" stroke="blue" fill="blue" />
        <Bar dataKey="contracts" stackId="a" stroke="green" fill="green" />
      </BarChart>
    </ResponsiveContainer>
  );
}
