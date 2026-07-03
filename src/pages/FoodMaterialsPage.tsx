import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import Sidebar from "../components/Sidebar";
import type { FoodMaterialDto } from "../types/dto/FoodMaterialDto";
import "./FoodMaterialsPage.css";

const foodMaterialData: FoodMaterialDto[] = [
  {
    foodMaterialId: "FM011",
    foodMaterialName: "홍띵보",
    foodCategory: "육류",
    foodMaterialCount: 10,
    foodMaterialWeight: 500,
    totalWeight: 5000,
    foodMaterialPrice: 30000,
    foodMaterialType: "고체",
    vender: "이게 전술이야 가게",
    incomeDate: "2026-06-25",
    expirationDate: "2026-07-10",
  },
  {
    foodMaterialId: "FM010",
    foodMaterialName: "홍명보",
    foodCategory: "육류",
    foodMaterialCount: 5,
    foodMaterialWeight: 600,
    totalWeight: 3000,
    foodMaterialPrice: 18000,
    foodMaterialType: "고체",
    vender: "나가라식품",
    incomeDate: "2026-06-28",
    expirationDate: "2026-07-04",
  },
  {
    foodMaterialId: "FM009",
    foodMaterialName: "홍띵보육포",
    foodCategory: "가공식품",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "손 빼",
    incomeDate: "2026-06-30",
    expirationDate: "2026-11-27",
  },
  {
    foodMaterialId: "FM008",
    foodMaterialName: "밥",
    foodCategory: "곡류",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "우리쌀",
    incomeDate: "2026-06-30",
    expirationDate: "2026-12-11",
  },
  {
    foodMaterialId: "FM007",
    foodMaterialName: "피카츄",
    foodCategory: "육류",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "한지우",
    incomeDate: "2026-06-30",
    expirationDate: "2026-11-20",
  },
  {
    foodMaterialId: "FM006",
    foodMaterialName: "리자몽",
    foodCategory: "육류",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "한사장",
    incomeDate: "2026-06-30",
    expirationDate: "2026-07-31",
  },
  {
    foodMaterialId: "FM005",
    foodMaterialName: "홍명보 앞다리살",
    foodCategory: "육류",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "빨명보",
    incomeDate: "2026-06-30",
    expirationDate: "2026-07-30",
  },
  {
    foodMaterialId: "FM004",
    foodMaterialName: "홍명보뒷다리살",
    foodCategory: "육류",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "명보가최고야",
    incomeDate: "2026-06-30",
    expirationDate: "2026-12-14",
  },
  {
    foodMaterialId: "FM003",
    foodMaterialName: "38억",
    foodCategory: "지폐",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "달다달어",
    incomeDate: "2026-06-30",
    expirationDate: "2026-12-01",
  },
  {
    foodMaterialId: "FM002",
    foodMaterialName: "면",
    foodCategory: "면류",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "사리가게",
    incomeDate: "2026-06-30",
    expirationDate: "2026-12-27",
  },
  {
    foodMaterialId: "FM001",
    foodMaterialName: "치즈",
    foodCategory: "발효식품",
    foodMaterialCount: 20,
    foodMaterialWeight: 500,
    totalWeight: 10000,
    foodMaterialPrice: 12000,
    foodMaterialType: "고체",
    vender: "꾸덕꾸덕",
    incomeDate: "2026-06-30",
    expirationDate: "2026-12-21",
  },
];

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatMoney(value: number) {
  return `${value.toLocaleString()}원`;
}

interface FoodMaterialColumn {
  key: string;
  label: string;
  getValue: (foodMaterial: FoodMaterialDto) => string | number;
}

const foodMaterialColumnList: FoodMaterialColumn[] = [
  {
    key: "foodMaterialId",
    label: "식자재 번호",
    getValue: (foodMaterial) => foodMaterial.foodMaterialId,
  },
  {
    key: "foodMaterialName",
    label: "식자재명",
    getValue: (foodMaterial) => foodMaterial.foodMaterialName,
  },
  {
    key: "foodCategory",
    label: "카테고리",
    getValue: (foodMaterial) => foodMaterial.foodCategory,
  },
  {
    key: "foodMaterialCount",
    label: "수량",
    getValue: (foodMaterial) => foodMaterial.foodMaterialCount,
  },
  {
    key: "foodMaterialWeight",
    label: "단위 중량",
    getValue: (foodMaterial) =>
      `${formatNumber(foodMaterial.foodMaterialWeight)}g`,
  },
  {
    key: "totalWeight",
    label: "총중량",
    getValue: (foodMaterial) => `${formatNumber(foodMaterial.totalWeight)}g`,
  },
  {
    key: "foodMaterialPrice",
    label: "매입 가격",
    getValue: (foodMaterial) => formatMoney(foodMaterial.foodMaterialPrice),
  },
  {
    key: "foodMaterialType",
    label: "품목 유형",
    getValue: (foodMaterial) => foodMaterial.foodMaterialType,
  },
  {
    key: "vender",
    label: "구입처",
    getValue: (foodMaterial) => foodMaterial.vender,
  },
  {
    key: "incomeDate",
    label: "매입일",
    getValue: (foodMaterial) => foodMaterial.incomeDate,
  },
  {
    key: "expirationDate",
    label: "유통기한",
    getValue: (foodMaterial) => foodMaterial.expirationDate,
  },
];

