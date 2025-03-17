import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import type { Project } from '../model/ProjectData';

interface ClaimFormModalProps {
  visible: boolean;
  editingId: string | null;
  form: any;
  projects: Project[];
  // Danh sách user có role A003 (Approval)
  approvals: any[];
  onCancel: () => void;
  onSubmit: () => void;
  onSendRequest?: () => void;
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
}) => {
  // State lưu keyword tìm kiếm cho Approval
  const [approvalSearch, setApprovalSearch] = useState<string>('');

  // Lọc danh sách approval dựa trên keyword và giới hạn 10 kết quả
  const filteredApprovals = approvals
    .filter((user) =>
      (user.user_name || user.email)
        .toLowerCase()
        .includes(approvalSearch.toLowerCase())
    )
    .slice(0, 10);

  return (
    <Modal
      title={editingId ? "Edit Claim" : "Add New Claim"}
      open={visible}
      onCancel={onCancel}
      footer={[
        // Nếu đang chỉnh sửa và có hàm onSendRequest, hiển thị nút Send Request
        editingId && onSendRequest && (
          <Button key="send" type="primary" onClick={onSendRequest}>
            Send Request
          </Button>
        ),
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" onClick={onSubmit}>
          {editingId ? "Save" : "Add Claim"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* Trường Project */}
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
        {/* Trường Approval: Dropdown có khả năng search và giới hạn kết quả */}
        <Form.Item
          label="Approval"
          name="approval_id"
          rules={[{ required: true, message: "Please select an approval user" }]}
        >
          <Select
            showSearch
            placeholder="Select an approval user"
            onSearch={(value) => setApprovalSearch(value)}
            filterOption={false} // Vì ta tự lọc
          >
            {filteredApprovals.map((user) => (
              <Select.Option key={user._id} value={user._id}>
                {user.user_name || user.email}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* Các trường khác */}
        <Form.Item
          label="Claim Name"
          name="claim_name"
          rules={[{ required: true, message: "Please enter a claim name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="remark">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="claim_start_date"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="claim_end_date"
          rules={[{ required: true, message: "Please select an end date" }]}
        >
          <Input type="date" />
        </Form.Item>
        {/* Trường Work Time ở cuối cùng */}
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
