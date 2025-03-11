import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Form, Modal, Select, Spin, message,
  TablePaginationConfig
} from 'antd';
import { EditOutlined, SearchOutlined } from '@mui/icons-material';
import { PlusOutlined } from '../../components/Icon/AntdIcon';
import type { ClaimRequest, NewClaimRequest } from '../../model/Claim';
import authService from '../../services/AuthService';
import axios from 'axios';
import { Project, ProjectResponse } from '../../model/ProjectData';
import { useAuthStore } from '../../store/authStore';
import { Notification } from '../../components/common/Notification';
import { pagnitionAntd } from '../../consts/Pagination';
import UserCard from '../../components/Admin/UserCard';
import { Article } from '@mui/icons-material';
import { UserIcon } from '../../components/Icon/MuiIIcon';
import { exportToExcel } from '../../consts/ExcelDownload';

const RequestPage: React.FC = () => {
  const userId = useAuthStore((state) => state.user?._id);
  const [requests, setRequests] = useState<ClaimRequest[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pagnitionAntd.pageSize);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Lấy tất cả các claim từ API (endpoint trả về đối tượng có key pageData chứa mảng)
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    authService.getAllClaims()
      .then((result) => {
        // result có cấu trúc: { pageData: [ ... ] }
        const rawClaims = result.pageData;
        // Map các claim từ API sang kiểu ClaimRequest, chuyển đổi các trường nếu cần
        const mappedClaims: ClaimRequest[] = rawClaims.map((item) => ({
          _id: item._id,
          user_id: item.staff_id, // chuyển staff_id thành user_id
          project_id: item.project_info ? item.project_info._id : "",
          approval_id: item.approval_info ? item.approval_info._id : "",
          claim_name: item.claim_name,
          claim_status: item.claim_status,
          claim_start_date: item.claim_start_date,
          claim_end_date: item.claim_end_date,
          total_work_time: item.total_work_time,
          is_deleted: item.is_deleted,
          created_at: item.created_at,
          updated_at: item.updated_at,
          remark: item.remark || "",
          __v: item.__v || 0,
        }));
        // Lọc ra các claim của user đang đăng nhập
        const userClaims = mappedClaims.filter((c) => c.user_id === userId);
        setRequests(userClaims);
        setTotalItems(userClaims.length);
      })
      .catch((error: unknown) => {
        console.error("Error fetching claims:", error);
        if (axios.isAxiosError(error)) {
          Notification("error", error.response?.data?.message || "Unable to fetch claims");
        } else {
          Notification("error", "Unable to fetch claims");
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) {
        console.error("User ID is not defined.");
        return;
      }
      const searchProject = {
        searchCondition: { user_id: userId, is_delete: false },
        pageInfo: { pageNum: 1, pageSize: 10 },
      };
      try {
        const response = await authService.searchProjectByUserId(searchProject);
        console.log("Project API response:", response);
        const projectResponse = response as unknown as ProjectResponse;
        const projectData = projectResponse.data?.pageData || projectResponse.pageData;
        if (Array.isArray(projectData)) {
          const formattedProjects: Project[] = projectData.map((p) => ({
            _id: p._id,
            project_name: p.project_name,
            project_code: p.project_code || '',
            project_department: p.project_department || '',
            is_deleted: p.is_deleted ?? false,
            project_description: p.project_description || '',
            project_status: p.project_status || 'Chưa biết',
            project_start_date: p.project_start_date || '',
            project_end_date: p.project_end_date || '',
            updated_by: p.updated_by || '',
            created_at: p.created_at || '',
            updated_at: p.updated_at || '',
          }));
          console.log("Formatted Projects:", formattedProjects);
          setProjects(formattedProjects);
        } else {
          console.error("Invalid project response format:", response);
        }
      } catch (error: unknown) {
        console.error("Error fetching projects", error);
      }
    };
    fetchProjects();
  }, [userId]);

  // Handle claim creation / update
  const handleSubmit = async () => {
    try {
      // Validate form values
      const values = await form.validateFields();
      if (!values.project_id) {
        message.error("Please select a project before submitting");
        return;
      }
      // Xây dựng payload để tạo mới claim
      const requestData: NewClaimRequest = {
        project_id: values.project_id,
        approval_id: '67b2fd17f6afc068678f14b5',
        claim_name: values.claim_name,
        claim_start_date: new Date(values.claim_start_date).toISOString(),
        claim_end_date: new Date(values.claim_end_date).toISOString(),
        total_work_time: values.total_work_time ? parseInt(values.total_work_time.toString(), 10) : 0,
        remark: values.remark || "",
      };

      setLoading(true);

      // Nếu editingId tồn tại => Update claim
      if (editingId) {
        // Tìm claim hiện có dựa theo editingId
        const existingRequest = requests.find((req) => req._id === editingId);
        if (!existingRequest) {
          message.error("Error: Unable to find the request for updating");
          return;
        }
        // Tạo object updateData chỉ chứa các trường được phép cập nhật
        const updateData: Partial<ClaimRequest> = {
          // Nếu bạn cho phép update project_id, approval_id thì truyền vào, ngược lại lấy từ existingRequest
          project_id: existingRequest.project_id,
          approval_id: existingRequest.approval_id,
          claim_name: requestData.claim_name,
          claim_start_date: requestData.claim_start_date,
          claim_end_date: requestData.claim_end_date,
          total_work_time: requestData.total_work_time,
          remark: requestData.remark,
        };
        // Gọi API update với claimId (editingId) và updateData
        await authService.updateClaim(editingId, updateData);
        message.success("Claim updated successfully!");
      } else {
        // Nếu không có editingId, tức là tạo mới claim
        await authService.createClaim(requestData);
        message.success("Claim created successfully!");
      }

      // Sau khi tạo hoặc cập nhật, làm mới danh sách claim của người đăng nhập
      if (userId) {
        setLoading(true);
        authService.getAllClaims()
          .then((result) => {
            // result có cấu trúc: { pageData: [ ... ] }
            const rawClaims = result.pageData;
            // Map từng phần tử, chuyển staff_id thành user_id và lấy các trường cần thiết
            const mappedClaims: ClaimRequest[] = rawClaims.map((item) => ({
              _id: item._id,
              user_id: item.staff_id,
              project_id: item.project_info ? item.project_info._id : "",
              approval_id: item.approval_info ? item.approval_info._id : "",
              claim_name: item.claim_name,
              claim_status: item.claim_status,
              claim_start_date: item.claim_start_date,
              claim_end_date: item.claim_end_date,
              total_work_time: item.total_work_time,
              is_deleted: item.is_deleted,
              created_at: item.created_at,
              updated_at: item.updated_at,
              remark: item.remark || "",
              __v: item.__v || 0,
            }));
            // Lọc ra các claim của user đang đăng nhập (dựa theo user_id)
            const userClaims = mappedClaims.filter((c) => c.user_id === userId);
            setRequests(userClaims);
            setTotalItems(userClaims.length);
          })
          .catch((error: unknown) => {
            console.error("Error fetching claims after update:", error);
          })
          .finally(() => setLoading(false));
      }
      // Đóng Modal, reset form và reset editingId
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error: unknown) {
      console.error("Operation failed", error);
      if (axios.isAxiosError(error)) {
        Notification("error", error.response?.data?.message || "Unable to process request");
      } else {
        Notification("error", "Unable to process request");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (request: ClaimRequest) => {
    setEditingId(request._id);
    form.setFieldsValue({
      claim_name: request.claim_name,
      remark: request.remark || "",
      claim_start_date: new Date(request.claim_start_date).toISOString().split('T')[0],
      claim_end_date: new Date(request.claim_end_date).toISOString().split('T')[0],
      total_work_time: request.total_work_time?.toString() || "",
      project_id: request.project_id,
    });
    setIsModalOpen(true);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || currentPage);
    setPageSize(pagination.pageSize || pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  // Lọc các claim theo tên và trạng thái nếu có
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = searchText
      ? req.claim_name.toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesStatus = statusFilter ? req.claim_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: "Claim Name", dataIndex: "claim_name", key: "claim_name" },
    { title: "Status", dataIndex: "claim_status", key: "claim_status" },
    {
      title: "Start Date",
      key: "claim_start_date",
      render: (_: string, record: ClaimRequest) => (
        <span>{new Date(record.claim_start_date).toLocaleDateString()}</span>
      ),
    },
    {
      title: "End Date",
      key: "claim_end_date",
      render: (_: string, record: ClaimRequest) => (
        <span>{new Date(record.claim_end_date).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: ClaimRequest) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)} />
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-y-scroll">
      <div className="flex justify-end items-center p-5">
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() =>
              exportToExcel(
                requests,
                ['_id', 'claim_name', 'claim_status', 'claim_start_date', 'claim_end_date', 'total_work_time'],
                'claims'
              )
            }
          >
            Export claims file
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FCFCFC] p-5">
        <UserCard icon={<UserIcon />} title="Total Claims" growth={15} />
        <UserCard icon={<Article />} title="Pending Claims" growth={20} />
        <UserCard icon={<Article />} title="Approved Claims" growth={30} />
      </div>

      <div className="p-6 m-5 rounded-2xl border-black border-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 flex items-center">
          <Input
            placeholder="Search by claim name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            size="large"
            className="max-w-md shadow-[9px_6px_0px_rgba(0,0,0,1)]"
            allowClear
          />
          <div className="ml-auto flex gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setEditingId(null);
                setIsModalOpen(true);
              }}
            >
              Add Claim
            </Button>
            <Select
              className="w-fit"
              placeholder="Claim Status"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { value: "PENDING", label: "Pending Claims" },
                { value: "APPROVED", label: "Approved Claims" },
                { value: "REJECTED", label: "Rejected Claims" },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="overflow-x">
            <Table
              columns={columns}
              dataSource={filteredRequests}
              loading={loading}
              rowKey="_id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
              }}
              onChange={handleTableChange}
            />
          </div>
        )}

        <Modal
          title={editingId ? "Edit Claim" : "Add New Claim"}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          onOk={handleSubmit}
          okText={editingId ? "Save" : "Add Claim"}
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Claim Name" name="claim_name" rules={[{ required: true, message: "Please enter a claim name" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="remark">
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Start Date" name="claim_start_date" rules={[{ required: true, message: "Please select a start date" }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item label="End Date" name="claim_end_date" rules={[{ required: true, message: "Please select an end date" }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item label="Work Time (hours)" name="total_work_time" rules={[{ required: true, message: "Please enter work time" }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Project" name="project_id" rules={[{ required: true, message: "Please select a project" }]}>
              <Select placeholder="Select a project">
                {projects.map(project => (
                  <Select.Option key={project._id} value={project._id}>
                    {project.project_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default RequestPage;
