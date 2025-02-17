export interface ClaimRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PENDING_PAYMENT' | 'PAID';
  createdAt: string;
}
