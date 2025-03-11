import useDashboardData from "./useDashboardData";
import dayjs from "dayjs";

export default function useChartData(selectedRange: [dayjs.Dayjs, dayjs.Dayjs] | null) {
  // Hooks
  const { users, claims, projects, } = useDashboardData();

  // List of months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Initialize arrays for counts per month
  const userCountPerMonth = Array(12).fill(0);
  const claimCountPerMonth = Array(12).fill(0);
  const projectsCountPerMonth = Array(12).fill(0);

  // Function to check if a date is within the selected range
  const isWithinRange = (date: string) => {
    if (!selectedRange) return true;
    const dateObj = dayjs(date);
    return dateObj.isAfter(selectedRange[0].startOf("month")) && dateObj.isBefore(selectedRange[1].endOf("month"));
  };

  // Process user data
  users.forEach((user) => {
    if (user.created_at && isWithinRange(user.created_at)) {
      const monthIndex = new Date(user.created_at).getMonth();
      userCountPerMonth[monthIndex]++;
    }
  });

  // Process claim data
  claims.forEach((claim) => {
    if (claim.created_at && isWithinRange(claim.created_at)) {
      const monthIndex = new Date(claim.created_at).getMonth();
      claimCountPerMonth[monthIndex]++;
    }
  });

  // Process project data
  projects.forEach((project) => {
    if (project.created_at && isWithinRange(project.created_at)) {
      const monthIndex = new Date(project.created_at).getMonth();
      projectsCountPerMonth[monthIndex]++;
    }
  });


  // Combine all data into one
  const chartData = months.map((month, index) => ({
    name: month,
    users: userCountPerMonth[index],
    claims: claimCountPerMonth[index],
    projects: projectsCountPerMonth[index],
  }));

  return { chartData };
}
