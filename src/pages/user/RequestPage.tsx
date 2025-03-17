import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Form, Spin, message, TablePaginationConfig, Tag, Select, Modal
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
import ClaimFormModal from '../../components/ClaimFormModal';

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

  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {

    const fetchApprovals = async () => {
      try {
        const result = await authService.searchApprovals();
        const rawUsers = result.pageData;
        setApprovals(rawUsers);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };
    fetchApprovals();
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    authService.getAllClaims()
      .then((result) => {
        const rawClaims = result.pageData;
        const mappedClaims: ClaimRequest[] = rawClaims.map((item: any) => ({
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
      if (!userId) return;
      const searchProject = {
        searchCondition: { user_id: userId, is_delete: false },
        pageInfo: { pageNum: 1, pageSize: 10 },
      };
      try {
        const response = await authService.searchProjectByUserId(searchProject);
        const projectResponse = response as unknown as ProjectResponse;
        const projectData = projectResponse.data?.pageData || projectResponse.pageData;
        if (Array.isArray(projectData)) {
          const formattedProjects = projectData.map((p) => ({
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
            project_comment: p.project_comment || '',
            project_members: p.project_members || [],
          }));
          setProjects(formattedProjects);
        }
      } catch (error: unknown) {
        console.error("Error fetching projects", error);
      }
    };
    fetchProjects();
  }, [userId]);


  const handleChangeStatus = async (claimId: string, newStatus: string) => {
    try {
      setLoading(true);
      await authService.changeClaimStatus(claimId, newStatus);
      message.success(`Claim status changed to ${newStatus}!`);
      const result = await authService.getAllClaims();
      const rawClaims = result.pageData;
      const mappedClaims: ClaimRequest[] = rawClaims.map((item: any) => ({
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
      const userClaims = mappedClaims.filter((c) => c.user_id === userId);
      setRequests(userClaims);
      setTotalItems(userClaims.length);
    } catch (error: unknown) {
      console.error("Error changing claim status:", error);
      if (axios.isAxiosError(error)) {
        Notification("error", error.response?.data?.message || "Unable to change status");
      } else {
        Notification("error", "Unable to change status");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!values.project_id) {
        message.error("Please select a project before submitting");
        return;
      }
      const requestData: NewClaimRequest = {
        project_id: values.project_id,
        approval_id: '67c54c162f87d51dfdb23b13',
        claim_name: values.claim_name,
        claim_start_date: new Date(values.claim_start_date).toISOString(),
        claim_end_date: new Date(values.claim_end_date).toISOString(),
        total_work_time: values.total_work_time ? parseInt(values.total_work_time.toString(), 10) : 0,
        remark: values.remark || "",
      };
      setLoading(true);
      if (editingId) {
        const existingRequest = requests.find((req) => req._id === editingId);
        if (!existingRequest) {
          message.error("Error: Unable to find the request for updating");
          return;
        }
        if (existingRequest.claim_status !== "Draft") {
          message.error("Only Draft claims can be edited.");
          return;
        }
        Modal.confirm({
          title: "Do you want to update?",
          onOk: async () => {
            const updateData: Partial<ClaimRequest> = {
              project_id: existingRequest.project_id,
              approval_id: existingRequest.approval_id,
              claim_name: requestData.claim_name,
              claim_start_date: requestData.claim_start_date,
              claim_end_date: requestData.claim_end_date,
              total_work_time: requestData.total_work_time,
              remark: requestData.remark,
            };
            await authService.updateClaim(editingId, updateData);
            message.success("Claim updated successfully!");
            // Reload claims
            const result = await authService.getAllClaims();
            const rawClaims = result.pageData;
            const mappedClaims: ClaimRequest[] = rawClaims.map((item: any) => ({
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
            const userClaims = mappedClaims.filter((c) => c.user_id === userId);
            setRequests(userClaims);
            setTotalItems(userClaims.length);
            setIsModalOpen(false);
            form.resetFields();
            setEditingId(null);
          },
        });
      } else {
        await authService.createClaim(requestData);
        message.success("Claim created successfully!");
        // Reload claims
        if (userId) {
          const result = await authService.getAllClaims();
          const rawClaims = result.pageData;
          const mappedClaims: ClaimRequest[] = rawClaims.map((item: any) => ({
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
          const userClaims = mappedClaims.filter((c) => c.user_id === userId);
          setRequests(userClaims);
          setTotalItems(userClaims.length);
        }
        setIsModalOpen(false);
        form.resetFields();
        setEditingId(null);
      }
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
    if (request.claim_status !== "Draft") {
      message.error("Only Draft claims can be edited.");
      return;
    }
    setEditingId(request._id);
    form.setFieldsValue({
      project_id: request.project_id,
      claim_name: request.claim_name,
      remark: request.remark || "",
      claim_start_date: new Date(request.claim_start_date).toISOString().split('T')[0],
      claim_end_date: new Date(request.claim_end_date).toISOString().split('T')[0],
      total_work_time: request.total_work_time?.toString() || "",
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

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = searchText
      ? req.claim_name.toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesStatus = statusFilter ? req.claim_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: "Claim Name", dataIndex: "claim_name", key: "claim_name" },
    {
      title: "Status",
      dataIndex: "claim_status",
      key: "claim_status",
      render: (status: string) => {
        let color = "default";
        if (status === "Draft") color = "blue";
        else if (status === "Pending Approval") color = "orange";
        else if (status === "Approved") color = "green";
        else if (status === "Paid") color = "purple";
        else if (status === "Rejected") color = "red";
        else if (status === "Canceled") color = "gray";
        return <Tag color={color}>{status}</Tag>;
      },
    },
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
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
            disabled={record.claim_status !== "Draft"}
            title={record.claim_status !== "Draft" ? "Only Draft claims can be edited" : ""}
          />
        </div>
      ),
    },
  ];

  const currentEditingClaim = editingId ? requests.find((r) => r._id === editingId) : null;

  return (
    <div className="overflow-y-scroll">
      {/* Export Button */}
      <div className="flex justify-end items-center p-5">
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() =>
              exportToExcel(
                requests,
                [
                  '_id',
                  'claim_name',
                  'claim_status',
                  'claim_start_date',
                  'claim_end_date',
                  'total_work_time'
                ],
                'claims'
              )
            }
          >
            Export claims file
          </Button>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FCFCFC] p-5">
        <UserCard icon={<UserIcon />} title="Total Claims" growth={15} data={totalItems} />
        <UserCard
          icon={<Article />}
          title="Pending Claims"
          growth={20}
          data={requests.filter((r) => r.claim_status === 'PENDING').length}
        />
        <UserCard
          icon={<Article />}
          title="Approved Claims"
          growth={30}
          data={requests.filter((r) => r.claim_status === 'APPROVED').length}
        />
      </div>

      {/* Search & Table */}
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

        <ClaimFormModal
          visible={isModalOpen}
          editingId={editingId}
          form={form}
          projects={projects}
          approvals={approvals}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          onSubmit={async () => {
            // Xử lý submit, ví dụ gọi handleSubmit()
            if (editingId) {
              Modal.confirm({
                title: "Do you want to update?",
                onOk: async () => {
                  await handleSubmit();
                },
              });
            } else {
              await handleSubmit();
            }
          }}
          onSendRequest={
            editingId &&
              currentEditingClaim &&
              currentEditingClaim.claim_status === "Draft"
              ? async () => {
                Modal.confirm({
                  title: "Do you want to send request?",
                  onOk: async () => {
                    await handleChangeStatus(editingId, "Pending Approval");
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingId(null);
                  },
                });
              }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default RequestPage;
