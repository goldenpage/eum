import { useEffect, useState } from "react";
import client from "../api/client";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import Sidebar from "../components/Sidebar";
import type { MenuDto, MenuListResponse, MenuMaterialDto, MenuMaterialListResponse, SaleRequest, SaleResponse, MenuDeleteResponse } from "../types/dto/MenuDto";
import "./MenuListPage.css";

function formatMoney(value: number) {
  return `${value.toLocaleString()}원`;
}

function MenuListPage() {
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [selectedMenu, setSelectedMenu] =useState<MenuDto | null>(null);
  const [materials, setMaterials] =useState<MenuMaterialDto[]>([]);
  const [saleCount, setSaleCount]=useState(1);
  const [payment, setPayment] =useState("카드");
  const [isLoading, setIsLoading] =useState(false);
  const [isSelling, setIsSelling] =useState(false);
  const [errorMessage, setErrorMessage] =useState("");
  const [successMessage, setSuccessMessage] =useState("");
  const [deletingMenuId, setDeletingMenuId]=useState<string | null>(null);

  async function loadMenuList(){
    try{
      setIsLoading(true);
      setErrorMessage("");

      const res = await client.get<MenuListResponse>("/api/menus");
      setMenus(res.data.menuList);
    }catch(e){
      console.error("메뉴 목록 불러오기 실패", e);
      setErrorMessage("메뉴 목록을 불러오지 못했습니다.");
    }finally{
      setIsLoading(false);
    }
  }

  async function loadMenuMaterials(menuId: string){
    try{
      setErrorMessage("");

      const res = await client.get<MenuMaterialListResponse>(
        `/api/menus/${menuId}/materials`
      );

      setMaterials(res.data.materialList);
    }catch(e){
      console.error("메뉴 식자재 상세 불러오기 실패", e);
      setErrorMessage("메뉴 식자재 상세를 불러오지 못했습니다.");
      setMaterials([]);
    }
  }
  useEffect(()=>{void loadMenuList();}, []);

  function onSelectMenu(menu: MenuDto){
    setSelectedMenu(menu);
    setMaterials([]);
    setSuccessMessage("");
    loadMenuMaterials(menu.menuId);
  }

  async function onSale(){
    if(selectedMenu === null) {
      setErrorMessage("판매할 메뉴를 먼저 선택하세요.");
      return;
    }

    if (!Number.isInteger(saleCount) || saleCount < 1) {
      setErrorMessage("판매 수량은 1 이상이어야 합니다.");
      return;
    }

    const isConfirmed = window.confirm(
      `${selectedMenu.menuName} ${saleCount}개를 ${payment}으로 판매 처리하시겠습니까?`
    );

    if (!isConfirmed) return;

    try{
      setIsSelling(true);
      setErrorMessage("");
      setSuccessMessage("");

      const request: SaleRequest={
        saleCount, payment
      };

      const res = await client.post<SaleResponse>(
        `/api/menus/${selectedMenu.menuId}/sales`, request
      );

      setSuccessMessage(res.data.message);
      await loadMenuMaterials(selectedMenu.menuId);
    }catch(e){
      console.error("판매 처리 실패", e);
      setErrorMessage(
        "판매 처리에 실패했습니다. 재고 부족 또는 서버 오류를 확인하세요."
      );
    }finally{
      setIsSelling(false);
    }
  }

  async function onDeleteMenu(menu:MenuDto){
    if (deletingMenuId !== null) return;

    const isConfirmed = window.confirm(
      `${menu.menuName} 메뉴를 삭제하시겠습니까?`
    );

    if (!isConfirmed) return;

    try{
      setDeletingMenuId(menu.menuId);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await client.delete<MenuDeleteResponse>(
        `/api/menus/${menu.menuId}`
      );

      if(selectedMenu?.menuId === menu.menuId){
        setSelectedMenu(null);
        setMaterials([]);
      }

      setSuccessMessage(res.data.message);
      await loadMenuList();
    }catch(e) {
      console.error("메뉴 삭제 실패", e);
      setErrorMessage("메뉴 삭제에 실패했습니다. 관련 판매, 사용 식자재 데이터를 확인하세요.");
    }finally {
      setDeletingMenuId(null);
    }
  }





  return(
    <div className="menu-list-page">
      <aside className="menu-list-sidebar">
          <Sidebar />
      </aside>

      <main className="menu-list-main">
        <div className="menu-list-header">
          <Header />
        </div>
        <h1>메뉴 조회</h1>

        {errorMessage &&<p role="alert">{errorMessage}</p>}
        {successMessage &&<p className="menu-list-success">{successMessage}</p>}

        <div className="menu-list-content">
          <section className="menu-list-panel">
            <h2>판매 가능 메뉴</h2>

            {isLoading ? (
              <p>메뉴 목록을 불러오는 중입니다.</p>
            ):menus.length ===0 ? (
              <p>조회된 메뉴가 없습니다.</p>
            ):(
              <table className="menu-list-table">
                <thead>
                  <tr>
                    <th>메뉴명</th>
                    <th>가격</th>
                    <th>카테고리</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr key={menu.menuId} className={selectedMenu?.menuId === menu.menuId ? "menu-list-row--selected" : ""}>
                      <td>
                        <Button type="button" onClick={()=>{onSelectMenu(menu);}}>
                          {menu.menuName}
                        </Button>
                      </td>
                      <td>{formatMoney(menu.menuPrice)}</td>
                      <td>{menu.menuCategory}</td>
                      <td>
                        <Button type="button" onClick={() => void onDeleteMenu(menu)}>
                          {deletingMenuId === menu.menuId ? "삭제 중" : "삭제"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="menu-detail-panel">
            <h2>사용 식자재</h2>

            {selectedMenu ===null ? (
              <p>메뉴를 선택하면 사용 식자재 정보가 표시됩니다.</p>
            ):(
              <>
                <p className="menu-list-selected-name">
                  선택 메뉴: {selectedMenu.menuName}
                </p>

                <table className="menu-list-table">
                  <thead>
                    <tr>
                      <th>식자재명</th>
                      <th>사용량(g)</th>
                      <th>식자재 가격</th>
                      <th>사용 원가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.length ===0 ? (
                      <tr>
                        <td colSpan={4}>사용 식자재 정보가 없습니다.</td>
                      </tr>
                    ):(
                      materials.map((material) => (
                        <tr key={material.foodMaterialId}>
                          <td>{material.foodMaterialName}</td>
                          <td>{material.usedCount.toLocaleString()}</td>
                          <td>{formatMoney(material.foodMaterialPrice)}</td>
                          <td>{formatMoney(material.usedPrice)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="menu-sale-form">
                  <div>
                    <div>결제 수단</div>
                    <label>
                      <input
                        type="radio"
                        value="카드"
                        checked={payment === "카드"}
                        onChange={(event) =>setPayment(event.target.value)}
                      />
                      카드
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="현금"
                        checked={payment==="현금"}
                        onChange={(event) =>setPayment(event.target.value)}
                      />
                      현금
                    </label>
                  </div>

                  <Input
                    text="판매 수량"
                    inputType="number"
                    value={saleCount}
                    onChange={(value) =>setSaleCount(Number(value))}
                    min={1}
                    width={120}
                    height={30}
                  />

                  <Button type="button" onClick={onSale}>
                    {isSelling ? "판매 처리 중" : "판매 처리"}
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default MenuListPage;
