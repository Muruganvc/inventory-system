export interface CompanyWiseIncomeQueryResponse {
  companyName: string;
  categoryName: string;
  productCategoryName: string;
  totalQuantity: number;
  income: number;
}


export interface TotalProductQueryResponse {
    totalQuantity: number;
    totalNetAmount: number;
    balanceAmount:number;
}