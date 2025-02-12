import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Jan 1",
    salary: 4000,
    claims: 2400,
    amt: 2400,
  },
  {
    name: "Jan 5",
    salary: 3000,
    claims: 1398,
    amt: 2210,
  },
  {
    name: "Jan 10",
    salary: 2000,
    claims: 9800,
    amt: 2290,
  },
  {
    name: "Jan 15",
    salary: 2780,
    claims: 3908,
    amt: 2000,
  },
  {
    name: "Jan 20",
    salary: 1890,
    claims: 4800,
    amt: 2181,
  },
  {
    name: "Jan 25",
    salary: 2390,
    claims: 3800,
    amt: 2500,
  },
  {
    name: "Jan 30",
    salary: 3490,
    claims: 4300,
    amt: 2100,
  },
];

export default function StackedBarChart() {
  return (
    <BarChart
      width={600}
      height={300}
      data={data}
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
        dataKey="claims"
        stackId="a"
        stroke="oklab(0.69 -0.09 -0.14 / 1)"
        fill="oklab(0.69 -0.09 -0.14 / 0.6)"
      />
      <Bar
        dataKey="salary"
        stackId="a"
        stroke="oklab(0.69 -0.09 -0.14 / 1)"
        fill="oklab(0.69 -0.09 -0.14 / 0.4)"
      />
    </BarChart>
  );
}
