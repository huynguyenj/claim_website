// Ant Design
import StackedAreaChart from "../../components/Admin/StackedAreaChart";
// MUI UI
import StackedBarChart from "../../components/Admin/StackedBarChart";
import SelectComponent from "../../components/Admin/Select";
// Fake dataset
import { totalFunds } from "../../model/AdminDashboard";
import dataset from "../../model/AdminDashboard";
import { ArrowDownwardOutlined, Article } from "@mui/icons-material";
import LineChartComponent from "../../components/Admin/LineChart";
import { UserIcon } from "../../components/Icon/MuiIIcon";
import StatisticCard from "../../components/Admin/StatisticCard";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-5 md:px-14 overflow-auto pb-5">
      {/* Search Section */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      {/* Statistics*/}
      {/* Users */}
      <StatisticCard
        icon={<UserIcon />}
        title="Users"
        data={dataset.users.length}
        growth={25}
      />
      {/* Claims */}
      <StatisticCard
        icon={<Article />}
        title="Claims"
        data={dataset.claims.length}
        growth={42}
      />
      {/* Funds */}
      <StatisticCard
        icon={<Article />}
        title="Funds"
        data={totalFunds()}
        growth={42}
      />
      {/* Sessions */}
      <StatisticCard
        icon={<Article />}
        title="Sessions"
        data={dataset.users.length}
        growth={42}
      />
      {/* Charts Container */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-0">
        {/* StackedAreaChart */}
        <div
          className="relative h-[28rem] sm:h-[34rem]
       col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-2 bg-white border pl-5 pt-5 rounded-xl lg:rounded-r-none lg:rounded-l-xl"
        >
          <p className="text-md text-gray-600 font-bold">Total</p>
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
        <div className="relative h-[28rem] sm:h-[30rem] lg:h-[17rem] pb-10 sm:pb-5 col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-1 bg-white border border-t border-r p-5 rounded-xl lg:rounded-l-none lg:rounded-b-none lg:border-l-0">
          <p className="text-md text-gray-600 font-bold">Funds Spending</p>
          <p className="text-2xl font-bold">$27.496</p>
          <p className="absolute left-30 top-10 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
            +25%
          </p>

          <StackedBarChart />
        </div>
        {/* LineChart */}
        <div
          className="relative h-[28rem] sm:h-[30rem] lg:h-[17rem] col-span-1 sm:col-span-2 lg:col-span-3
        bg-white p-5 border rounded-xl lg:rounded-t-none lg:rounded-l-none lg:border-l-0 lg:border-t-0"
        >
          <p className="text-md text-gray-600 font-bold">Sessions</p>
          <p className="text-2xl font-bold">13.277</p>
          <p className="absolute left-25 top-10 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
            +25%
          </p>
          <LineChartComponent />
        </div>
      </div>
    </div>
  );
}
