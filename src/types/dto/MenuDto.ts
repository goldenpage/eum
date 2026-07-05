export interface MenuMaterialDto {
  foodMaterialId: string;
  foodMaterialName: string;
  usedCount: number;
  foodMaterialPrice: number;
  totalWeight: number;
  usedPrice: number;
}

export interface MenuDto {
  menuId: string;
  menuName: string;
  menuPrice: number;
  menuCategory: string;
}

export interface MenuListResponse {
  menuList: MenuDto[];
  totalCount: number;
  bId?: string;
}

export interface MenuMaterialListResponse {
  menuId: string;
  materialList: MenuMaterialDto[];
  totalCount: number;
}

export interface SaleRequest {
  saleCount: number;
  payment: string;
}

export interface SaleResponse {
  message: string;
  menuId: string;
  saleCount: number;
}

export interface MenuDeleteResponse {
  message: string;
  menuId: string;
}
