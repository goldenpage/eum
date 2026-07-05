import { useEffect, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import client from "../api/client";
import Input from "../components/Input";
import "./AddFoodMaterialPage.css";

interface FoodCategoryItem {
  foodCategoryId: string;
  foodCategory: string;
}

interface AddCategoryResult {
  result: "success" | "fail";
  message?: string;
  foodCategoryId?: string;
  foodCategory?: string;
}

interface DeleteCategoryResult {
  result: "success" | "fail";
  message?: string;
}

interface AddFoodMaterialResult {
  result: "success" | "fail";
  message?: string;
}

interface SearchItem {
  foodMaterialName: string;
  foodCategory: string;
  vender: string;
  foodMaterialType: string;
}

interface PendingFood {
  foodMaterialName: string;
  foodCategory_Id: string;
  foodCategoryName: string;
  foodMaterialCount: string;
  foodMaterialWeight: string;
  unit: string;
  foodMaterialPrice: string;
  foodMaterialType: string;
  vender: string;
  incomeDate: string;
  expirationDate: string;
}

interface Notice {
  text: string;
  type: "success" | "error";
}

function today() {
  return new Date().toISOString().substring(0, 10);
}

function AddFoodMaterialsPage() {
  const [categoryList, setCategoryList] = useState<FoodCategoryItem[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [foodMaterialName, setFoodMaterialName] = useState("");
  const [foodMaterialWeight, setFoodMaterialWeight] = useState("");
  const [inputUnit, setInputUnit] = useState("g");
  const [foodMaterialPrice, setFoodMaterialPrice] = useState("");
  const [foodMaterialCount, setFoodMaterialCount] = useState("");
  const [foodMaterialType, setFoodMaterialType] = useState("");
  const [vender, setVender] = useState("");
  const [incomeDate, setIncomeDate] = useState(today());
  const [expirationDate, setExpirationDate] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<SearchItem[] | null>(null);
  const [pendingList, setPendingList] = useState<PendingFood[]>([]);

  const [notice, setNotice] = useState<Notice | null>(null);

  const count = Number(foodMaterialCount);
  const weight = Number(foodMaterialWeight);
  const price = Number(foodMaterialPrice);
  const totalWeight = count > 0 && weight > 0 ? count * weight : "";
  const totalPrice = count > 0 && price > 0 ? count * price : "";

  function showNotice(text: string, type: "success" | "error" = "error") {
    setNotice({ text, type });
  }

  async function loadFoodCategoryList() {
    try {
      const res = await client.get<FoodCategoryItem[]>(
        "/api/foodmaterial/foodcategory/list",
      );
      if (Array.isArray(res.data)) {
        setCategoryList(res.data);
      } else {
        console.warn("카테고리 목록 응답이 배열이 아님:", res.data);
      }
    } catch (e) {
      console.error("카테고리 목록 불러오기 실패", e);
    }
  }

  useEffect(() => {
    loadFoodCategoryList();
  }, []);

  function selectCategory(categoryId: string) {
    setSelectedCategoryId(categoryId);
  }

  function getSelectedCategoryName() {
    const c = categoryList.find((c) => c.foodCategoryId === selectedCategoryId);
    return c ? c.foodCategory : "";
  }

  async function addCategoryAjax() {
    const categoryName = newCategory;
    if (!categoryName) {
      showNotice("카테고리명을 입력해주세요", "error");
      return;
    }
    try {
      const res = await client.post<AddCategoryResult>(
        "/api/foodmaterial/foodcategory/add",
        { foodCategory: categoryName },
      );
      const data = res.data;
      if (data.result === "success") {
        showNotice("카테고리가 추가되었습니다", "success");
        setCategoryList((prev) => [
          ...prev,
          {
            foodCategoryId: data.foodCategoryId ?? "",
            foodCategory: data.foodCategory ?? categoryName,
          },
        ]);
        setNewCategory("");
      } else {
        showNotice(data.message ?? "추가 실패", "error");
      }
    } catch {
      showNotice("카테고리 추가 중 오류 발생", "error");
    }
  }

  async function deleteCategoryAjax(category: FoodCategoryItem) {
    if (!confirm(category.foodCategory + " 카테고리를 삭제하시겠습니까?"))
      return;
    try {
      const res = await client.delete<DeleteCategoryResult>(
        "/api/foodmaterial/foodcategory/delete",
        { data: { foodCategory: category.foodCategory } },
      );
      const data = res.data;
      if (data.result === "success") {
        showNotice(data.message ?? "삭제되었습니다.", "success");
        if (selectedCategoryId === category.foodCategoryId) {
          setSelectedCategoryId("");
        }
        setCategoryList((prev) =>
          prev.filter((c) => c.foodCategoryId !== category.foodCategoryId),
        );
      } else {
        showNotice(data.message ?? "삭제 실패", "error");
      }
    } catch {
      showNotice("카테고리 삭제 중 오류가 발생했습니다.", "error");
    }
  }

  function addToList() {
    const income = incomeDate || today();

    if (!foodMaterialName) {
      showNotice("식자재명을 입력해주세요.", "error");
      return;
    }
    if (!selectedCategoryId) {
      showNotice("카테고리를 선택해주세요.", "error");
      return;
    }
    if (!foodMaterialCount || Number(foodMaterialCount) < 0) {
      showNotice("전체수량을 올바르게 입력해주세요.", "error");
      return;
    }
    if (!foodMaterialWeight || Number(foodMaterialWeight) < 0) {
      showNotice("식자재 중량을 올바르게 입력해주세요.", "error");
      return;
    }
    if (!foodMaterialPrice || Number(foodMaterialPrice) < 0) {
      showNotice("가격을 올바르게 입력해주세요.", "error");
      return;
    }
    if (!foodMaterialType) {
      showNotice("타입을 입력해주세요.", "error");
      return;
    }
    if (!vender) {
      showNotice("구입처를 입력해주세요.", "error");
      return;
    }
    if (!expirationDate) {
      showNotice("유통기한을 입력해주세요.", "error");
      return;
    }
    if (expirationDate < income) {
      showNotice("유통기한이 매입일자보다 이전입니다.", "error");
      return;
    }

    setPendingList((prev) => [
      ...prev,
      {
        foodMaterialName: foodMaterialName,
        foodCategory_Id: selectedCategoryId,
        foodCategoryName: getSelectedCategoryName(),
        foodMaterialCount,
        foodMaterialWeight,
        unit: inputUnit,
        foodMaterialPrice,
        foodMaterialType,
        vender: vender,
        incomeDate: income,
        expirationDate,
      },
    ]);

    clearInputs();
  }

  function clearInputs() {
    setFoodMaterialName("");
    setFoodMaterialCount("");
    setFoodMaterialWeight("");
    setInputUnit("g");
    setFoodMaterialPrice("");
    setFoodMaterialType("");
    setVender("");
    setExpirationDate("");
    setIncomeDate(today());
    setSelectedCategoryId("");
  }

  function removeRow(index: number) {
    setPendingList((prev) => prev.filter((_, i) => i !== index));
  }

  async function searchMaterial() {
    const keyword = searchInput;
    if (!keyword) {
      setSearchResult(null);
      return;
    }
    try {
      const res = await client.get<SearchItem[]>(
        "/api/foodmaterial/search/add/" + encodeURIComponent(keyword),
      );
      setSearchResult(Array.isArray(res.data) ? res.data : []);
    } catch {
      showNotice("검색 중 오류가 발생했습니다.", "error");
      setSearchResult([]);
    }
  }

  function fillFromSearch(data: SearchItem) {
    setFoodMaterialName(data.foodMaterialName);
    setVender(data.vender);
    setFoodMaterialType(data.foodMaterialType || "");

    const matched = categoryList.find(
      (c) => c.foodCategory === data.foodCategory,
    );
    setSelectedCategoryId(matched ? matched.foodCategoryId : "");

    showNotice(
      '"' + data.foodMaterialName + '" 정보를 불러왔습니다.',
      "success",
    );
  }

  async function registerAll() {
    if (pendingList.length === 0) {
      showNotice("등록할 식자재가 없습니다.", "error");
      return;
    }

    const formData = new FormData();
    pendingList.forEach((item) => {
      formData.append("foodMaterialName", item.foodMaterialName);
      formData.append("foodCategory_Id", item.foodCategory_Id);
      formData.append("foodMaterialCount", item.foodMaterialCount);
      formData.append("foodMaterialWeight", item.foodMaterialWeight);
      formData.append("foodMaterialPrice", item.foodMaterialPrice);
      formData.append("foodMaterialType", item.foodMaterialType);
      formData.append("vender", item.vender);
      formData.append("incomeDate", item.incomeDate);
      formData.append("expirationDate", item.expirationDate);
    });

    try {
      const res = await client.post<AddFoodMaterialResult>(
        "/api/foodmaterial/add",
        formData,
      );

      if (!res.data || res.data.result === "success") {
        showNotice("식자재 등록에 성공했습니다.", "success");
        setPendingList([]);
      } else {
        showNotice(res.data.message ?? "식자재 등록에 실패했습니다.", "error");
      }
    } catch {
      showNotice("식자재 등록 중 오류가 발생했습니다.", "error");
    }
  }

  return (
    <div className="container">
      <section>
        <Sidebar />
      </section>

      <div className="main">
        <div>
          <Header />
        </div>

        <h1>식자재 입력</h1>

        {notice && (
          <div className={`notice notice_${notice.type}`}>{notice.text}</div>
        )}

        <div className="content_item">
          <div className="content_left">
            <div className="input_section">
              <div className="input_row">
                <div className="category_buttons">
                  <label>카테고리 추가</label>
                  <Input
                    text=""
                    inputType="text"
                    // id="getFoodCategory"
                    // name="foodCategory"
                    placeholder="카테고리 입력"
                    value={newCategory}
                    onChange={(value) => setNewCategory(value)}
                  />
                  <Button type="button" onClick={addCategoryAjax}>
                    추가
                  </Button>
                </div>
              </div>

              <div className="input_row">
                <div className="category_buttons" id="categoryArea">
                  {categoryList.map((category) => (
                    <span
                      key={category.foodCategoryId}
                      className="category_item"
                    >
                      <Button
                        type="button"
                        className={
                          selectedCategoryId === category.foodCategoryId
                            ? "selected"
                            : ""
                        }
                        onClick={() => selectCategory(category.foodCategoryId)}
                        data-category-id={category.foodCategoryId}
                      >
                        {category.foodCategory}
                      </Button>
                      <Button
                        type="button"
                        className="remove_btn"
                        data-category-name={category.foodCategory}
                        onClick={() => deleteCategoryAjax(category)}
                      >
                        &#10005;
                      </Button>
                    </span>
                  ))}
                </div>
              </div>
              <div id="categoryMsg"></div>
            </div>

            <div className="input_section">
              <div className="input_row">
                <label>식자재명 입력 *</label>
                <Input
                  text=""
                  inputType="text"
                  // id="foodMaterialName"
                  placeholder="단무지"
                  value={foodMaterialName}
                  onChange={(value) => setFoodMaterialName(value)}
                />
              </div>

              <div className="input_fields">
                <label>총 중량</label>
                <input
                  type="number"
                  id="totalWeight"
                  placeholder="자동 계산"
                  readOnly
                  value={totalWeight}
                  className="readonly_field"
                />

                <label>식자재중량(개당, 단위:g) *</label>
                <Input
                  text=""
                  inputType="number"
                  // id="foodMaterialWeight"
                  placeholder="1500"
                  min={0}
                  value={foodMaterialWeight}
                  onChange={(value) => setFoodMaterialWeight(value)}
                />

                <select
                  id="inputUnit"
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value)}
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                </select>
              </div>

              <div className="input_fields">
                <label>총 가격</label>
                <input
                  type="number"
                  id="totalPrice"
                  placeholder="자동 계산"
                  readOnly
                  value={totalPrice}
                  className="readonly_field"
                />

                <label>가격(개당) *</label>
                <Input
                  text=""
                  inputType="number"
                  // id="foodMaterialPrice"
                  placeholder="10000"
                  min={0}
                  value={foodMaterialPrice}
                  onChange={(value) => setFoodMaterialPrice(value)}
                />
              </div>

              <div className="input_fields">
                <label>구매 수량 *</label>
                <Input
                  text=""
                  inputType="number"
                  // id="foodMaterialCount"
                  placeholder="5"
                  min={0}
                  value={foodMaterialCount}
                  onChange={(value) => setFoodMaterialCount(value)}
                />

                <label>타입 *</label>
                <select
                  id="foodMaterialType"
                  value={foodMaterialType}
                  onChange={(e) => setFoodMaterialType(e.target.value)}
                >
                  <option value="">선택</option>
                  <option value="고체">고체</option>
                  <option value="액체">액체</option>
                  <option value="기타">기타</option>
                </select>

                <label>구입처 *</label>
                <Input
                  text=""
                  inputType="text"
                  // id="vender"
                  placeholder="하나로마트"
                  value={vender}
                  onChange={(value) => setVender(value)}
                />
              </div>

              <div className="input_fields">
                <label>매입일자</label>
                <Input
                  text=""
                  inputType="date"
                  // id="incomeDate"
                  value={incomeDate}
                  onChange={(value) => setIncomeDate(value)}
                />
                <span className="auto_date_hint"></span>

                <label>유통기한 *</label>
                <Input
                  text=""
                  inputType="date"
                  // id="expirationDate"
                  value={expirationDate}
                  onChange={(value) => setExpirationDate(value)}
                />
                <span>&#10003;</span>
              </div>

              <div className="register_btn">
                <Button type="button" onClick={addToList}>
                  추가
                </Button>
              </div>
            </div>

            <div className="search_section">
              <h3>기존 식자재 찾기</h3>

              <div className="search_row">
                <label>검색</label>
                <Input
                  text=""
                  inputType="text"
                  // id="searchInput"
                  placeholder="단무지"
                  value={searchInput}
                  onChange={(value) => setSearchInput(value)}
                />
                <Button type="button" onClick={searchMaterial}>
                  검색
                </Button>
              </div>

              <div className="search_row">
                <span>기존에 등록된 식자재 목록</span>
              </div>

              <div>
                <table className="list_container">
                  <thead>
                    <tr className="list_item">
                      <th>이름</th>
                      <th>카테고리</th>
                      <th>구입처</th>
                      <th>타입</th>
                      <th>추가</th>
                    </tr>
                  </thead>

                  <tbody id="searchResultBody">
                    {searchResult === null ? (
                      <tr>
                        <td colSpan={5} className="empty_msg">
                          검색어를 입력하세요
                        </td>
                      </tr>
                    ) : searchResult.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty_msg">
                          검색결과가 없습니다
                        </td>
                      </tr>
                    ) : (
                      searchResult.map((m, idx) => (
                        <tr key={idx}>
                          <td>{m.foodMaterialName}</td>
                          <td>{m.foodCategory}</td>
                          <td>{m.vender}</td>
                          <td>{m.foodMaterialType}</td>
                          <td>
                            <Button
                              type="button"
                              onClick={() => fillFromSearch(m)}
                            >
                              +
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="content_right">
            <h3>등록할 식자재 목록</h3>

            <table id="registerTable">
              <thead>
                <tr>
                  <th>식자재명</th>
                  <th>카테고리</th>
                  <th>구매수량</th>
                  <th>중량</th>
                  <th>총 가격</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody id="registerBody">
                {pendingList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty_msg">
                      추가된 식자재가 없습니다
                    </td>
                  </tr>
                ) : (
                  pendingList.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.foodMaterialName}</td>
                      <td>{item.foodCategoryName}</td>
                      <td>{item.foodMaterialCount}</td>
                      <td>
                        {item.foodMaterialWeight}
                        {item.unit}
                      </td>
                      <td>
                        {Number(item.foodMaterialPrice).toLocaleString()}원
                      </td>
                      <td>
                        <span
                          className="remove_btn"
                          onClick={() => removeRow(idx)}
                        >
                          &#10005;
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div id="hiddenFields"></div>
            <div className="register_final_btn">
              <Button type="submit" onClick={registerAll}>
                식자재 등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFoodMaterialsPage;
