import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Spin, Typography, Tag } from 'antd';
import { formatColorForClaimStatus } from '../utils/format';
import authService from '../services/AuthService';

const { Title, Text } = Typography;

interface ClaimLog {
  _id: string;
  updated_by: string;
  old_status: string;
  new_status: string;
  created_at?: string;
}

interface ClaimLogModalProps {
  visible: boolean;
  claimId: string | null;
  claimName: string;
  onClose: () => void;
}

const ClaimLogModal: React.FC<ClaimLogModalProps> = ({
  visible,
  claimId,
  claimName,
  onClose,
}) => {
  const [logData, setLogData] = useState<ClaimLog[]>([]);
  const [logLoading, setLogLoading] = useState(false);

  useEffect(() => {
    if (visible && claimId) {
      fetchClaimLogs();
    }
  }, [visible, claimId]);

  const fetchClaimLogs = async () => {
    if (!claimId) return;
    try {
      setLogLoading(true);
      // Gọi API lấy log dựa trên claimId
      const result = await authService.searchClaimLogs(claimId) as { pageData: any[] };
      const logs: ClaimLog[] = result.pageData.map((item: any) => ({
        _id: item._id,
        updated_by: item.updated_by,
        old_status: item.old_status,
        new_status: item.new_status,
        created_at: item.created_at,
      }));
      setLogData(logs);
    } catch (error) {
      console.error("Error fetching claim logs:", error);
      Modal.error({
        title: "Error",
        content: "Unable to fetch claim logs",
      });
    } finally {
      setLogLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Claim Logs - {claimName}</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      centered
    >
      {logLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={logData}
          rowKey="_id"
          pagination={false}
          bordered
          columns={[
            {
              title: <Text strong>Updated By</Text>,
              dataIndex: 'updated_by',
              key: 'updated_by',
              render: (val: string) => <Text>{val}</Text>,
            },
            {
              title: <Text strong>Old Status</Text>,
              dataIndex: 'old_status',
              key: 'old_status',
              render: (status: string) => (
                <Tag color={formatColorForClaimStatus(status)}>{status}</Tag>
              ),
            },
            {
              title: <Text strong>New Status</Text>,
              dataIndex: 'new_status',
              key: 'new_status',
              render: (status: string) => (
                <Tag color={formatColorForClaimStatus(status)}>{status}</Tag>
              ),
            },
            {
              title: <Text strong>Created At</Text>,
              dataIndex: 'created_at',
              key: 'created_at',
              render: (val: string) => (val ? new Date(val).toLocaleString() : ''),
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default ClaimLogModal;
