import { Col, Row } from "antd";
import SalaryTable from "./SalaryTable";


const PaidPage: React.FC = () => {

  return (
    <div>
      <Row className="h-screen">
        <Col sm={5} md={4} lg={3} className="h-full">
        </Col>  
        <Col sm={19} md={20} lg={21} className="w-full p-4">
          <SalaryTable />
        </Col>
      </Row>
    </div>
  );
};
export default PaidPage;
