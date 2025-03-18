import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { Project } from '../model/ProjectData';

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

  // Lọc danh sách approvals theo keyword, giới hạn 10 kết quả
  const filteredApprovals = approvals
    .filter((user) =>
      (user.user_name || user.email)
        .toLowerCase()
        .includes(approvalSearch.toLowerCase())
    )
    .slice(0, 10);

  // Nút "Send Request" chỉ hiển thị nếu đang edit + onSendRequest tồn tại
  const renderSendRequestButton = editingId && onSendRequest && (
    <Button
      key="send"
      type="primary"
      loading={loading}
      onClick={onSendRequest}
    >
      Send Request
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
          onOk: onSubmit, // Gọi hàm onSubmit
        });
      }}
    >
      {editingId ? "Save" : "Add Claim"}
    </Button>
  );

  return (
    <Modal
      title={editingId ? "Edit Claim" : "Add New Claim"}
      open={visible}
      onCancel={onCancel}
      footer={[
        renderSendRequestButton,
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
  );
};

export default ClaimFormModal;
