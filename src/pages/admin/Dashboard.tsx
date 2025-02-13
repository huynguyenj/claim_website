// Ant Design
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, DatePicker } from "antd";
import StackedAreaChart from "../../components/Admin/StackedAreaChart";
// MUI UI
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import StackedBarChart from "../../components/Admin/StackedBarChart";
import DetailsTable from "../../components/Admin/DetailsTable";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-gray-100 p-5">
      {/* Search Section */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col lg:flex-row items-center justify-between">
        <Breadcrumb
          items={[
            {
              href: "",
              title: <HomeOutlined />,
            },
            {
              href: "",
              title: (
                <>
                  <UserOutlined />
                  <span>Application List</span>
                </>
              ),
            },
            {
              title: "Application",
            },
          ]}
        />
        <div className="flex gap-2">
          <div className="flex border border-gray-300 p-2 rounded-lg bg-white">
            <SearchIcon />
            <input type="text" placeholder="Search..." className="outline-0" />
          </div>
          <DatePicker defaultValue={dayjs()} />
        </div>
      </div>
      {/* Statistics*/}
      <p className="col-span-1 sm:col-span-2 lg:col-span-4 text-2xl font-bold">
        Overview
      </p>
      <div className="col-span-1 relative bg-white  p-3 rounded-xl shadow-sm">
        <p className="text-md text-gray-600 font-bold">Users</p>
        <p className="text-2xl font-bold">14k</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
      </div>
      <div className="col-span-1 relative bg-white  p-3 rounded-xl shadow-sm">
        <p className="text-md text-gray-600 font-bold">Claims</p>
        <p className="text-2xl font-bold">325</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +6%
        </p>
      </div>
      <div className="col-span-1 relative bg-white  p-3 rounded-xl shadow-sm">
        <p className="text-md text-gray-600 font-bold">Funds</p>
        <p className="text-2xl font-bold">$52.890</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +42%
        </p>
      </div>
      <div className="col-span-1 relative bg-white  p-3 rounded-xl shadow-sm">
        <p className="text-md text-gray-600 font-bold">Name</p>
        <p className="text-2xl font-bold">Value</p>
        <p className="text-sm text-gray-400">Last 30 days</p>
        <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
      </div>
      {/* Stacked Line Chart */}
      <div className="relative col-span-1 lg:col-span-2 bg-white w-min p-3 rounded-lg shadow-sm">
        <p className="text-md text-gray-600 font-bold">Sessions</p>
        <p className="text-2xl font-bold">13.277</p>
        <p className="absolute left-25 top-10 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
        <p className="text-sm text-gray-400 mb-3">
          Sessions per 5 days for the last 30 days
        </p>
        <StackedAreaChart />
      </div>
      {/* Stacked Bar Chart */}
      <div className="relative bg-white w-min rounded-lg shadow-sm p-3">
        <p className="text-md text-gray-600 font-bold">Funds Spending</p>
        <p className="text-2xl font-bold">$27.496</p>
        <p className="absolute left-30 top-10 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
          +25%
        </p>
        <p className="text-sm text-gray-400 mb-3">
          Funds spent per 5 days for the last 30 days
        </p>
        <StackedBarChart />
      </div>
      <p className="col-span-1 sm:col-span-2 lg:col-span-4 text-2xl font-bold">
        Details
      </p>
      <div className="col-span-1 sm:col-span-2 lg:col-span-4">
        <DetailsTable />
      </div>
    </div>
  );
}
