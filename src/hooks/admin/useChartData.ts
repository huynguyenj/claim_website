import { useMemo, useCallback } from "react";
import dayjs from "dayjs";
import useUsers from "./useUsers";
import useClaims from "./useClaims";
import useProjects from "./useProjects";

export default function useChartData(selectedRange: [dayjs.Dayjs, dayjs.Dayjs] | null) {
  // Hooks
  const {users} = useUsers();
  const {claims} = useClaims();
  const {projects} = useProjects();
  // List of months
  const months = useMemo(() => [
    "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ], []);

  // Function to check if a date is within the selected range
  const isWithinRange = useCallback((date: string) => {
    if (!selectedRange) return true;
    const dateObj = dayjs(date);
    return dateObj.isAfter(selectedRange[0].startOf("month")) && dateObj.isBefore(selectedRange[1].endOf("month"));
  }, [selectedRange]);

  // Process data using useMemo
  const chartData = useMemo(() => {
    const userCountPerMonth = Array(12).fill(0);
    const claimCountPerMonth = Array(12).fill(0);
    const projectsCountPerMonth = Array(12).fill(0);

    // Generic function to process data
    const processData = (items: { created_at: string }[], countArray: number[]) => {
      items.forEach(({ created_at }) => {
        if (created_at && isWithinRange(created_at)) {
          const monthIndex = new Date(created_at).getMonth();
          countArray[monthIndex]++;
        }
      });
    };

    processData(users, userCountPerMonth);
    processData(claims, claimCountPerMonth);
    processData(projects, projectsCountPerMonth);

    return months.map((month, index) => ({
      name: month,
      users: userCountPerMonth[index],
      claims: claimCountPerMonth[index],
      projects: projectsCountPerMonth[index],
    }));
  }, [users, claims, projects, isWithinRange, months]);

  return { chartData };
}
