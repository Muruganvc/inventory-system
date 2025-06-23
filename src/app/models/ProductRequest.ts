export interface ProductRequest {
    productName: string;
    companyId: number;
    categoryId: number;
    productCategoryId?: number | null;
    description?: string;
    mrp: number;
    salesPrice: number;
    taxType?: string;
    totalQuantity: number;
    barCode?: string;
    brandName?: string;
    taxPercent?: number;
    isActive: boolean;
}