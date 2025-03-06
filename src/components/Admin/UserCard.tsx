import { Spin } from "antd";
import { ReactNode } from "react";

interface StatisticCardProps {
    icon: ReactNode;
    title: string;
    data: number;
    growth: number;
    loading?: boolean;
}
export default function UserCard({
    icon,
    title,
    data,
    growth,
    loading,
}: StatisticCardProps) {
    return (
        <div className="col-span-1 relative bg-white p-5 rounded-xl border border-black shadow-[8px_4px_black]">
            <p className="text-md text-gray-600 font-bold flex items-center mb-5 gap-2">
                <span>{icon}</span>
                {title}
            </p>
            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <p className="text-3xl font-bold">{data}</p>
                </>
            )}
            <p className="absolute top-10 right-3 text-sm text-center text-green-800 bg-green-100 border border-green-300 w-12  rounded-full">
                {growth}%
            </p>
        </div>
    );
}
