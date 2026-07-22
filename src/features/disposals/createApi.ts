import client from "../../api/client";
import type {
  FoodMaterialDto,
  FoodMaterialPageResponse,
} from "../../types/dto/FoodMaterialDto";

export interface DisposalCreateRequest {
  foodMaterialId: string;
  reasonId: string;
  disposalCountAll: number;
  disposalPrice: number;
  disposalDate: string;
}

interface DisposalCreateResponse {
  success?: boolean;
}

export async function getDisposalFoodMaterials(): Promise<FoodMaterialDto[]> {
  const foodMaterials: FoodMaterialDto[] = [];
  let nextPage = 1;
  let totalPage = 1;

  while (nextPage <= totalPage) {
    const response = await client.get<FoodMaterialPageResponse>(
      "/api/foodmaterials",
      {
        params: {
          sort: "idDesc",
          page: nextPage,
          size: 100,
          keyword: "",
        },
      },
    );

    foodMaterials.push(...(response.data.foodList ?? []));
    totalPage = response.data.totalPage;
    nextPage += 1;
  }
  return foodMaterials;
}

export async function createDisposalItem(
  request: DisposalCreateRequest,
): Promise<void> {
  const response = await client.post<DisposalCreateResponse>(
    "/api/disposal-items",
    request,
  );

  if (response.data.success === false) {
    throw new Error("폐기 품목 등록에 실패했습니다.");
  }
}
