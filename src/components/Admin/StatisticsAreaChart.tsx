import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan 1",
    users: 1000,
    claims: 2400,
    funds: 1,
  },
  {
    name: "Jan 5",
    users: 3000,
    claims: 1398,
    funds: 3,
  },
  {
    name: "Jan 10",
    users: 2000,
    claims: 9800,
    funds: 2,
  },
  {
    name: "Jan 15",
    users: 2780,
    claims: 3908,
    funds: 4,
  },
  {
    name: "Jan 20",
    users: 1890,
    claims: 4800,
    funds: 3,
  },
  {
    name: "Jan 25",
    users: 2390,
    claims: 3800,
    funds: 5,
  },
  {
    name: "Jan 30",
    users: 3490,
    claims: 4300,
    funds: 7,
  },
];
export default function StatisticsAreaChart() {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart
        width={310}
        height={100}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <Tooltip />
        <defs>
          <linearGradient>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#4ade80
"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#4ade80
"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </linearGradient>
        </defs>
        <Area
          dataKey="funds"
          stackId="1"
          stroke="oklab(0.75 -0.12 0.12)"
          // fill="oklab(0.75 -0.12 0.12 / 0.6)"
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
