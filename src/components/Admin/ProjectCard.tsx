import { ReactNode } from "react";

interface StatisticCardProps {
  icon: ReactNode;
  title: string;
  data: number;
}
export default function ProjectCard({ icon, title, data }: StatisticCardProps) {
  return (
    <div className="col-span-1 relative bg-white p-5 rounded-xl border border-black shadow-[8px_4px_black]">
      <p className="text-md text-gray-600 font-bold flex items-center mb-5 gap-2">
        <span>{icon}</span>
        {title}
      </p>
      {/* {loading ? (
                <Spin size="large" />
            ) : ( */}
      <>
        <p className="text-3xl font-bold">{data}</p>
      </>
      {/* )} */}
    </div>
  );
}
