import { Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

function showConfirm() {
  confirm({
    title: "Confirm",
    icon: <ExclamationCircleOutlined />,
    content: "Bla bla ...", 
    okText: "Yes",
    cancelText: "No",
    centered:true
  });
}

function ModalConfirm() {
  return (
    <Button
      style={{
        color: "#000",
        borderColor: "#1D4",
      }}
      onClick={showConfirm}
    >
      Approve
    </Button>
  );
}

export default ModalConfirm;