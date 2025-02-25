import React, { useState, useMemo } from "react";
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Input,
  Select,
  Table,
  theme,
} from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, CaretLeftOutlined, CloseCircleOutlined, DownOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined, SearchOutlined, StarOutlined } from "@mui/icons-material";
import ChartLinetest from "./ChartLinetest";
import Chartmonth from "./Chartmonth";
import ChartOverview from "./ChartOverview";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

enum ClaimStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

enum ClaimType {
  Travel = "Travel",
  Food = "Food",
  Equipment = "Equipment",
  Others = "Others",
}

interface Claim {
  id: string;
  status: ClaimStatus;
  type: ClaimType;
  amount: number;
  date: string;
  createdAt?: string;
}



type FilterStatus = "all" | ClaimStatus;

const mockClaims: Claim[] = [
  { id: "1", status: ClaimStatus.Pending, type: ClaimType.Travel, amount: 120, date: new Date().toISOString().split("T")[0] },
  { id: "2", status: ClaimStatus.Approved, type: ClaimType.Food, amount: 50, date: "2025-02-15" },
  { id: "3", status: ClaimStatus.Pending, type: ClaimType.Equipment, amount: 200, date: "2025-02-15" },
  { id: "4", status: ClaimStatus.Approved, type: ClaimType.Travel, amount: 75, date: "2025-02-15" },
  { id: "5", status: ClaimStatus.Pending, type: ClaimType.Others, amount: 180, date: "2025-02-15" },
  { id: "6", status: ClaimStatus.Rejected, type: ClaimType.Food, amount: 60, date: "2025-02-15" },
  { id: "7", status: ClaimStatus.Rejected, type: ClaimType.Equipment, amount: 90, date: "2025-02-15" },
  { id: "8", status: ClaimStatus.Pending, type: ClaimType.Others, amount: 150, date: "2025-02-15" },
  { id: "9", status: ClaimStatus.Approved, type: ClaimType.Travel, amount: 95, date: "2025-02-15" },
  { id: "10", status: ClaimStatus.Rejected, type: ClaimType.Travel, amount: 203, date: "2025-02-15" },
  { id: "11", status: ClaimStatus.Approved, type: ClaimType.Travel, amount: 95, date: "2025-02-15" },
  { id: "12", status: ClaimStatus.Rejected, type: ClaimType.Travel, amount: 203, date: "2025-02-15" },
  { id: "13", status: ClaimStatus.Rejected, type: ClaimType.Travel, amount: 95, date: "2025-02-15" },
  { id: "14", status: ClaimStatus.Rejected, type: ClaimType.Travel, amount: 203, date: "2025-02-15" },
];

