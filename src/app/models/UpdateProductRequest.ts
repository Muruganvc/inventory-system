export interface UpdateProductRequest {
    productId: number;
    productName: string;
    companyId: number;
    categoryId: number;
    productCategoryId?: number | null;
    description?: string | null;
    mrp: number;
    salesPrice: number;
    totalQuantity: number;
    isActive: boolean;
    taxType?: string | null;       // default "GST"
    barCode?: string | null;       // default null
    brandName?: string | null;     // default null
    taxPercent?: number;           // default 18
}
