export interface ProductSummary {
  company: string;
  category: string;
  product: string;
  quantity: number;
  income: number;
}

export interface CompanyGroup {
  company: string;
  categories: {
    products: any;
    category: string;
    totalQuantity: number;
    totalIncome: number;
  }[];
  bgColor: string; // 👈 new field
}
