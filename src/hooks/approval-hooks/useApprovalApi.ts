import { useEffect, useState } from "react"
import { ClaimResponseApproval, ClaimStatusChangeApproval } from "../../model/ClaimData"
import authService from "../../services/AuthService";
import { pagnitionAntd } from "../../consts/Pagination";
import { ClaimSearchCondition } from "../../model/SearchType";
import { FormProps } from "antd";

export default function useApprovalApi() {
  const [approveClaim,setApproveClaim] = useState<ClaimResponseApproval[]>([]);
  const [totalItems,setTotalItem] = useState<number>(0)
  const [searchTerm,setSearchTerm] = useState<ClaimSearchCondition>({
      searchCondition:{
            keyword: "",
            claim_status: "",
            claim_start_date: "",
            claim_end_date: "",
            is_delete: false
      },
         pageInfo: {
         pageNum: 1,
         pageSize: pagnitionAntd.pageSize
      }
  })
  const [loading,setLoading] = useState<boolean>(false)
  
  useEffect(() => {
      getClaimWithApprovalRole();
  },[searchTerm]);
  const getClaimWithApprovalRole = async () => {
      setLoading(true);
      try {
            const response = await authService.getClaimApproval(searchTerm);
            setApproveClaim(response.data.pageData)
            setTotalItem(response.data.pageInfo.totalItems)
      } catch (error) {
            console.log(error);
      }finally{
      setLoading(false);
      }
  }

  const updataClaimStatus:FormProps<ClaimStatusChangeApproval>['onFinish'] = async(updateStatus) => {
      setLoading(true)
      try {
            await authService.updateClaimStatusForApproval(updateStatus)
      } catch (error) {
            console.log(error)
      }finally{
            setLoading(false)
      }
  }
  return {approveClaim,updataClaimStatus,loading,setSearchTerm,totalItems}
}
