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
import { ArrowDownOutlined, ArrowUpOutlined, CaretLeftOutlined, ClockCircleOutlined, CloseCircleOutlined, DownOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined, SearchOutlined, StarOutlined } from "@mui/icons-material";
import Chartmonth from "./Chartmonth";
import ChartOverview from "./ChartOverview";
import { pagnitionAntd } from "../../consts/Pagination";
import useDashboardData from "../../hooks/user/Userdata";
import { Claim } from "../../model/ClaimData";
import { formatToGMTPlus7 } from '../../utils/dateUtils';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

enum ClaimStatus {
  Draft = "Draft",
  Approved = "Approved",
  Canceled = "Canceled",
  PendingApproval = "Pending Approval",
}

type FilterStatus = "all" | ClaimStatus;

const cardStyle = {
  border: "1px solid black",
  boxShadow: "10px 5px rgb(66, 65, 65)",
};

const UserDashboard: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { claims, totalClaims, loading, error } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filteredClaims: Claim[] = useMemo(() => {
    return claims.filter((claim) => {
      return (
        (searchTerm ? claim._id.includes(searchTerm) : true) &&
        (statusFilter === "all" ? true : claim.claim_status === statusFilter)
      );
    });
  }, [claims, searchTerm, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: FilterStatus) => {
    setStatusFilter(value);
  };

  const getStatusCount = (status: Exclude<FilterStatus, "all">): number => {
    console.log("Checking status:", status);
    console.log("Claims:", claims);
    const count = claims.filter((c) => c.claim_status === status).length;
    console.log(`Count for ${status}:`, count);
    return count;
  };



  const columns = [
    { title: "Claim ID", dataIndex: "_id", key: "_id" },
    {
      title: "Status",
      dataIndex: "claim_status",
      key: "claim_status",
      render: (status: ClaimStatus) => (
        <span
          style={{
            color:
              status === ClaimStatus.Approved
                ? "#52c41a"
                : status === ClaimStatus.Canceled
                  ? "#ff4d4f"
                  : status === ClaimStatus.PendingApproval
                    ? "#faad14"
                    : "black",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "claim_start_date",
      key: "claim_start_date",
      render: (date: string) => formatToGMTPlus7(date)
    },
    {
      title: "End Date",
      dataIndex: "claim_end_date",
      key: "claim_end_date",
      render: (date: string) => formatToGMTPlus7(date)
    },
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

        {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

        <Spin spinning={loading}>
          <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
            {[
              {
                icon: <EyeOutlined />,
                title: "Draft Claims",
                value: getStatusCount(ClaimStatus.Draft),
                color: token.colorWarning,
                trend: "up",
              },
              {
                icon: <CheckCircleOutlined />,
                title: "Approved Claims",
                value: getStatusCount(ClaimStatus.Approved).toString(),
                color: token.colorSuccess,
                trend: "up",
              },

              {
                icon: <CloseCircleOutlined />,
                title: "Canceled Claims",
                value: getStatusCount(ClaimStatus.Canceled),
                color: token.colorError,
                trend: "down",
              },
              {
                icon: <ClockCircleOutlined />,
                title: "Pending Approval",
                value: getStatusCount(ClaimStatus.PendingApproval),
                color: token.colorWarning,
                trend: "up",
              },

              {
                icon: <StarOutlined />,
                title: "Total Claims",
                value: totalClaims,
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
                  <Option value={ClaimStatus.Draft}>Draft</Option>
                  <Option value={ClaimStatus.Approved}>Approved</Option>
                  <Option value={ClaimStatus.Canceled}>Rejected</Option>
                </Select>
              </Col>
            </Row>

            <div style={{ overflowX: "auto" }}>
              <Table<Claim>
                dataSource={filteredClaims}
                columns={columns}
                rowKey="_id"
                scroll={{ x: true }}
                pagination={{ pageSize: pagnitionAntd.pageSize }}
              />
            </div>
          </div>

          <div style={{ border: "2px solid rgb(132, 130, 130)", borderRadius: "12px", padding: "24px", background: "#fff", marginTop: "100px" }}>
            <Row gutter={[24, 24]}>
              {/* First Chart */}
              <Col xs={24} lg={12}>
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  height: '100%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e8e8e8'
                }}>
                  <Chartmonth />
                </div>
              </Col>
              {/* Second Chart */}
              <Col xs={24} lg={12}>
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  height: '100%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e8e8e8'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', paddingRight: '30px' }}>
                    <ChartOverview />
                  </div>
                </div>
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