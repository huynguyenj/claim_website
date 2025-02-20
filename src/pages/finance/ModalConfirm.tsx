import { Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

interface ModalConfirmProps {
  typeConfirm: React.CSSProperties;
  text: string 
}
function showConfirm() {
  confirm({
    title: "Confirm",
    icon: <ExclamationCircleOutlined />,
    content: "Bla bla ...",
    okText: "Yes",
    cancelText: "No",
    centered: true,
  });
}

function ModalConfirm({ typeConfirm,text }:ModalConfirmProps) {
  return (
    <Button style={typeConfirm} onClick={showConfirm} className="text-[0.8rem] hover:tracking-[0.2rem] transition duration-300">
      {text}
    </Button>
  );
}

export default ModalConfirm;
