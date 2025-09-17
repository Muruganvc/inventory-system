export interface UpdateProductRequest {
    productId: number;
    productName: string;
    productCategoryId: number;
    description?: string | null;
    mrp: number;
    salesPrice: number;
    quantity: number;
    isActive: boolean;
    landingPrice: number;
    rowVersion: number;
    length: string;
}
