export interface CompanyWiseIncomeQueryResponse {
  companyName: string;
  categoryName: string;
  productCategoryName: string;
  totalQuantity: number;
  income: number;
}

export interface CompanyWiseSales {
  companyId: number;
  companyName: string;
  totalQuantity: number;
  totalNetTotal: number;
}

export interface TotalProductQueryResponse {
  totalQuantity: number;
  totalNetAmount: number;
  balanceAmount: number;
  companyWiseSales: CompanyWiseSales[]
}