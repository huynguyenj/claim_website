import { Button, Form, Input, Modal, Select, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import useApprovalApi from "../../hooks/approval-hooks/useApprovalApi";
import { ClaimResponseApproval, ClaimStatusChangeApproval } from "../../model/ClaimData";
import { formatColorForClaimStatus, formatDate } from "../../utils/format";
import { pagnitionAntd } from "../../consts/Pagination";
import { Fragment, useEffect, useState } from "react";
import { EditIcon, VisibilityIcon } from "../../components/Icon/MuiIIcon";
import { ClaimStatusChoice } from "../../consts/ClaimStatus";
import TextArea from "antd/es/input/TextArea";
import LoadingSpin from "../../components/common/LoadingSpin";
import { SearchOutlined } from "../../components/Icon/AntdIcon";
import useDebounce from "../../hooks/delay-hooks/useDebounce";

function ApprovalPageBackup() {
  const {loading, setSearchTerm, totalItems,updataClaimStatus,setSortTerm,approveClaimSortList } = useApprovalApi();
  const [searchTermInput,setSearchTermInput] = useState<string>('')
  const debouncedSearch = useDebounce(searchTermInput,500)
  const [isModalOpen,setIsModalOpen] = useState<boolean>(false)
  const [isModalOpen2,setIsModalOpen2] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [chosenClaim,setChosenClaim] = useState<string>();
  const [form] = Form.useForm();
  const [claimDetail,setClaimDetail] = useState<ClaimResponseApproval[]>();
  const columns: TableProps<ClaimResponseApproval>["columns"] = [
    { title: "Claim Name", dataIndex: "claim_name", key: "claim_name" },
    { title: "Start Date", dataIndex: "claim_start_date", key: "claim_start_date", render: formatDate },
    { title: "End Date", dataIndex: "claim_end_date", key: "claim_end_date", render: formatDate },
    { title: "Staff Name", dataIndex: "staff_name", key: "staff_name" },
    { title: "Role in Project", dataIndex: "role_in_project", key: "role_in_project" },
    {
      title: "Status",
      dataIndex: "claim_status",
      key: "claim_status",
      render: (_: unknown, record: ClaimResponseApproval) => (
        <Tag color={formatColorForClaimStatus(record.claim_status)}>
          <span className="text-[0.5rem] lg:text-[0.9rem]">{record.claim_status}</span>
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, render: ClaimResponseApproval) => (
        <div className="flex gap-2 w-35">
        <button
          onClick={() => handleOpenModel(render._id,1)}
          className="bg-dark-fig p-2 rounded-2xl w-10 hover:w-20 cursor-pointer group flex  gap-2 overflow-hidden duration-300 ease-in-out active:opacity-75"
        >
          <EditIcon sx={{color:'white'}} />
          <div className="text-white-fig transform-[scale(0)] group-hover:transform-[scale(1)] transition-all duration-300 ease-in-out">
          Edit
          </div>
        </button>
        <button
          onClick={() => handleOpenModel(render._id,2)}
          className="bg-blue-500 p-2 rounded-2xl w-10  hover:w-25 cursor-pointer group flex  gap-2 overflow-hidden duration-300 ease-in-out active:opacity-75"
        >
          <VisibilityIcon sx={{color:'white'}} />
          <div className="text-white-fig transform-[scale(0)] group-hover:transform-[scale(1)] transition-all duration-300 ease-in-out">
            Details
          </div>
        </button>
        </div>
      ),
    },
  ];

  const handleOpenModel = (id:string,modalIndex:number) => {
      setChosenClaim(id)
    switch(modalIndex){
      case 1:
        setIsModalOpen(true);
        break;
      case 2:
        setIsModalOpen2(true);
        break;
    }
  };

  const handleCloseModel = (modalNum: number) => {
    switch(modalNum){
      case 1:
        form.resetFields();
        setIsModalOpen(false);
        break;
      case 2:
      setIsModalOpen2(false)
      break;

  }
}
  

  const handleTablePagination = (pagination: TablePaginationConfig) => {
    const newPage = pagination.current || currentPage;
    setCurrentPage(newPage);
    setSearchTerm((prevSearch) => ({
      ...prevSearch,
      pageInfo: {
        pageNum: newPage,
        pageSize: pagination.pageSize,
      },
    }));
  };

  const handleOk = (modalNum:number, status?:string) =>{
    const validateFields:ClaimStatusChangeApproval = form.getFieldsValue();
    if(modalNum == 1){
      if( validateFields.claim_status == ClaimStatusChoice.rejected && !validateFields.comment){
        form.setFields([
          {
            name:"comment",
            errors:["Comment is required when reject a claim!"]
          }
        ])
        return;
      }else{
        form.submit();
      }
    }else if(modalNum == 2){
      if(!validateFields.comment){
        form.setFields([
          {
            name:"comment",
            errors:["Comment is required when return a claim!"]
          }
        ])
        return;
      }
      form.setFieldsValue({claim_status:status})
      form.submit();
    }
    
  }
  const filterById = () =>{
    const finalResult = approveClaimSortList.filter((data) =>data._id === chosenClaim);
    setClaimDetail(finalResult)
  }

  useEffect(() => {
    filterById();
  },[chosenClaim])

  useEffect(() => {
      handleSearch('');
  },[debouncedSearch])
  const handleSearch = (status:string) => {
    setSearchTerm((prevSearchTerm) => ({
      ...prevSearchTerm,
      searchCondition:{
        keyword:debouncedSearch,
        claim_start_date:"",
        claim_end_date:"",
        claim_status:status,
        is_delete:false
      }
    }));
  
  }
  
  return (
      <div className="py-4 px-10 border-2 rounded-2xl mx-auto mb-5 w-[20rem] sm:w-[95%] sm:h-fit h-fit">
          <div className="flex flex-col justify-between lg:flex-row lg:items-center overflow-y-auto">
           <Input
                placeholder="Search by claim-name"
                prefix={<SearchOutlined />}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSearchTermInput(e.target.value)}
                className="shadow-[9px_6px_0px_rgba(0,0,0,1)] mb-5"
                allowClear
                style={{width:'fit-content'}}
          />
          <Select placeholder='Choose status claim'className="w-30"  onChange={(value:string) => setSortTerm(value)} options={[
            {value:'newest',label:'Newest'},
            {value:'oldest',label:'Oldest'},

          ]}/>
          </div>
          
        <div className="overflow-x-auto">
        <Table<ClaimResponseApproval>
          columns={columns}
          dataSource={approveClaimSortList|| []}
          loading={loading}
          pagination={{
            pageSize: pagnitionAntd.pageSize,
            current: currentPage,
            total: totalItems,
          }}
          rowKey="_id"
          onChange={handleTablePagination}
          scroll={{y: 55 * 5,x:55*5}}
        />
        </div>
      <Modal open={isModalOpen} onCancel={() => handleCloseModel(1)} onOk={() =>handleOk(1)} title='Update claim' footer={[
        loading ? '':
        <Button key="back" type="primary" onClick={() => handleOk(2,ClaimStatusChoice.draft)} >
        Return claim
      </Button>,
      <Button key="submit" type="primary" loading={loading} onClick={() => handleOk(1)}>
        Submit
      </Button>,
      ]}>
      {loading ? 
                  <div className="flex justify-center mt-5">
                        <LoadingSpin width="2rem" border_color="black" border_top_clr="white" height="2rem"/>
                  </div>  :
          <Form form={form} onFinish={updataClaimStatus}>
            <Form.Item<ClaimStatusChangeApproval> name='_id' initialValue={chosenClaim} className="hidden">
            </Form.Item>
              <Form.Item<ClaimStatusChangeApproval> label='Claim Status' name='claim_status'>
                  <Select placeholder='Choose status' options={[
                    {value:ClaimStatusChoice.approve,label:'Approve'},
                    {value:ClaimStatusChoice.rejected,label:'Reject'},
                  ]}>
                  </Select>
              </Form.Item>
              <Form.Item<ClaimStatusChangeApproval> label='Comments' name='comment'>
                <TextArea placeholder="Write some comment"/>
              </Form.Item>
          </Form>
      }
      </Modal>
      <Modal title='Claim information' open={isModalOpen2} onCancel={() => handleCloseModel(2)} footer=''>
        {claimDetail?.map((value,index) => (
          <Fragment key={index}>
           <div>
              <h3 className="text-[0.9rem] font-semibold">Claim</h3>
                 <p>Claim-ID: {value._id}</p>
                 <p>Claim-Create-Date: {formatDate(new Date(value.claim_start_date))}</p>
                 <p>Total-Time: {value.total_work_time}h</p>
           </div>
           <div className="mt-2 mb-2">
              <h3 className="text-[0.9rem] font-semibold">Project</h3>
                <p>Project-Name: {value.project_info.project_name}</p>
                <p>Project-Status: {value.project_info.project_status}</p>
              <div className="flex gap-5">
                <p>Start-Date: {formatDate(new Date(value.project_info.project_start_date))}</p>
                <p>End-Date: {formatDate(new Date(value.project_info.project_end_date))}</p>
              </div>
          </div>
          <div className="mb-2">
              <h3 className="text-[0.9rem] font-semibold">Employee Info</h3>
                <p>Employee-Email: {value.staff_email}</p>
                <p>Employee-Name: {value.employee_info.full_name? value.employee_info.full_name : 'Not update full name'}</p>
                <p>Role in project: {value.role_in_project}</p>
                <p>Department: {value.employee_info.department_name? value.employee_info.department_name:'Not have department '}</p>
                <p>Job rank: {value.employee_info.job_rank ? value.employee_info.job_rank : 'Not have job rank'}</p>
          </div>
          <div>
            <h3 className="text-[0.9rem] font-semibold">Approval Info</h3>
               <p>Approval-Username: {value.approval_info.user_name}</p>
               <p>Approval-Email: {value.approval_info.email}</p>              
          </div>

          </Fragment>
        ))}
      </Modal>
    </div>    
  );
}

export default ApprovalPageBackup;
