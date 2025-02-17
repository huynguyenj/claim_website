// Ant Design
import { DatePicker } from "antd";
import StackedAreaChart from "../../components/Admin/StackedAreaChart";
// MUI UI
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import StackedBarChart from "../../components/Admin/StackedBarChart";
import DetailsTable from "../../components/Admin/DetailsTable";
import StatisticsAreaChart from "../../components/Admin/StatisticsAreaChart";
import SelectComponent from "../../components/Admin/Select";
import AnchorComponent from "../../components/Admin/Anchor";
// Fake dataset
import { totalFunds } from "../../model/AdminDashboard";
import dataset from "../../model/AdminDashboard";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-[#FCFCFC] p-5 overflow-auto">
      {/* Search Section */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col lg:flex-row items-center justify-between">
        <div>
          <AnchorComponent />
        </div>
        <div className="flex gap-2">
          <div className="flex border border-gray-200 p-2 rounded-lg bg-white hover:border-blue-400 focus-within:border-blue-400 focus-within:shadow-sm focus-within:shadow-blue-200">
            <SearchIcon />
            <input type="text" placeholder="Search..." className="outline-0" />
          </div>
          <DatePicker defaultValue={dayjs()} />
        </div>
      </div>
      {/* Statistics*/}
      <p
        id="overview"
        className="col-span-1 sm:col-span-2 lg:col-span-4 text-3xl font-bold"
      >
        Overview
      </p>
      {/* Users */}
      <div className="col-span-1 relative bg-white  p-3 rounded-xl border border-gray-200">
        <p className="text-md text-gray-600 font-bold">Users</p>
        <p className="text-2xl font-bold">{dataset.users.length}</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
        <div className="h-[4rem] w-[110%]">
          <StatisticsAreaChart />
        </div>
      </div>
      {/* Claims */}
      <div className="col-span-1 relative bg-white  p-3 rounded-xl border border-gray-200">
        <p className="text-md text-gray-600 font-bold">Claims</p>
        <p className="text-2xl font-bold">{dataset.claims.length}</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +6%
        </p>
        <div className="h-[4rem] w-[110%]">
          <StatisticsAreaChart />
        </div>
      </div>
      {/* Funds */}
      <div className="col-span-1 relative bg-white  p-3 rounded-xl border border-gray-200">
        <p className="text-md text-gray-600 font-bold">Funds</p>
        <p className="text-2xl font-bold">${totalFunds()}</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +42%
        </p>
        <div className="h-[4rem] w-[110%]">
          <StatisticsAreaChart />
        </div>
      </div>
      <div className="col-span-1 relative bg-white  p-3 rounded-xl border border-gray-200">
        <p className="text-md text-gray-600 font-bold">Name</p>
        <p className="text-2xl font-bold">Value</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
        <div className="h-[4rem] w-[110%]">
          <StatisticsAreaChart />
        </div>
      </div>

      {/* Stacked Line Chart */}
      <div
        className="relative h-[30rem] sm:h-[26rem]
       col-span-1 sm:col-span-2 bg-white p-3 rounded-lg border border-gray-200"
      >
        <p className="text-md text-gray-600 font-bold">Sessions</p>
        <p className="text-2xl font-bold">13.277</p>
        <p className="absolute left-25 top-10 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
        <p className="text-sm text-gray-400 mb-0 sm:mb-5">
          Sessions per 5 days for the last 30 days
        </p>
        <div className="block sm:absolute top-5 right-5">
          <SelectComponent />
        </div>

        <StackedAreaChart />
      </div>
      {/* Stacked Bar Chart */}
      <div className="relative h-[40rem] sm:h-[26rem] pb-10 sm:pb-5 col-span-1 sm:col-span-2 bg-white rounded-lg border border-gray-200 p-3">
        <p className="text-md text-gray-600 font-bold">Funds Spending</p>
        <p className="text-2xl font-bold">$27.496</p>
        <p className="absolute left-30 top-10 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
        <p className="text-sm text-gray-400 mb-3">
          Funds spent per 5 days for the last 30 days
        </p>
        <div className="block sm:absolute top-5 right-5">
          <SelectComponent />
        </div>
        <StackedBarChart />
      </div>
      <p
        id="details"
        className="col-span-1 sm:col-span-2 lg:col-span-4 text-2xl font-bold"
      >
        Details
      </p>
      <div className="col-span-1 sm:col-span-2 lg:col-span-4">
        <DetailsTable />
      </div>
    </div>
  );
}
