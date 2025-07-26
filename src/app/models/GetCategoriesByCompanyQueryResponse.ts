export interface GetCategoriesByCompanyQueryResponse {
  categoryId: number;
  categoryName: string;
  companyId: number;
  companyName: string;
  description?: string | null;
  isActive: boolean;
  rowVersion: number; 
  createdBy: string;
  createdAt: Date; 
}
