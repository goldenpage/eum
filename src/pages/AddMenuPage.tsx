import { useState, useEffect } from "react";
import axios from "axios";

const client = axios.create({
  baseURL: "/",
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

interface FoodMaterialListItem {
  foodMaterialId: string;
  foodMaterialName: string;
  foodCategory: string;
}

interface MenuCategoryItem {
  menuCategoryId: string;
  menuCategory: string;
}

interface AddCategoryResult {
  result: "success" | "fail";
  message?: string;
  menuCategoryId?: string;
  menuCategory?: string;
}

interface DeleteCategoryResult {
  result: "success" | "fail";
  message?: string;
}

interface AddMenuResult {
  result: "success" | "fail";
  message?: string;
}

interface IngredientItem {
  foodMaterialId: string;
  foodMaterialName: string;
  usedCount: string;
}

interface PendingMenu {
  menuName: string;
  menuCategoryId: string;
  menuCategory: string;
  menuPrice: string;
  ingredients: IngredientItem[];
}

interface Msg {
  text: string;
  color: "green" | "red";
}

function AddMenuPage() {
  const [categoryList, setCategoryList] = useState<MenuCategoryItem[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryMsg, setCategoryMsg] = useState<Msg | null>(null);

  const [foodMaterialList, setFoodMaterialList] = useState<
    FoodMaterialListItem[]
  >([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [ingredientList, setIngredientList] = useState<IngredientItem[]>([]);
  const [pendingList, setPendingList] = useState<PendingMenu[]>([]);
  const [selectedMenuName, setSelectedMenuName] = useState<string | null>(null);

  async function loadFoodMaterialList() {
    try {
      const res = await client.get<FoodMaterialListItem[]>(
        "/api/menu/foodmaterial/list",
      );
      // setFoodMaterialList(res.data);
      if (Array.isArray(res.data)) {
        setFoodMaterialList(res.data);
      } else {
        console.warn("식자재 목록 응답이 배열이 아님:", res.data);
      }
    } catch (e) {
      console.error("식자재 목록 불러오기 실패", e);
    }
  }

  async function loadMenuCategoryList() {
    try {
      const res = await client.get<MenuCategoryItem[]>(
        "/api/menu/menucategory/list",
      );
      // setCategoryList(res.data);
      if (Array.isArray(res.data)) {
        // ← 여기부터
        setCategoryList(res.data);
      } else {
        console.warn("카테고리 목록 응답이 배열이 아님:", res.data);
      }
    } catch (e) {
      console.error("카테고리 목록 불러오기 실패", e);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFoodMaterialList();

    loadMenuCategoryList();
  }, []);

  function selectCategory(categoryId: string) {
    setSelectedCategoryId(categoryId);
  }

  async function addCategoryAjax() {
    const categoryName = newCategory.trim();
    if (!categoryName) {
      alert("카테고리명을 입력해주세요");
      return;
    }
    try {
      const res = await client.post<AddCategoryResult>(
        "/api/menu/menucategory/add",
        { menuCategory: categoryName },
      );
      const data = res.data;
      if (data.result === "success") {
        setCategoryMsg({ text: "카테고리가 추가되었습니다,", color: "green" });
        setCategoryList((prev) => [
          ...prev,
          {
            menuCategoryId: data.menuCategoryId ?? "",
            menuCategory: data.menuCategory ?? categoryName,
          },
        ]);
        setNewCategory("");
      } else {
        setCategoryMsg({ text: data.message ?? "추가 실패", color: "red" });
      }
    } catch {
      setCategoryMsg({ text: "카테고리 추가 중 오류 발생", color: "red" });
    }
  }

  async function deleteCategoryAjax(category: MenuCategoryItem) {
    if (!confirm(category.menuCategory + " 카테고리를 삭제하시겠습니까?"))
      return;
    try {
      const res = await client.delete<DeleteCategoryResult>(
        "/api/menu/menucategory/delete",
        { data: { menuCategory: category.menuCategory } },
      );
      const data = res.data;
      if (data.result === "success") {
        setCategoryMsg({
          text: data.message ?? "삭제되었습니다.",
          color: "green",
        });
        if (selectedCategoryId === category.menuCategoryId) {
          setSelectedCategoryId("");
        }
        setCategoryList((prev) =>
          prev.filter((c) => c.menuCategoryId !== category.menuCategoryId),
        );
      } else {
        setCategoryMsg({ text: data.message ?? "삭제 실패", color: "red" });
      }
    } catch {
      setCategoryMsg({
        text: "카테고리 삭제 중 오류가 발생했습니다.",
        color: "red",
      });
    }
  }

  function addIngredient() {
    if (!selectedMaterialId) {
      alert("식자재를 선택해주세요.");
      return;
    }
    if (!ingredientAmount || Number(ingredientAmount) <= 0) {
      alert("수량을 올바르게 입력해주세요.");
      return;
    }
    const material = foodMaterialList.find(
      (fm) => fm.foodMaterialId === selectedMaterialId,
    );
    if (!material) return;

    setIngredientList((prev) => [
      ...prev,
      {
        foodMaterialId: material.foodMaterialId,
        foodMaterialName: material.foodMaterialName,
        usedCount: ingredientAmount,
      },
    ]);
    setSelectedMaterialId("");
    setIngredientAmount("");
  }

  function removeIngredientRow(foodMaterialId: string) {
    setIngredientList((prev) =>
      prev.filter((i) => i.foodMaterialId !== foodMaterialId),
    );
  }

  function getSelectedCategoryName() {
    const c = categoryList.find((c) => c.menuCategoryId === selectedCategoryId);
    return c ? c.menuCategory : "";
  }

  function addMenuToList() {
    const name = menuName.trim();

    if (!name) {
      alert("메뉴명을 입력해주세요.");
      return;
    }
    if (!selectedCategoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!menuPrice || Number(menuPrice) < 0) {
      alert("메뉴 가격을 올바르게 입력해주세요.");
      return;
    }
    if (ingredientList.length === 0) {
      alert("사용 식자재를 추가해주세요.");
      return;
    }

    const isDuplicate = pendingList.some((m) => m.menuName === name);
    if (isDuplicate) {
      alert('"' + name + '"은 이미 등록된 메뉴입니다.');
      return;
    }

    setPendingList((prev) => [
      ...prev,
      {
        menuName: name,
        menuCategoryId: selectedCategoryId,
        menuCategory: getSelectedCategoryName(),
        menuPrice: menuPrice,
        ingredients: ingredientList,
      },
    ]);

    setMenuName("");
    setMenuPrice("");
    setSelectedCategoryId("");
    setIngredientList([]);
  }

  function removeMenuRow(name: string) {
    setPendingList((prev) => prev.filter((m) => m.menuName !== name));
    if (selectedMenuName === name) {
      setSelectedMenuName(null);
    }
  }

  function showIngredientDetail(name: string) {
    setSelectedMenuName(name);
  }

  async function registerAllMenus() {
    if (pendingList.length === 0) {
      alert("등록할 메뉴가 없습니다.");
      return;
    }

    const formData = new FormData();
    pendingList.forEach((item) => {
      formData.append("menuName", item.menuName);
      formData.append("menuPrice", item.menuPrice);
      formData.append("menuCategoryId", item.menuCategoryId);
      formData.append("menuIngredientCount", String(item.ingredients.length));

      item.ingredients.forEach((used) => {
        formData.append("foodMaterialId", used.foodMaterialId);
        formData.append("usedCount", used.usedCount);
      });
    });

    try {
      const res = await client.post<AddMenuResult>("/api/menu/add", formData);
      const data = res.data;
      if (data.result === "success") {
        alert(data.message);
        setPendingList([]);
        setSelectedMenuName(null);
      } else {
        alert(data.message);
      }
    } catch {
      alert("메뉴 등록 중 오류 발생");
    }
  }

  const selectedMenu =
    pendingList.find((m) => m.menuName === selectedMenuName) ?? null;

  return (
    <div className="container">
      <section>{}</section>

      <div className="main">
        <div>{}</div>
        <h1>메뉴 입력</h1>

        <div className="content_item">
          <div className="content_left">
            <div className="input_section">
              <div className="input_row">
                <div className="category_buttons">
                  <label>메뉴 카테고리 추가</label>
                  <input
                    type="text"
                    id="getMenuCategory"
                    placeholder="카테고리 입력"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button type="button" onClick={addCategoryAjax}>
                    추가
                  </button>
                </div>
              </div>

              <div className="input_row">
                <div className="category_buttons" id="categoryArea">
                  {categoryList.map((category) => (
                    <span
                      key={category.menuCategoryId}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <button
                        type="button"
                        className={
                          selectedCategoryId === category.menuCategoryId
                            ? "selected"
                            : ""
                        }
                        onClick={() => selectCategory(category.menuCategoryId)}
                        data-category-id={category.menuCategoryId}
                      >
                        {category.menuCategory}
                      </button>
                      <button
                        type="button"
                        className="remove_btn"
                        data-category-name={category.menuCategory}
                        onClick={() => deleteCategoryAjax(category)}
                      >
                        &#10005;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div
                id="categoryMsg"
                style={{
                  fontSize: "13px",
                  marginBottom: "8px",
                  color: categoryMsg?.color,
                }}
              >
                {categoryMsg?.text}
              </div>
            </div>

            <input
              type="hidden"
              id="selectedCategoryId"
              name="_dummy"
              value={selectedCategoryId}
              readOnly
            />

            <div className="input_section">
              <div className="input_row">
                <label>메뉴명 입력 *</label>
                <input
                  type="text"
                  id="inputMenuName"
                  placeholder="치즈김밥"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                />
              </div>

              <div className="input_fields">
                <label>메뉴 가격 *</label>
                <input
                  type="number"
                  id="inputMenuPrice"
                  placeholder="4000"
                  min={0}
                  value={menuPrice}
                  onChange={(e) => setMenuPrice(e.target.value)}
                />{" "}
                원
              </div>
            </div>

            <div className="ingredient_section">
              <h3>사용 식자재 추가 *</h3>

              <div className="ingredient_add_row">
                <label>식자재</label>
                <select
                  id="inputIngredientSelect"
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                >
                  <option value="">-- 선택 --</option>
                  {foodMaterialList.map((fm) => (
                    <option
                      key={fm.foodMaterialId}
                      value={fm.foodMaterialId}
                      data-name={fm.foodMaterialName}
                    >
                      {fm.foodMaterialName} ({fm.foodCategory})
                    </option>
                  ))}
                </select>
                <label>수량</label>
                <input
                  type="number"
                  id="inputIngredientAmount"
                  placeholder="50"
                  min={1}
                  value={ingredientAmount}
                  onChange={(e) => setIngredientAmount(e.target.value)}
                />
                <span>g</span>
                <button type="button" onClick={addIngredient}>
                  + 추가하기
                </button>
              </div>

              <div className="ingredient_table">
                <table id="ingredientTable">
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>수량(g)</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody id="ingredientBody">
                    {ingredientList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="empty_msg">
                          추가된 식자재가 없습니다
                        </td>
                      </tr>
                    ) : (
                      ingredientList.map((ing) => (
                        <tr
                          key={ing.foodMaterialId}
                          data-food-material-id={ing.foodMaterialId}
                          data-used-count={ing.usedCount}
                        >
                          <td>{ing.foodMaterialName}</td>
                          <td>{Number(ing.usedCount).toLocaleString()}g</td>
                          <td>
                            <span
                              className="remove_btn"
                              onClick={() =>
                                removeIngredientRow(ing.foodMaterialId)
                              }
                            >
                              &#8854;
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="register_btn">
              <button type="button" onClick={addMenuToList}>
                추가
              </button>
            </div>

            <div id="hiddenFields"></div>
          </div>

          <div className="content_right">
            <h3>등록할 메뉴 목록</h3>

            <div className="right_top">
              <table id="registerMenuTable" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>메뉴명</th>
                    <th>카테고리</th>
                    <th>가격</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody id="registerMenuBody">
                  {pendingList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty_msg">
                        추가된 메뉴가 없습니다
                      </td>
                    </tr>
                  ) : (
                    pendingList.map((menu) => (
                      <tr
                        key={menu.menuName}
                        data-menu-name={menu.menuName}
                        className={
                          selectedMenuName === menu.menuName
                            ? "selected_row"
                            : ""
                        }
                        onClick={() => showIngredientDetail(menu.menuName)}
                      >
                        <td>{menu.menuName}</td>
                        <td>{menu.menuCategory}</td>
                        <td>{Number(menu.menuPrice).toLocaleString()}원</td>
                        <td>
                          <span
                            className="remove_btn"
                            onClick={(e) => {
                              // 행 클릭(상세 표시)과 삭제가 겹치지 않도록 전파 차단
                              e.stopPropagation();
                              removeMenuRow(menu.menuName);
                            }}
                          >
                            &#10005;
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="right_bottom">
              <div className="register_final_btn">
                <button type="button" onClick={registerAllMenus}>
                  메뉴 등록
                </button>
              </div>
              <h4>
                &#9660; 사용 식자재 (
                <span id="selectedMenuName">
                  {selectedMenu ? selectedMenu.menuName : "메뉴를 선택하세요"}
                </span>
                )
              </h4>
              <table className="ingredient_detail_table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>수량(g)</th>
                  </tr>
                </thead>
                <tbody id="ingredientDetailBody">
                  {selectedMenu ? (
                    selectedMenu.ingredients.map((ing) => (
                      <tr key={ing.foodMaterialId}>
                        <td>{ing.foodMaterialName}</td>
                        <td>{ing.usedCount}g</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="empty_msg">
                        -
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMenuPage;
