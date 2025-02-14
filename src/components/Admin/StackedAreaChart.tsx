import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dataset from "../../data/AdminDashboard";
const data = [
  {
    name: "Jan 1",
    users: 1000,
    claims: 2400,
    funds: 2400,
  },
  {
    name: "Jan 5",
    users: 3000,
    claims: 1398,
    funds: 2210,
  },
  {
    name: "Jan 10",
    users: 2000,
    claims: 9800,
    funds: 2290,
  },
  {
    name: "Jan 15",
    users: 2780,
    claims: 3908,
    funds: 2000,
  },
  {
    name: "Jan 20",
    users: 1890,
    claims: 4800,
    funds: 2181,
  },
  {
    name: "Jan 25",
    users: 2390,
    claims: 3800,
    funds: 2500,
  },
  {
    name: "Jan 30",
    users: 3490,
    claims: 4300,
    funds: 2100,
  },
];
export default function StackedAreaChart() {
  return (
    <ResponsiveContainer width={"100%"} height={"70%"}>
      <AreaChart
        width={600}
        height={300}
        data={data}
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
          stackId="1"
          stroke="oklab(0.69 -0.09 -0.14 / 1)"
          fill="oklab(0.69 -0.09 -0.14 / 0.8)"
        />
        <Area
          type="monotone"
          dataKey="funds"
          stackId="1"
          stroke="oklab(0.69 -0.09 -0.14 / 1)"
          fill="oklab(0.69 -0.09 -0.14 / 0.4)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
