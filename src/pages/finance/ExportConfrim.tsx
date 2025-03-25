import { Button, Modal } from "antd";
import { CloudDownloadIcon } from "../../components/Icon/MuiIIcon";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { FinanceClaim } from "./DataType";
import { exportToExcel } from "../../consts/ExcelDownload";
import { formatToGMTPlus7 } from "../../utils/dateUtils";
const { confirm } = Modal;

interface ExportConfirmProps {
  userData: FinanceClaim;
}

const ExportConfirm: React.FC<ExportConfirmProps> = ({ userData }) => {
  const showConfirm = (): void => {
    confirm({
      title: "Confirmation",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div className="space-y-4 text-sm">
          {/* Tiêu đề */}
          <p className="text-gray-800 text-left font-medium">
            Are you sure you want to proceed with this action?
          </p>
          {/*Thông tin chi tiết*/}
          <div>
            <p className="bg-sky-50 border border-sky-300 p-3 rounded-lg text-gray-800 text-left font-medium">
              You want to download information about{" "}
              <span className="font-bold text-gray-800 ml-0.5 ">
                {userData.staff_name}
              </span>{" "}
              claim ?
            </p>
          </div>
          {/* Cảnh báo */}
          <div className="bg-red-50 border border-red-300 p-3 rounded-lg">
            <ul className="list-disc pl-5 text-red-700 font-medium space-y-1">
              <li>This action cannot be undone.</li>
              <li>Please double-check before proceeding.</li>
            </ul>
          </div>
        </div>
      ),
      okText: "YES",
      cancelText: "CANCEL",
      centered: true,
      onOk() {
        handleOk();
      },
      onCancel() {},
    });
  };

  const columns = [
    "claim_start_date",
    "claim_end_date",
    "staff_name",
    "staff_email",
    "role_in_project",
    "claim_name",
    "claim_status",
  ];

  const handleOk = (): void => {
    const formattedData = {
      StartDate: formatToGMTPlus7(userData.claim_start_date) || "N/A",
      EndDate: formatToGMTPlus7(userData.claim_end_date)|| "N/A",
      StaffName: userData.staff_name || "N/A",
      StaffEmail: userData.staff_email || "N/A",
      RoleInProject: userData.role_in_project || "N/A",
      ClaimName: userData.claim_name || "N/A",
      ClaimStatus: userData.claim_status || "N/A",
    };
    exportToExcel(
      [formattedData],
      columns,
      `${userData.staff_name}-salaryData.xlsx`
    );
  };
  return (
    <>
      <Button
        onClick={showConfirm}
        style={{ border: "#000" }}
        className=" text-[0.8rem] hover:tracking-[0.2rem]  transition duration-300"
      >
        Export <CloudDownloadIcon />
      </Button>
    </>
  );
};
export default ExportConfirm;