function FoodMaterialsPage() {
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("idDesc");
  const [allFoodMaterials, setAllFoodMaterials] =
    useState<FoodMaterialDto[]>(foodMaterialData);
  const [foodMaterials, setFoodMaterials] =
    useState<FoodMaterialDto[]>(foodMaterialData);

  const sortFoodMaterials = (
    targetFoodMaterials: FoodMaterialDto[],
    targetSortType: string,
  ) => {
    const sortedFoodMaterials = [...targetFoodMaterials];
    switch (targetSortType) {
      case "idAsc":
        sortedFoodMaterials.sort((a, b) =>
          a.foodMaterialId.localeCompare(b.foodMaterialId),
        );
        break;
      case "idDesc":
        sortedFoodMaterials.sort((a, b) =>
          b.foodMaterialId.localeCompare(a.foodMaterialId),
        );
        break;
      case "expAsc":
        sortedFoodMaterials.sort((a, b) =>
          a.expirationDate.localeCompare(b.expirationDate),
        );
        break;
      case "expDesc":
        sortedFoodMaterials.sort((a, b) =>
          b.expirationDate.localeCompare(a.expirationDate),
        );
        break;
      default:
        break;
    }
    return sortedFoodMaterials;
    // if(targetSortType==="idAsc"){
    //   sortedFoodMaterials.sort((a,b)=>a.foodMaterialId.localeCompare(b.foodMaterialId));
    // }else if(targetSortType==="idDesc"){
    //   sortedFoodMaterials.sort((a,b)=>b.foodMaterialId.localeCompare(a.foodMaterialId));
    // }else if(targetSortType==="expAsc"){
    //   sortedFoodMaterials.sort((a,b)=>a.expirationDate.localeCompare(b.expirationDate));
    // }else if(targetSortType==="expDesc"){
    //   sortedFoodMaterials.sort((a,b)=>b.expirationDate.localeCompare(a.expirationDate));
    // }
    // return sortedFoodMaterials;
  };

  const onSortChange = (nextSortType: string) => {
    setSortType(nextSortType);
    const sortedFoodMaterials = sortFoodMaterials(foodMaterials, nextSortType);
    setFoodMaterials(sortedFoodMaterials);
  };

  const onSearch = () => {
    const result = allFoodMaterials.filter((foodMaterial) =>
      foodMaterial.foodMaterialName.includes(keyword),
    );
    const sortedResult = sortFoodMaterials(result, sortType);
    setFoodMaterials(sortedResult);
  };

  const onAllList = () => {
    setKeyword("");
    const sortedAllFoodMaterials = sortFoodMaterials(
      allFoodMaterials,
      sortType,
    );
    setFoodMaterials(sortedAllFoodMaterials);
  };

  const onDelete = (foodMaterialId: string) => {
    const nextAllFoodMaterials = allFoodMaterials.filter(
      (foodMaterial) => foodMaterial.foodMaterialId !== foodMaterialId,
    );
    setAllFoodMaterials(nextAllFoodMaterials);

    const nextFoodMaterials = nextAllFoodMaterials.filter((foodMaterial) =>
      foodMaterial.foodMaterialName.includes(keyword),
    );
    const sortedNextFoodMaterials = sortFoodMaterials(
      nextFoodMaterials,
      sortType,
    );
    setFoodMaterials(sortedNextFoodMaterials);
  };

  return (
    <div className="food-materials-page">
      <aside className="food-materials-sidebar">
        <Sidebar />
      </aside>
      <main className="food-materials-main">
        <div className="food-materials-header">
          <Header />
        </div>
        <h1>식자재 조회</h1>
        <div className="food-materials-toolbar">
          <Input
            text="식자재명"
            inputType="text"
            value={keyword}
            onChange={setKeyword}
            placeholder="식자재명을 입력하세요"
            width={250}
            height={30}
          />

          <label className="food-materials-sort">
            <div>정렬</div>
            <select
              className="food-materials-sort-select"
              value={sortType}
              onChange={(event) => onSortChange(event.target.value)}
              style={{ height: "36px" }}
            >
              <option value="idAsc">식자재 번호 오름차순</option>
              <option value="idDesc">식자재 번호 내림차순</option>
              <option value="expAsc">유통기한 임박순</option>
              <option value="expDesc">유통기한 여유순</option>
            </select>
          </label>
          <Button type="button" onClick={onSearch}>
            검색
          </Button>
          <Button type="button" onClick={onAllList}>
            전체 조회
          </Button>
        </div>
        <div className="food-materials-table-wrap">
          <table className="food-materials-table">
            <thead>
              <tr>
                {foodMaterialColumnList.map((column) => (
                  <th
                    key={column.key}
                    className="food-materials-table__header-cell"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="food-materials-table__header-cell">삭제</th>
              </tr>
            </thead>
            <tbody>
              {foodMaterials.length === 0 ? (
                <tr>
                  <td colSpan={12}>조회된 식자재가 없습니다</td>
                </tr>
              ) : (
                foodMaterials.map((foodMaterial) => (
                  <tr key={foodMaterial.foodMaterialId}>
                    {foodMaterialColumnList.map((column) => (
                      <td key={column.key}>{column.getValue(foodMaterial)}</td>
                    ))}
                    <td>
                      <Button
                        type="button"
                        onClick={() => onDelete(foodMaterial.foodMaterialId)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default FoodMaterialsPage;
