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
import { Select } from "antd";
export default function StackedAreaChart() {
  const [selectedRange, setSelectedRange] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | null
  >(null);
  const [selectedData, setSelectedData] = useState<string>("all");
  const { chartData } = useChartData(selectedRange);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 mr-5">
        <MonthPicker onRangeChange={setSelectedRange} />
        <Select
          defaultValue={"all"}
          style={{ width: 100 }}
          onChange={(value) => setSelectedData(value)}
          options={[
            { value: "all", label: "All" },
            { value: "users", label: "Users" },
            { value: "claims", label: "Claims" },
            { value: "projects", label: "Projects" },
          ]}
        />
      </div>
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
          {(selectedData === "all" || selectedData === "users") && (
            <Area
              type="monotone"
              dataKey="users"
              stackId="1"
              stroke="oklab(0.69 -0.09 -0.14 / 1)"
              fill="oklab(0.69 -0.09 -0.14 / 1)"
            />
          )}
          {(selectedData === "all" || selectedData === "claims") && (
            <Area
              type="monotone"
              dataKey="claims"
              stackId="2"
              stroke="red"
              fill="red"
            />
          )}
          {(selectedData === "all" || selectedData === "projects") && (
            <Area
              type="monotone"
              dataKey="projects"
              stackId="3"
              stroke="blue"
              fill="blue"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
