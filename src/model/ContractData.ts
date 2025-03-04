export interface Contract {
    _id: string;
    contract_type: string;
    description: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string; 
    __v: number;
  }
  
  export interface ContractResponse {
    success: boolean;
    data: Contract[];
  }
  