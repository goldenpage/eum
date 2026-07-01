export interface User {
  bId: string;
  name: string;
  birthDate: Date;
  phone: string;
  email: string;
  storeType: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  marketingAt: string;
}

export interface Menus {
  menuId: string;
  menuName: string;
  menuPrice: number;
}

export interface MenuCategory {
  menuCategory: string;
  menuCategoryId: string;
  bId: string;
}

export interface Disposals {
  disposalId: string;
  disposalCountAll: number;
  disposalPrice: number;
  disposalDate: Date;
}

export interface Reason {
  reasonId: string;
  reason: string;
}

export interface FoodMaterial {
  foodMaterialId: string;
  foodMaterialName: string;
  foodMaterialCount: number;
  foodMaterialCountAll: number;
  foodMaterialPrice: number;
  foodMaterialType: string;
  vender: string;
  incomeDate: Date;
  expirationDate: Date;
}

export interface FoodMaterialCategory {
  foodCategoryId: string;
  foodCategory: string;
}

export interface Sales {
  saleId: string;
  saleMenuCount: string;
}

export interface Revenue {
  revenueId: string;
  revenueDate: Date;
}

export interface AdminUser {
  name: string;
}
