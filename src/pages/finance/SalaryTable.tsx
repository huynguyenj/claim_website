import { Button, Input, Select, Space, Table, Tag, Tooltip } from "antd";
import { DollarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useCallback, useMemo, useState } from "react";
import ModalConfirm from "./ModalConfirm";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import {
  AccountCircleIcon,
  DateRangeIcon,
  MoreTimeIcon,
  PaidIcon,
  PersonIcon,
  WorkIcon,
  CheckBoxIcon,
} from "../../components/Icon/MuiIIcon";
import DataType from "./DataType";
import { ArrowCircleDown } from "@mui/icons-material";
import { pagnitionAntd } from "../../consts/Pagination";
const initialData: DataType[] = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    roles: ["Developer", "Team Lead"],
    project: "E-commerce Website",
    overtime: 5,
    salary: 5000,
    date: new Date("2025-02-15"),
    status: "Approved",
  },
  {
    key: "2",
    name: "Trần Thị B",
    roles: ["Designer"],
    project: "Mobile App UI",
    overtime: 2,
    salary: 4500,
    date: new Date("2025-01-20"),
    status: "Approved",
  },
  {
    key: "3",
    name: "Lê Hoàng C",
    roles: ["QA Tester"],
    project: "Banking System",
    overtime: 3,
    salary: 4000,
    date: new Date("2025-01-25"),
    status: "Approved",
  },
  {
    key: "4",
    name: "Phạm Minh D",
    roles: ["Developer"],
    project: "CRM System",
    overtime: 4,
    salary: 4800,
    date: new Date("2025-01-30"),
    status: "Approved",
  },
  {
    key: "5",
    name: "Đỗ Thanh E",
    roles: ["Project Manager"],
    project: "Healthcare System",
    overtime: 6,
    salary: 5500,
    date: new Date("2025-02-05"),
    status: "Approved",
  },
  {
    key: "6",
    name: "Võ Hải F",
    roles: ["HR Manager"],
    project: "Internal HR System",
    overtime: 1,
    salary: 4700,
    date: new Date("2025-02-10"),
    status: "Approved",
  },
  {
    key: "7",
    name: "Bùi Văn G",
    roles: ["Developer"],
    project: "AI Chatbot",
    overtime: 8,
    salary: 4900,
    date: new Date("2025-02-15"),
    status: "Approved",
  },
  {
    key: "8",
    name: "Ngô Thị H",
    roles: ["Data Analyst"],
    project: "Sales Dashboard",
    overtime: 0,
    salary: 4600,
    date: new Date("2025-02-20"),
    status: "Approved",
  },
];

const options = initialData.map((item) => ({
  label: item.project,
  value: item.project,
}));

function SalaryTable(): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const [listProject, setListProject] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const filteredData = useMemo(() => {
    return initialData
      .filter((item) =>
        searchText
          ? item.name.toLowerCase().includes(searchText.toLowerCase())
          : true
      )
      .filter((item) =>
        listProject.length > 0 ? listProject.includes(item.project) : true
      )
      .filter((item) =>
        selectedDate && selectedDate[0] && selectedDate[1]
          ? dayjs(item.date).isAfter(selectedDate[0].startOf("day")) &&
            dayjs(item.date).isBefore(selectedDate[1].endOf("day"))
          : true
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [searchText, listProject, selectedDate]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );
  const handleDatePicker = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      setSelectedDate(dates ?? [null, null]);
    },
    []
  );

  const handleProjectChange = useCallback((value: string[]) => {
    setListProject(value);
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem] ">
          <DateRangeIcon />
          Date
        </div>
      ),
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <PersonIcon />
          Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="text-blue-500 font-medium">{text}</a>,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <WorkIcon />
          Project
        </div>
      ),
      dataIndex: "project",
      key: "project",
      render: (text) => (
        <Tooltip title={text}>
          <div className="text-gray-700 font-bold truncate max-w-[150px]">
            {text}
          </div>
        </Tooltip>
      ),
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <PaidIcon />
          Salary
        </div>
      ),
      dataIndex: "salary",
      key: "salary",

      render: (salary) => (
        <p>
          {salary} <DollarOutlined />
        </p>
      ),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem]">
          <MoreTimeIcon /> Overtime
        </div>
      ),
      dataIndex: "overtime",
      key: "overtime",
      render: (text) => <p>{text} Hours</p>,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: (
        <div className="font-bold flex items-center gap-0.5 text-[0.7rem]">
          <AccountCircleIcon />
          Role
        </div>
      ),
      key: "role",
      dataIndex: "roles",
      render: (roles: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[150px] overflow-hidden truncate">
          {roles.map((role: string, index: number) => {
            let color: string;
            switch (role.toLowerCase()) {
              case "developer":
                color = "blue";
                break;
              case "designer":
                color = "green";
                break;
              case "qa tester":
                color = "red";
                break;
              case "project manager":
                color = "purple";
                break;
              default:
                color = "gray";
            }
            return (
              <Tooltip title={role} key={index}>
                <Tag color={color} className="truncate max-w-[80px]">
                  {role.toUpperCase()}
                </Tag>
              </Tooltip>
            );
          })}
        </div>
      ),
      responsive: ["sm", "md", "lg"],
    },

    {
      title: (
        <div className="font-bold flex align-middle gap-0.5 text-[0.7rem] ">
          <CheckBoxIcon className="sm:hidden" /> Status
        </div>
      ),
      key: "status",
      dataIndex: "status",
      render: (text) => <Tag color="success">{text}</Tag>,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Action",
      key: "action",
      render: (data: DataType) => (
        <Space size="small">
          <ModalConfirm
            typeConfirm={{ borderColor: "#6ef13c" }}
            text="PAY"
            userData={data}
          />
        </Space>
      ),
      responsive: ["xs","sm", "md", "lg"],
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
          <Select
            mode="multiple"
            allowClear
            style={{ width: "30%", marginBottom: "1rem" }}
            placeholder="Please select"
            onChange={handleProjectChange}
            options={options}
          />
          <DatePicker.RangePicker
            style={{ width: "30%", marginBottom: "1rem", marginLeft: "1rem" }}
            onChange={handleDatePicker}
          />
        </div>
        <div>
          <Table
          className="overflow-x-auto"
            rowKey="key"
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: pagnitionAntd.pageSize }}
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
