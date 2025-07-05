export interface ProductRequest {
    productName: string;
    companyId: number;
    categoryId: number;
    productCategoryId?: number | null;
    description?: string;
    mrp: number;
    salesPrice: number;
    landingPrice:number;
    totalQuantity: number;
    isActive: boolean;
    serialNo : string;
}