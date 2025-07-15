import { TableRow } from '../shared/components/custom-table/custom-table.component';

export interface BulkUpload extends TableRow {
  companyName: string;
  categoryName: string;
  productCategoryName: string;
  fullName: string;
}

export interface BulkUploadRequest {
  bulkComapanyRequest: BulkUpload[];
}
