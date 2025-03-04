import { Button, DatePicker, Input, Space, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import ModalConfirm from "./ModalConfirm";
import dayjs from "dayjs";
import {
  AccountCircleIcon,
  DateRangeIcon,
  PersonIcon,
  WorkIcon,
} from "../../components/Icon/MuiIIcon";
import { ArrowCircleDown, SearchOutlined } from "@mui/icons-material";
import { pagnitionAntd } from "../../consts/Pagination";
import { FinanceClaim, FinanceSearchCondition } from "./DataType";
import { useCallback, useEffect, useState } from "react";
import { privateApiService } from "../../services/ApiService";

function SalaryTable(): JSX.Element {
  const [filteredData, setFilteredData] = useState<FinanceClaim[]>([]);

  const handleTableChange = (page: number, pageSize: number): void => {
    setSearchCondition((prev) => ({
      ...prev,
      pageInfo: {
        pageNum: page,
        pageSize: pageSize,
      },
    }));
  };
  const [searchCondition, setSearchCondition] =
    useState<FinanceSearchCondition>({
      searchCondition: {},
      pageInfo: {
        pageNum: 1,
        pageSize: pagnitionAntd.pageSize,
      },
    });

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchCondition((prev) => ({
        ...prev,
        searchCondition: {
          ...prev?.searchCondition,
          keyword: e.target.value,
        },
      }));
    },
    []
  );

  const handleDatePicker = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      setSearchCondition((prev) => ({
        ...prev,
        searchCondition: {
          ...prev?.searchCondition,
          claim_start_date: dates?.[0] || undefined,
          claim_end_date: dates?.[1] || undefined,
        },
      }));
    },
    []
  );

  const fetchFinanceClaimData = useCallback(() => {
    privateApiService
      .getFinanceClaimList(searchCondition)
      .then((response) => {
        console.log("📌 API Response:", response?.data?.pageData);

        const safeData = Array.isArray(response?.data?.pageData)
          ? response.data.pageData
          : [];
        setFilteredData(safeData);
      })
      .catch((error) => {
        console.error("❌ Error fetching finance claims:", error);
      });
  }, [searchCondition]);

  useEffect(() => {
    fetchFinanceClaimData();
  }, [fetchFinanceClaimData]);

  
  const getColor = (role_in_project: string): string => {
    switch (role_in_project.toLowerCase()) {
      case "developer":
        return "blue";
      case "designer":
        return "green";
      case "qa tester":
        return "red";
      case "project manager":
        return "purple";
      default:
        return "gray";
    }
  };

  const columns: TableProps<FinanceClaim>["columns"] = [
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <DateRangeIcon />
          Start Date
        </div>
      ),
      dataIndex: "claim_start_date",
      key: "claim_start_date",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <DateRangeIcon />
          End Date
        </div>
      ),
      dataIndex: "claim_end_date",
      key: "claim_end_date",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <PersonIcon />
          Staff Name
        </div>
      ),
      dataIndex: "staff_name",
      key: "staff_name",
      render: (text) => (
        <a className="text-blue-500 font-medium">{text || "Unknown"}</a>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <WorkIcon />
          Email
        </div>
      ),
      dataIndex: "staff_email",
      key: "staff_email",
      render: (text) => (
        <Tooltip title={text}>
          <div className="text-gray-700 font-bold truncate max-w-[150px]">
            {text || "N/A"}
          </div>
        </Tooltip>
      ),
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex items-center gap-0.5 text-[0.7rem]">
          <AccountCircleIcon />
          Role in Project
        </div>
      ),
      key: "role_in_project",
      dataIndex: "role_in_project",
      render: (role_in_project: string | null) => (
        <div className="flex flex-wrap gap-1 max-w-[150px] overflow-hidden truncate">
          <Tooltip title={role_in_project || "No Role"}>
            <Tag
              color={getColor(role_in_project || "default")}
              className="truncate max-w-[80px]"
            >
              {role_in_project ? role_in_project.toUpperCase() : "N/A"}
            </Tag>
          </Tooltip>
        </div>
      ),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Action",
      key: "action",
      render: (data: FinanceClaim) => (
        <Space size="small">
          <ModalConfirm
            typeConfirm={{ borderColor: "#6ef13c" }}
            text="PAY"
            userData={data}
          />
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  const components = {
    body: {
      cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td {...props} className="border-t-[1.2px] border-black" />
      ),
    },
  };

  return (
    <>
      <div className="flex justify-end mr-[40px] mb-[20px]">
        <Button
          type="primary"
          className="sm:text-[0.7rem] flex-row justify-around "
          icon={<ArrowCircleDown />}
          iconPosition="end"
        >
          Export Data
        </Button>
      </div>
      <div className="p-6 mr-6 ml-6 mb-6 h-full overflow-y-auto border-zinc-950 border-[1.5px] rounded-[12px]">
        <div className="p-6 flex justify-around gap-2 mr-1">
          <Input
            prefix={<SearchOutlined className="text-gray-500" />}
            placeholder="Search By Name"
            className="max-w-xs mb-4 rounded-full mr-4 shadow-[7px_7px_0px_0px] duration-300 ease-in-out"
            onChange={handleSearchChange}
          />
          <DatePicker.RangePicker
            style={{ width: "30%", marginBottom: "1rem", marginLeft: "1rem" }}
            onChange={handleDatePicker}
          />
        </div>
        <div>
          <Table
            className="overflow-x-auto"
            columns={columns}
            dataSource={filteredData || []}
            pagination={{
              pageSize: pagnitionAntd.pageSize,
              onChange: handleTableChange,
            }}
            style={{
              tableLayout: "auto",
            }}
            components={components}
          />
        </div>
      </div>
    </>
  );
}
export default SalaryTable;
