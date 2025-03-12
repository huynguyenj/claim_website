import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import type { Project } from '../model/ProjectData';


interface ClaimFormModalProps {
  visible: boolean;
  editingId: string | null;
  form: any;
  projects: Project[];
  onCancel: () => void;
  onSubmit: () => void;
  onSendRequest?: () => void;
}

const ClaimFormModal: React.FC<ClaimFormModalProps> = ({
  visible,
  editingId,
  form,
  projects,
  onCancel,
  onSubmit,
  onSendRequest,
}) => {
  return (
    <Modal
      title={editingId ? "Edit Claim" : "Add New Claim"}
      open={visible}
      onCancel={onCancel}
      footer={[
        // Nếu đang chỉnh sửa và claim có status Draft (hàm onSendRequest có giá trị) thì hiển thị nút Send Request
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
        {/* Đưa trường Project lên đầu */}
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
        {/* Đưa Work Time ở dưới cùng */}
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
