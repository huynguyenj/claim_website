import { useEffect, useState, useCallback, useMemo } from "react";
import { ClaimSearchCondition } from "../../model/SearchType";
import apiService from "../../services/ApiService";
import { Claim, ClaimResponse } from "../../model/ClaimData";

export default function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);

  const pageSize = 10000;
  const pageNum = 1;

  const searchParams: ClaimSearchCondition = useMemo(() => ({
    searchCondition: { keyword: "", claim_status: "", claim_start_date: "", claim_end_date: "", is_delete: false },
    pageInfo: { pageNum, pageSize },
  }), [pageNum, pageSize]);

  // Fetch claims function
  const fetchClaims = useCallback(async () => {
    setClaimLoading(true);
    try {
      const response = await apiService.post<ClaimResponse>("/claims/search", searchParams);
      if (response?.data) {
        setClaims(response.data.pageData);
        setTotalClaims(response.data.pageInfo.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
        setClaimLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return { claims, totalClaims, claimLoading };
}
