import { Table, TableProps, Tag } from "antd";
import useApprovalApi from "../../hooks/approval-hooks/useApprovalApi";
import { ClaimResponseApproval } from "../../model/ClaimData";
import { formatColorForClaimStatus, formatDate } from "../../utils/format";
import { pagnitionAntd } from "../../consts/Pagination";

function ApprovalPageBackup() {
  const { approveClaim ,loading} = useApprovalApi();
  const columns: TableProps<ClaimResponseApproval>["columns"] = [
    {
      title: "Claim Name",
      dataIndex: "claim_name",
      key: "claim_name",
      render: (_: unknown, record: ClaimResponseApproval) => (
        <span>{record.claim_name}</span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "claim_start_date",
      key: "claim_start_date",
      render: (value: Date) => <span>{formatDate(value)}</span>,
    },
    {
      title: "End Date",
      dataIndex: "claim_end_date",
      key: "claim_end_date",
      render: (value: Date) => <span>{formatDate(value)}</span>,
    },
    {
      title: "Staff Name",
      dataIndex: "staff_name",
      key: "staff_name",
      render: (_: unknown, record: ClaimResponseApproval) => (
        <span>{record.staff_name}</span>
      ),
    },
    {
      title: "Role in Project",
      dataIndex: "role_in_project",
      key: "role_in_project",
      render: (_: unknown, record: ClaimResponseApproval) => (
        <span>{record.role_in_project}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "claim_status",
      key: "claim_status",
      render: (_: unknown, record: ClaimResponseApproval) => (
            <Tag color={formatColorForClaimStatus(record.claim_status)}>
                  <span className="text-[0.9rem]">{record.claim_status}</span>
            </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
    },
  ];
 
  return (
    <div className="p-10 border-2 rounded-2xl m-5">
      <Table<ClaimResponseApproval>
        columns={columns}
        dataSource={approveClaim || []}
        loading={loading}
        pagination={{ pageSize: pagnitionAntd.pageSize }}
        rowKey="_id"
      />
    </div>
  );
}

export default ApprovalPageBackup;
