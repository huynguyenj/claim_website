import useDashboardData from "./useDashboardData";

export default function useChartData() {
// Hooks
const { users, claims, projects, contracts } = useDashboardData();
// List of months
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Initialize arrays for user and claim counts per month
const userCountPerMonth = Array(12).fill(0);
const claimCountPerMonth = Array(12).fill(0);
const projectsCountPerMonth = Array(12).fill(0);
const contractsCountPerMonth = Array(12).fill(0);

// Process user data
users.forEach((user) => {
  if (user.created_at) {
    const monthIndex = new Date(user.created_at).getMonth();
    userCountPerMonth[monthIndex]++;
  }
});

// Process claim data
claims.forEach((claim) => {
  if (claim.created_at) {
    const monthIndex = new Date(claim.created_at).getMonth();
    claimCountPerMonth[monthIndex]++;
  }
});
projects.forEach((contract) => {
  if (contract.created_at) {
    const monthIndex = new Date(contract.created_at).getMonth();
    projectsCountPerMonth[monthIndex]++;
  }
});
contracts.forEach((contract) => {
  if (contract.created_at) {
    const monthIndex = new Date(contract.created_at).getMonth();
    contractsCountPerMonth[monthIndex]++;
  }
});

// Combine all data into one
const chartData = months.map((month, index) => ({
  name: month,
  users: userCountPerMonth[index],
  claims: claimCountPerMonth[index],
  projects: projectsCountPerMonth[index],
  contracts: contractsCountPerMonth[index],
}));
    return {chartData}
}