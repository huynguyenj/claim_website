import { DatePicker, Input, Space, Spin, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import ModalConfirm from "./ModalConfirm";
import dayjs from "dayjs";
import {
  AccountCircleIcon,
  DateRangeIcon,
  PersonIcon,
  WorkIcon,
} from "../../components/Icon/MuiIIcon";
import { SearchOutlined } from "@mui/icons-material";
import { pagnitionAntd } from "../../consts/Pagination";
import { FinanceClaim, FinanceSearchCondition } from "./DataType";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { privateApiService } from "../../services/ApiService";
import debounce from "lodash/debounce";
import ExportConfirm from "./ExportConfrim";

function SalaryTable(): JSX.Element {
  const [filteredData, setFilteredData] = useState<FinanceClaim[]>([]);

  const [searchCondition, setSearchCondition] =
    useState<FinanceSearchCondition>({
      searchCondition: {
        claim_status: "Approved",
        is_delete: false,
        claim_end_date: "",
        claim_start_date: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: pagnitionAntd.pageSize,
      },
    });

  const [loading, setLoading] = useState<boolean>(false);
  const handleTableChange = (page: number, pageSize: number): void => {
    setSearchCondition((prev) => ({
      ...prev,
      pageInfo: {
        pageNum: page,
        pageSize: pageSize,
      },
    }));
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchCondition((prev) => ({
      ...prev,
      searchCondition: {
        ...prev?.searchCondition,
        keyword: value,
      },
    }));
  }, 1000);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const debounceDatePicker = debounce(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      setSearchCondition((pre) => ({
        ...pre,
        searchCondition: {
          ...pre?.searchCondition,
          claim_start_date: dates?.[0] ? dates[0].toISOString() : undefined,
          claim_end_date: dates?.[1] ? dates[1].toISOString() : undefined,
        },
      }));
    },
    1000
  );

  const handleDatePicker = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      debounceDatePicker(dates);
    },
    [debounceDatePicker]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debounceDatePicker.cancel();
    };
  }, [debouncedSearch, debounceDatePicker]);

  const fetchFinanceClaimData = useCallback(() => {
    console.log(searchCondition);
    setLoading(true);
    privateApiService
      .getFinanceClaimList(searchCondition)
      .then((response) => {
        console.log("API Response:", response?.data?.pageData);
        const safeData = response?.data?.pageData ? response.data.pageData : [];
        setFilteredData(safeData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching finance claims:", error);
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

  const columns = useMemo<TableProps<FinanceClaim>["columns"]>(
    () => [
      {
        title: (
          <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
            <WorkIcon />
            Claim Name
          </div>
        ),
        dataIndex: "claim_name",
        key: "claim_name",
        render: (text) => (
          <a className="text-gray-500 font-medium">{text || "Unknown"}</a>
        ),
        responsive: ["xs", "sm", "md", "lg"],
      },
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
          <p className="font-medium">{text || "Unknown"}</p>
        ),
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
        title: (
          <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
            Status
          </div>
        ),
        dataIndex: "claim_status",
        key: "claim_status",
        render: (text) => (
          <Tag color='success'>{text || "Unknown"}</Tag>
        ),
        responsive: ["xs", "sm", "md", "lg"],
      },
      {
        title: "Action",
        key: "action",
        render: (data: FinanceClaim) => (
          <Space size="small">
            <ModalConfirm userData={data} />
            <ExportConfirm userData={data} />
          </Space>
        ),
        responsive: ["xs", "sm", "md", "lg"],
      },
    ],
    []
  );

  const components = useMemo(
    () => ({
      body: {
        cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
          <td {...props} className="border-t-[1.2px] border-black" />
        ),
      },
    }),
    []
  );

  return (
    <div className="p-6 mr-6 ml-6 mb-6 border-zinc-950 border-[1.5px] rounded-[12px]">
      <div className="flex justify-start gap-2">
        <Input
          prefix={<SearchOutlined className="text-gray-500" />}
          placeholder="Search By Name"
          className="max-w-xs mb-4 rounded-full mr-4 shadow-[7px_7px_0px_0px] duration-1000 ease-in-out"
          onChange={handleSearchChange}
        />
        <DatePicker.RangePicker
          format={"DD/MM/YYYY"}
          style={{ width: "30%", marginBottom: "1rem", marginLeft: "1rem" }}
          className="shadow-[7px_7px_0px_0px]"
          onChange={handleDatePicker}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData || []}
          pagination={{
            pageSize: 5,
            onChange: handleTableChange,
            showSizeChanger: false,
          }}
          scroll={{ y: 275 }}
          components={components}
        />
      )}
    </div>
  );
}
export default SalaryTable;
