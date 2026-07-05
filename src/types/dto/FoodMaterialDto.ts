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

export interface FoodMaterialPageResponse{
    foodList: FoodMaterialDto[];
    currentPage:number;
    totalPage:number;
    totalCount:number;
    pageSize:number;
    sort:string;
    keyword:string|null;

}
export interface FoodMaterialDeleteResponse{
    message:string;
    foodMaterialId:string;
}