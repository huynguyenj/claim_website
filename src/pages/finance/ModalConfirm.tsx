import { Button, message, Modal, Spin, Tag } from "antd";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ChangeStatusClaim, FinanceClaim } from "./DataType";
import dayjs from "dayjs";
import { Notification } from "../../components/common/Notification";
import { privateApiService } from "../../services/ApiService";
import LoadingScreen from "../../components/common/LoadingScreen";

const { confirm } = Modal;

interface ModalConfirmProps {
  userData: FinanceClaim;
}

function ModalConfirm({ userData }: ModalConfirmProps) {
  const [loading, setLoading] = useState<boolean>(false);
  function showConfirm() {
    const user = userData;
    console.log(user);
    confirm({
      title: "Confirmation",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div className="space-y-4 text-sm">
          {/* Tiêu đề */}
          <p className="text-gray-800 text-left font-medium">
            Are you sure you want to proceed with this action?
          </p>

          {/* Thông tin chi tiết */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-900">
              PAY FOR: <span className="text-blue-600">{user.staff_name}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Project:</span>{" "}
              <span className="text-gray-900">
                {user.project_info.project_name}
              </span>
            </p>

            <div className="flex flex-col gap-2 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Position:</span>
                <Tag color="blue" className="font-semibold">
                  {user.role_in_project || "N/A"}
                </Tag>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Start Date:</span>
                <Tag color="green" className="font-semibold">
                  {user.claim_start_date
                    ? dayjs(user.claim_start_date).format("DD/MM/YYYY")
                    : "N/A"}
                </Tag>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">End Date:</span>
                <Tag color="red" className="font-semibold">
                  {user.claim_end_date
                    ? dayjs(user.claim_end_date).format("DD/MM/YYYY")
                    : "N/A"}
                </Tag>
              </div>
            </div>
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
        handleOK();
      },
      onCancel() {
        message.error(`PAY FOR ${user.staff_name}  is canceled`);
      },
    });
  }
  const status: ChangeStatusClaim = {
    _id: userData._id,
    claim_status: "Paid",
    comment: "Payment",
  };

  const handleOK = (): void => {
    setLoading(true);
    privateApiService
      .payForEmployee(status)
      .then((response) => {
        setLoading(false);
        if (response.success) {
          Notification(
            "success",
            "Payment successful!",
            "The claim status has been updated."
          );
        }
      })
      .catch((error) => {
        console.error("Error processing payment:", error);
      });
  };

  return (
    <LoadingScreen loading={[loading]}>
      {loading ? (
        <Button
          style={{ backgroundColor: "var(--color-indigo-700)", color: "white" }}
          className="text-[0.8rem]  tracking-[0.1rem] font-medium"
          disabled
        >
          <Spin indicator={<LoadingOutlined spin />} size="small" />
          Progress...
        </Button>
      ) : (
        <Button
          onClick={showConfirm}
          style={{ backgroundColor: "#90EE90" }}
          className=" text-[0.8rem] hover:tracking-[0.2rem] transition duration-300"
        >
          PAY
        </Button>
      )}
    </LoadingScreen>
  );
}

export default ModalConfirm;
