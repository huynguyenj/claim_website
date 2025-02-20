
export interface ClaimRequest {
  id: string;
  title: string;
  description: string;

  status: string;
  createdAt: string;
  projectName: string; // Add this line
  workDate: string;    // Add this line
  workTime: string; 
}
