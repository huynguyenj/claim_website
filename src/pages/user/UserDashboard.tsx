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
} from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface Claim {
  id: string;
  status: "pending" | "approved" | "rejected";
  type: "Travel" | "Food" | "Equipment" | "Others";
  amount: number;
}

interface ChartData {
  id: number;
  value: number;
  label: string;
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

const mockClaims: Claim[] = [
  { id: "1", status: "pending", type: "Travel", amount: 120 },
  { id: "2", status: "approved", type: "Food", amount: 50 },
  { id: "3", status: "pending", type: "Equipment", amount: 200 },
  { id: "4", status: "approved", type: "Travel", amount: 75 },
  { id: "5", status: "pending", type: "Others", amount: 180 },
  { id: "6", status: "rejected", type: "Food", amount: 60 },
  { id: "7", status: "rejected", type: "Equipment", amount: 90 },
  { id: "8", status: "pending", type: "Others", amount: 150 },
  { id: "9", status: "approved", type: "Travel", amount: 95 },
  { id: "10", status: "rejected", type: "Travel", amount: 203 },
  { id: "11", status: "approved", type: "Travel", amount: 95 },
  { id: "12", status: "rejected", type: "Travel", amount: 203 },
  { id: "13", status: "rejected", type: "Travel", amount: 95 },
  { id: "14", status: "rejected", type: "Travel", amount: 203 },
];

const UserDashboard: React.FC = () => {
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

  const getStatusCount = (status: Exclude<FilterStatus, "all">): number => {
    return mockClaims.filter((c) => c.status === status).length;
  };

  const columns = [
    { title: "Claim ID", dataIndex: "id", key: "id" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Claim["status"]) => (
        <span
          style={{
            color:
              status === "approved"
                ? "#52c41a"
                : status === "rejected"
                ? "#ff4d4f"
                : "black",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toFixed(2),
    },
  ];

  const chartData: ChartData[] = [
    { id: 0, value: 27, label: "Travel" },
    { id: 1, value: 25, label: "Food" },
    { id: 2, value: 18, label: "Equipment" },
    { id: 3, value: 30, label: "Others" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", padding: "20px" }}>
      <Content style={{ background: "#fff", padding: "20px" }}>
        <Button
          type="link"
          icon={<CaretLeftOutlined />}
          onClick={() => navigate("/")}
          style={{ marginBottom: "15px" }}
        >
          Back to Home
        </Button>
        <Title level={3}>Dashboard</Title>

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Claim Request"
                  value={getStatusCount("pending")}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Claim Approval"
                  value={getStatusCount("approved")}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Rejected Claims"
                  value={getStatusCount("rejected")}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Total Claims" value={mockClaims.length} />
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[16, 16]}
            style={{ marginTop: "20px", marginBottom: "10px" }}
          >
            <Col span={12}>
              <Input
                placeholder="Search by Claim ID"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col span={12}>
              <Select<FilterStatus>
                placeholder="Filter by Status"
                style={{ width: "100%" }}
                value={statusFilter}
                onChange={handleStatusChange}
                allowClear
              >
                <Option value="all">All</Option>
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Col>
          </Row>

          <Table<Claim>
            dataSource={filteredClaims}
            columns={columns}
            rowKey="id"
          />

          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col span={14}>
              <Card title="Number of Claims Per Month">
                <LineChart
                  xAxis={[
                    {
                      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      data: [3, 20, 3.5, 25, 4.9, 15],
                      area: true,
                      color: "#8884d8",
                    },
                  ]}
                  height={300}
                />
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Claim Classification">
                <PieChart
                  series={[
                    {
                      data: chartData,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, additionalRadius: -30 },
                    },
                  ]}
                  height={300}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Card title="Claim Status Overview">
                <BarChart
                  series={[
                    {
                      data: [
                        mockClaims.filter((c) => c.status === "pending").length,
                        mockClaims.filter((c) => c.status === "approved")
                          .length,
                        mockClaims.filter((c) => c.status === "rejected")
                          .length,
                      ],
                      color: "#FF6384",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["Pending", "Approved", "Rejected"],
                    },
                  ]}
                  height={300}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </Content>
    </Layout>
  );
};

export default UserDashboard;
