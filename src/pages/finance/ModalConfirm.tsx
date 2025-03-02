import { Button, message, Modal, Tag } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import DataType from "./DataType";
import React from "react";

const { confirm } = Modal;

interface ModalConfirmProps {
  typeConfirm: React.CSSProperties;
  text: string;
  userData: DataType;
}

function ModalConfirm({ typeConfirm, text, userData }: ModalConfirmProps) {
  function showConfirm() {
    const user = userData;
    confirm({
      title: "Confirmation",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div className="space-y-3 text-sm">
          <p className="text-gray-700">
            Are you sure you want to proceed with this action?
          </p>

          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="font-semibold text-gray-900">
              PAY FOR: <span className="text-blue-600">{user.name}</span>
            </p>
            <p className="text-gray-700">
              Project:
              <span className="font-medium text-gray-900">{user.project}</span>
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-700">Position:</span>
              {user.roles.map((role, index) => (
                <Tag key={index} color="blue">
                  {role}
                </Tag>
              ))}
            </div>
            <p className="text-gray-700">
              Total Overtime Hours:
              <span className="font-medium text-gray-900">{user.overtime}</span>
            </p>
            <p className="text-gray-700">
              Total Salary:
              <span className="font-medium text-green-600">
                ${user.salary.toLocaleString()}
              </span>
            </p>
          </div>

          <ul className="list-disc pl-5">
            <li className="text-red-600 font-medium">
              This action cannot be undone.
            </li>
            <li className="text-red-600 font-medium">
              Please double-check before proceeding.
            </li>
          </ul>
        </div>
      ),
      okText: "YES",
      cancelText: "CANCEL",
      centered: true,
      onOk() {
        message.success(`PAY FOR ${user.name} success`);
      },
      onCancel() {
        message.error(`PAY FOR ${user.name} IS CANCELED`);
      },
    });
  }
  return (
    <Button
      style={typeConfirm}
      onClick={showConfirm}
      className="text-[0.8rem] hover:tracking-[0.2rem] transition duration-300"
    >
      {text}
    </Button>
  );
}

export default ModalConfirm;
