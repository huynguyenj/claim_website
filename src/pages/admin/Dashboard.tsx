// Recharts
import {
  LineChart,
  BarChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Area,
} from "recharts";

// Antd
import { DatePicker,Select, Button, Statistic} from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useState } from "react";
const { RangePicker } = DatePicker;

// Dashboard
const Dashboard = () => {
  const [category, setCategory] = useState("all");
  // Data
  const data = [
    { month: "Jan", users: 1, claims: 1, date: "2025-01-01" },
    { month: "Feb", users: 3, claims: 5, date: "2025-02-01" },
    { month: "Mar", users: 4, claims: 8, date: "2025-03-01" },
    { month: "Apr", users: 5, claims: 20, date: "2025-04-01" },
    { month: "May", users: 7, claims: 5, date: "2025-05-01" },
    { month: "Jun", users: 6, claims: 7, date: "2025-06-01" },
    { month: "Jul", users: 8, claims: 16, date: "2025-07-01" },
    { month: "Aug", users: 6, claims: 10, date: "2025-08-01" },
    { month: "Sep", users: 13, claims: 12, date: "2025-09-01" },
    { month: "Oct", users: 14, claims: 13, date: "2025-10-01" },
    { month: "Nov", users: 16, claims: 25, date: "2025-11-01" },
    { month: "Dec", users: 18, claims: 17, date: "2025-12-01" },
  ];

  // Constants

  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  const sumOfUsers = data.reduce((acc, current) => acc + current.users, 0);
  const sumOfClaims = data.reduce((acc, current) => acc + current.claims, 0);
  const usersGrowthFromNovToDec = data[11].users - data[10].users;
  const claimsGrowthFromNovToDec = data[11].claims - data[10].claims;
  const style = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "24px",
  };
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setCategory(value);
  };
  // Filter data based on category selection
  const filteredData =
    category === "users"
      ? data.map(({ month, users }) => ({ month, users }))
      : category === "claims"
      ? data.map(({ month, claims }) => ({ month, claims }))
      : data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-100 h-screen overflow-auto">
      {/* Filter */}
      <div className="col-span-1  md:col-span-3 flex flex-col md:flex-row justify-between gap-5 bg-white p-5 pt-5 ml-5 mr-5 mt-3 rounded-lg">
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <div className="flex items-center just gap-2 ">
            <p>Category:</p>
            <Select
              style={{ width: "200px" }}
              defaultValue={"All"}
              showSearch
              placeholder="Select a category"
              optionFilterProp="label"
              onChange={onChange}
              onSearch={onSearch}
              options={[
                { value: "all", label: "All" },
                {
                  value: "users",
                  label: "Users",
                },
                {
                  value: "claims",
                  label: "Claims",
                },
              ]}
            ></Select>
          </div>
          <div className="flex items-center gap-2 ">
            <p>Date:</p>
            <RangePicker />
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button type="default">Reset</Button>
          <Button type="primary">Search</Button>
        </div>
      </div>
      {/* Statistics */}
      <div className="flex col-span-1  md:col-span-3 bg-white p-5 ml-5 mr-5 rounded-lg">
        <div className=" w-52 mr-5 border-r border-r-gray-300">
          <Statistic title="Users" value={sumOfUsers} />
          <Statistic
            value={usersGrowthFromNovToDec}
            precision={0}
            valueStyle={{
              color: usersGrowthFromNovToDec > 0 ? "#3f8600" : "#cf1322",
              fontSize: "16px",
              margin: "0",
            }}
            prefix={
              usersGrowthFromNovToDec > 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="Users"
          />
        </div>
        <div className=" w-52 border-r border-r-gray-300">
          <Statistic title="Claims" value={sumOfClaims} />
          <Statistic
            value={claimsGrowthFromNovToDec}
            precision={0}
            valueStyle={{
              color: claimsGrowthFromNovToDec > 0 ? "#3f8600" : "#cf1322",
              fontSize: "16px",
              margin: "0",
            }}
            prefix={
              claimsGrowthFromNovToDec > 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="Claims"
          />
        </div>
      </div>
      {/* LineGraph */}
      <div className="h-[27rem] col-span-1  md:col-span-3 lg:col-span-2 bg-white p-5 pb-2 pl-0 ml-5 mr-5 mb-0 lg:mr-0 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={3300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {category === "users" || category === "all" ? (
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4096ff"
                activeDot={{ r: 8 }}
              />
            ) : null}
            {category === "claims" || category === "all" ? (
              <Line
                type="monotone"
                dataKey="claims"
                stroke="#34D399"
                activeDot={{ r: 8 }}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* BarChart */}
      <div className="h-[27rem] col-span-1  md:col-span-3 lg:col-span-1 bg-white p-5 pb-2 pl-0 mr-5 ml-5 mb-0 lg:ml-0 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={data} barSize={20}>
            <XAxis
              dataKey="month"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            {category === "users" || category === "all" ? (
              <Bar dataKey="users" stackId="a" fill="#4096ff" />
            ) : null}
            {category === "claims" || category === "all" ? (
              <Bar dataKey="claims" stackId="a" fill="#34D399" />
            ) : null}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* ComposedChart */}
      <div className="h-[27rem] col-span-1  bg-white ml-5 mr-5 lg:mr-0 rounded-lg ">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis type="number" />
            <YAxis dataKey="month" type="category" scale="band" />
            <Tooltip />
            <Legend />
            {category === "users" || category === "all" ? (
              <Bar dataKey="users" barSize={20} fill="#4096ff" />
            ) : null}
            {category === "claims" || category === "all" ? (
              <Area dataKey="claims" fill="#D1FAE5" stroke="#34D399" />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* RadarChart */}
      <div className="h-[27rem] col-span-1 mr-5 ml-5 lg:ml-0 lg:mr-0 bg-white rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="month" />
            <PolarRadiusAxis angle={30} domain={[0, 30]} />
            {category === "users" || category === "all" ? (
              <Radar
                name="Users"
                dataKey="users"
                stroke="#4096ff"
                fill="#BFDBFE"
                fillOpacity={0.6}
              />
            ) : null}
            {category === "claims" || category === "all" ? (
              <Radar
                name="Claims"
                dataKey="claims"
                stroke="#34D399"
                fill="#D1FAE5"
                fillOpacity={0.6}
              />
            ) : null}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex col-span-1 bg-white mr-5 pt-5 ml-5 lg:ml-0 text-center justify-center items-center rounded-lg">
        <h1 className="text-gray-500">Coming Soon...</h1>
      </div>
    </div>
  );
};

export default Dashboard;
