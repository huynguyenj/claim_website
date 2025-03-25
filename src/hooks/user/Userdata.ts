import { useEffect, useState } from "react";
import apiService from "../../services/ApiService";
import { Notification } from "../../components/common/Notification";
import { Claim, ClaimResponse, SearchClaimRequest } from "../../model/ClaimData";

export default function useDashboardData() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10000);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showBanned] = useState<boolean | null>(null);
  const [error] = useState<string | null>(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const searchParams: SearchClaimRequest = {
        searchCondition: {
          keyword: searchTerm,
          claim_status: "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false
        },
        pageInfo: { pageNum: currentPage, pageSize },
      };

      const response = await apiService.post<ClaimResponse>("/claims/claimer-search", searchParams);
      console.log("Claims API Response:", response);
      if (response) {
        setClaims(response.data.pageData);
        setTotalClaims(response.data.pageInfo.totalItems || 0);
        console.log("Claims Data:", response.data.pageData);
      }
    } catch (error) {
      console.error("Claims Error:", error);
      Notification("error", error as string);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClaims();
  }, [currentPage, pageSize, searchTerm, showBanned]);

  return {
    claims, totalClaims,
    loading, error, currentPage, setCurrentPage, setSearchTerm,
  };
}

