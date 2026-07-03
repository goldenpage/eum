export interface FoodMaterialDto{
    foodMaterialId: string;
    foodMaterialName: string;
    foodCategory: string;
    foodMaterialCount: number;
    foodMaterialWeight: number;
    totalWeight: number;
    foodMaterialPrice: number;
    foodMaterialType: string;
    vender: string;
    incomeDate: string;
    expirationDate: string;
    bId?: string;
}