const cardStyle = {
  border: "1px solid black",
  boxShadow: "10px 5px rgb(66, 65, 65)",
};
const UserDashboard: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [loading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filteredClaims: Claim[] = useMemo(() => {
    return mockClaims.filter((claim) => {
      return (
        (searchTerm ? claim.id.includes(searchTerm) : true) &&
        (statusFilter === "all" ? true : claim.status === statusFilter)
      );
    });
  }, [searchTerm, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: FilterStatus) => {
    setStatusFilter(value);
  };

  const getStatusCount = useMemo(() => (status: Exclude<FilterStatus, "all">): number => {
    return mockClaims.filter((c) => c.status === status).length;
  }, [mockClaims]);

  const columns = [
    { title: "Claim ID", dataIndex: "id", key: "id" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ClaimStatus) => (
        <span
          style={{
            color:
              status === ClaimStatus.Approved
                ? "#52c41a"
                : status === ClaimStatus.Rejected
                  ? "#ff4d4f"
                  : "black",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];


  return (
    <Layout style={{ minHeight: "50vh", padding: "20px", overflow: "scroll" }}>
      <Content style={{ background: "#fff", padding: "20px" }}>
        <Button
          type="link"
          icon={<CaretLeftOutlined />}
          onClick={() => navigate("/")}
          style={{ marginBottom: "15px" }}
        >
          Back to Home
        </Button>
        <Title level={1}>Dashboard</Title>

        <Spin spinning={loading}>
          <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
            {[
              {
                icon: <EyeOutlined />,
                title: "Pending Claims",
                value: getStatusCount(ClaimStatus.Pending),
                color: token.colorWarning,
                trend: "up",
              },
              {
                icon: <CheckCircleOutlined />,
                title: "Approved Claims",
                value: getStatusCount(ClaimStatus.Approved),
                color: token.colorSuccess,
                trend: "up",
              },
              {
                icon: <CloseCircleOutlined />,
                title: "Rejected Claims",
                value: getStatusCount(ClaimStatus.Rejected),
                color: token.colorError,
                trend: "down",
              },
              {
                icon: <StarOutlined />,
                title: "Total Claims",
                value: mockClaims.length,
                color: token.colorPrimary,
                trend: "up",
              },
            ].map((card, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card
                  style={cardStyle}
                  bodyStyle={{ padding: "20px" }}
                  hoverable
                >
                  <Statistic
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            background: card.color,
                            borderRadius: "8px",
                            padding: "8px",
                            marginRight: "12px",
                            display: "flex",
                          }}
                        >
                          {React.cloneElement(card.icon, {
                            style: {
                              color: "#fff",
                              fontSize: "20px",
                            },
                          })}
                        </div>
                        <Text style={{ color: token.colorTextSecondary }}>
                          {card.title}
                        </Text>
                      </div>
                    }
                    value={card.value}
                    valueStyle={{
                      fontSize: "32px",
                      fontWeight: 600,
                      color: token.colorTextHeading,
                      marginTop: "12px",
                    }}
                    suffix={
                      card.trend === "up" ? (
                        <ArrowUpOutlined
                          style={{
                            color: card.trend === "up" ? "#52c41a" : "#ff4d4f",
                            fontSize: "18px",
                          }}
                        />
                      ) : (
                        <ArrowDownOutlined
                          style={{
                            color: card.trend === "up" ? "#52c41a" : "#ff4d4f",
                            fontSize: "18px",
                          }}
                        />
                      )
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ border: "2px solid rgb(132, 130, 130)", borderRadius: "12px", padding: "16px", background: "#fff" }}>
            <Row gutter={[16, 16]} style={{ marginTop: "20px", marginBottom: "10px" }}>
              <Col xs={24} md={4}>
                <Input
                  placeholder="Search by Claim ID"
                  value={searchTerm}
                  onChange={handleSearch}
                  prefix={<SearchOutlined />}
                  style={{ fontWeight: "bold", borderWidth: "2px", borderColor: "black", color: "black" }}
                />
              </Col>
              <Col xs={24} md={12} style={{ marginLeft: "auto" }}>
                <Select
                  style={{ width: "100%", fontWeight: "bold", border: "2px solid black", borderRadius: "8px" }}
                  value={statusFilter}
                  onChange={handleStatusChange}
                  allowClear
                  suffixIcon={<DownOutlined style={{ fontSize: "16px", color: "black" }} />}
                >
                  <Option value="all">All</Option>
                  <Option value={ClaimStatus.Pending}>Pending</Option>
                  <Option value={ClaimStatus.Approved}>Approved</Option>
                  <Option value={ClaimStatus.Rejected}>Rejected</Option>
                </Select>
              </Col>
            </Row>

            <div style={{ overflowX: "auto" }}>
              <Table<Claim>
                dataSource={filteredClaims}
                columns={columns}
                rowKey="id"
                scroll={{ x: true }}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </div>

          <div style={{ border: "2px solid rgb(132, 130, 130)", borderRadius: "12px", padding: "16px", background: "#fff", marginTop: "100px" }}>
            <Row gutter={[24, 24]}>
              {/* First Chart */}
              <Col xs={24} lg={8}>
                <Chartmonth />
              </Col>

              {/* Second Chart */}
              <Col xs={24} lg={8}>
                <ChartLinetest />
              </Col>

              {/* Third Chart */}
              <Col xs={24} lg={8}>
                <ChartOverview />
              </Col>
            </Row>
          </div>
          <br></br>
        </Spin>
      </Content>
    </Layout>
  );
};

export default UserDashboard;