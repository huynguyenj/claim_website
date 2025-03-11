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
import dayjs from "dayjs";
import { useState } from "react";
import { MonthPicker } from "./MonthPicker";
export default function StackedAreaChart() {
  const [selectedRange, setSelectedRange] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | null
  >(null);
  const { chartData } = useChartData(selectedRange);

  return (
    <>
      <MonthPicker onRangeChange={setSelectedRange} />
      <ResponsiveContainer width={"100%"} height={"100%"} className={"mt-3"}>
        <AreaChart
          width={600}
          height={300}
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: -30,
            bottom: 30,
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
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
