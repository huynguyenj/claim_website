import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ClaimStatusChoice } from "../consts/ClaimStatus";
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: Date): string => {
  const utcDate = dayjs.utc(date).tz("Asia/Bangkok").format("DD-MM-YYYY");
  return utcDate;
};

export const formatColorForClaimStatus = (status: string) => {
  switch (status) {
    case ClaimStatusChoice.draft:
      return "default"; // Gray
    case ClaimStatusChoice.approve:
      return "green";
    case ClaimStatusChoice.canceled:
      return "red";
    case ClaimStatusChoice.paid:
      return "gold"; 
    case ClaimStatusChoice.pending:
      return "blue";
    case ClaimStatusChoice.rejected:
      return "volcano"; 
    default:
      return "default";
  }
};
