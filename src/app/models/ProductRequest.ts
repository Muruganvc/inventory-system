export interface ProductRequest {
    productName: string;
    productCategoryId?: number | null;
    description?: string;
    mrp: number;
    salesPrice: number;
    landingPrice: number;
    quantity: number;
    isActive: boolean;
    meter: number;
}