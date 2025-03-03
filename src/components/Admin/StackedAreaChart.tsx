import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useChartData from "../../hooks/admin/useChartData";

export default function StackedAreaChart() {
  const { chartData } = useChartData();

  return (
    <ResponsiveContainer width={"100%"} height={"70%"}>
      <AreaChart
        width={600}
        height={300}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="users"
          stackId="1"
          stroke="oklab(0.69 -0.09 -0.14 / 1)"
          fill="oklab(0.69 -0.09 -0.14 / 1)"
        />
        <Area
          type="monotone"
          dataKey="claims"
          stackId="2"
          stroke="red"
          fill="red"
        />
        <Area
          type="monotone"
          dataKey="projects"
          stackId="3"
          stroke="blue"
          fill="blue"
        />
        <Area
          type="monotone"
          dataKey="contracts"
          stackId="4"
          stroke="green"
          fill="green"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
