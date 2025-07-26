export interface CategoryUpdateRequest {
  companyId: number;
  categoryName: string;
  description: string;
  isActive: boolean;
  rowVersion: number;
}
