export interface ProductRequest {
    productName: string;
    productCategoryId?: number | null;
    description?: string;
    mrp: number;
    salesPrice: number;
    landingPrice:number;
    totalQuantity: number;
    isActive: boolean;
}