import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Table, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { Project } from '../model/ProjectData';
import authService from '../services/AuthService';

interface ClaimFormModalProps {
  visible: boolean;
  editingId: string | null;
  form: any;
  projects: Project[];
  approvals: any[];
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  onSendRequest?: () => Promise<void>;
  loading?: boolean;
}

interface ClaimLog {
  _id: string;
  update_by: string;
  old_status: string;
  new_status: string;
  created_at?: string;
}

const ClaimFormModal: React.FC<ClaimFormModalProps> = ({
  visible,
  editingId,
  form,
  projects,
  approvals,
  onCancel,
  onSubmit,
  onSendRequest,
  loading = false,
}) => {
  const [approvalSearch, setApprovalSearch] = useState<string>('');
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logData, setLogData] = useState<ClaimLog[]>([]);
  const [logLoading, setLogLoading] = useState(false);

  // Lọc danh sách approvals theo keyword, giới hạn 10 kết quả
  const filteredApprovals = approvals
    .filter((user) =>
      (user.user_name || user.email)
        .toLowerCase()
        .includes(approvalSearch.toLowerCase())
    )
    .slice(0, 10);

  // Hàm fetch log của claim khi nhấn "View Claim Log"
  const fetchClaimLogs = async () => {
    if (!editingId) return;
    try {
      setLogLoading(true);
      
      const result = await authService.searchClaimLogs(editingId) as { pageData: any[] };
      const logs: ClaimLog[] = result.pageData.map((item: any) => ({
        _id: item._id,
        update_by: item.update_by,
        old_status: item.old_status,
        new_status: item.new_status,
        created_at: item.created_at,
      }));
      setLogData(logs);
      setLogModalOpen(true);
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

  // Nút "Send Request" chỉ hiển thị nếu đang edit và onSendRequest có giá trị
  const renderSendRequestButton = editingId && onSendRequest && (
    <Button key="send" type="primary" loading={loading} onClick={onSendRequest}>
      Send Request
    </Button>
  );

  // Nút "View Claim Log" hiển thị nếu đang chỉnh sửa
  const renderViewLogButton = editingId && (
    <Button
      key="viewLog"
      type="default"
      onClick={fetchClaimLogs}
      disabled={loading}
    >
      View Claim Log
    </Button>
  );

  // Nút "Save" hoặc "Add Claim" hiển thị confirm khi bấm OK
  const renderSaveButton = (
    <Button
      key="ok"
      type="primary"
      loading={loading}
      onClick={() => {
        Modal.confirm({
          title: editingId
            ? "Do you want to update?"
            : "Do you want to create a new claim?",
          icon: <ExclamationCircleOutlined />,
          onOk: onSubmit, 
        });
      }}
    >
      {editingId ? "Save" : "Add Claim"}
    </Button>
  );

  return (
    <>
      <Modal
        title={editingId ? "Edit Claim" : "Add New Claim"}
        open={visible}
        onCancel={onCancel}
        footer={[
          renderSendRequestButton,
          renderViewLogButton,
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          renderSaveButton,
        ]}
      >
        <Form form={form} layout="vertical">
          {/* Project */}
          <Form.Item
            label="Project"
            name="project_id"
            rules={[{ required: true, message: "Please select a project" }]}
          >
            <Select placeholder="Select a project">
              {projects.map((project) => (
                <Select.Option key={project._id} value={project._id}>
                  {project.project_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Approval */}
          <Form.Item
            label="Approval"
            name="approval_id"
            rules={[{ required: true, message: "Please select an approval user" }]}
          >
            <Select
              showSearch
              placeholder="Select an approval user"
              onSearch={(value) => setApprovalSearch(value)}
              filterOption={false}
            >
              {filteredApprovals.map((user) => (
                <Select.Option key={user._id} value={user._id}>
                  {user.user_name || user.email}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Claim Name */}
          <Form.Item
            label="Claim Name"
            name="claim_name"
            rules={[{ required: true, message: "Please enter a claim name" }]}
          >
            <Input />
          </Form.Item>

          {/* Description */}
          <Form.Item label="Description" name="remark">
            <Input.TextArea />
          </Form.Item>

          {/* Start Date */}
          <Form.Item
            label="Start Date"
            name="claim_start_date"
            rules={[{ required: true, message: "Please select a start date" }]}
          >
            <Input type="date" />
          </Form.Item>

          {/* End Date */}
          <Form.Item
            label="End Date"
            name="claim_end_date"
            rules={[{ required: true, message: "Please select an end date" }]}
          >
            <Input type="date" />
          </Form.Item>

          {/* Work Time */}
          <Form.Item
            label="Work Time (hours)"
            name="total_work_time"
            rules={[{ required: true, message: "Please enter work time" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal hiển thị Claim Logs */}
      <Modal
        title={`Claim Logs - ${form.getFieldValue('claim_name') || ""}`}
        open={logModalOpen}
        onCancel={() => setLogModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setLogModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {logLoading ? (
          <Spin />
        ) : (
          <Table
            dataSource={logData}
            rowKey="_id"
            pagination={false}
            columns={[
              {
                title: 'Update By',
                dataIndex: 'update_by',
                key: 'update_by',
              },
              {
                title: 'Old Status',
                dataIndex: 'old_status',
                key: 'old_status',
              },
              {
                title: 'New Status',
                dataIndex: 'new_status',
                key: 'new_status',
              },
              {
                title: 'Created At',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (val: string) => (val ? new Date(val).toLocaleString() : ''),
              },
            ]}
          />
        )}
      </Modal>
    </>
  );
};

export default ClaimFormModal;
