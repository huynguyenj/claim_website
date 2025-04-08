import StackedAreaChart from "../../components/Admin/StackedAreaChart";
import { Article } from "@mui/icons-material";
import { UserIcon } from "../../components/Icon/MuiIIcon";
import useUsers from "../../hooks/admin/useUsers";
import useClaims from "../../hooks/admin/useClaims";
import useProjects from "../../hooks/admin/useProjects";
import StatisticCard from "../../components/Admin/StatisticCard";
import LoadingScreen from "../../components/common/LoadingScreen";
export default function Dashboard() {
  // Hooks
  const { userLoading, totalUsers } = useUsers();
  const { claimLoading, totalClaims } = useClaims();
  const { projectLoading, totalProjects } = useProjects();
  return (
    <div className="overflow-y-auto">
    <LoadingScreen loading={[userLoading,claimLoading,projectLoading]}>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-5 md:px-14 overflow-auto pb-5">
      {/* Search Section */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col lg:flex-row">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      {/* Statistics*/}
      <div className="flex flex-wrap sm:flex-nowrap gap-5 col-span-1 sm:col-span-2 lg:col-span-4">
        {/* Users */}
        <StatisticCard
          icon={<UserIcon />}
          title="Users"
          data={totalUsers}
        />
        {/* Claims */}
        <StatisticCard
          icon={<Article />}
          title="Claims"
          data={totalClaims}
        />
        {/* Projects */}
        <StatisticCard
          icon={<Article />}
          title="Projects"
          data={totalProjects}
        />
      </div>
      {/* Charts Container */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-0">
        {/* StackedAreaChart */}
        <div
          className="relative h-[28rem] sm:h-[34rem]
       col-span-1 sm:col-span-2 lg:col-span-full lg:row-span-2 bg-white border pl-5 pt-5 pb-15 sm:pb-7 rounded-xl"
        >
          <StackedAreaChart />
        </div>
      </div>
    </div>

    </LoadingScreen>
    </div>
  );
}
