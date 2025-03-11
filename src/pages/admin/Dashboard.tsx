import StackedAreaChart from "../../components/Admin/StackedAreaChart";
import { Article } from "@mui/icons-material";
import { UserIcon } from "../../components/Icon/MuiIIcon";
import StatisticCard from "../../components/Admin/StatisticCard";
import useDashboardData from "../../hooks/admin/useDashboardData";
export default function Dashboard() {
  // Hooks
  const { totalUsers, totalClaims, totalProjects, loading } =
    useDashboardData();

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
        data={totalUsers}
        growth={25}
        loading={loading}
      />
      {/* Claims */}
      <StatisticCard
        icon={<Article />}
        title="Claims"
        data={totalClaims}
        growth={42}
        loading={loading}
      />
      {/* Projects */}
      <StatisticCard
        icon={<Article />}
        title="Projects"
        data={totalProjects}
        growth={42}
        loading={loading}
      />
      {/* Charts Container */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-0">
        {/* StackedAreaChart */}
        <div
          className="relative h-[28rem] sm:h-[34rem]
       col-span-1 sm:col-span-2 lg:col-span-full lg:row-span-2 bg-white border pl-5 pt-5 pb-7 rounded-xl"
        >
          <StackedAreaChart />
        </div>
      </div>
    </div>
  );
}
