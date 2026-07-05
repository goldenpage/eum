import { useState, useEffect } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./purchasePage.css";

interface PurchaseItem {
  purchaseId: number;
  foodMaterialName: string;
  foodMaterialCount: number;
  foodMaterialWeight: number;
  totalWeight: number;
  foodMaterialPrice: number;
  totalPrice: number;
  vender: string;
  incomeDate: string;
  expirationDate: string;
}

function PuchasePage() {
  const [purchaseList, setPurchaseList] = useState<PurchaseItem[]>([]);

  async function loadPurchaseList() {
    try {
      const res = await client.get<PurchaseItem[]>("/api/purchase");
      if (Array.isArray(res.data)) {
        setPurchaseList(res.data);
      } else {
        console.warn("구매 내역 응답이 배열이 아님:", res.data);
      }
    } catch (e) {
      console.error("구매 내역 불러오기 실패", e);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPurchaseList();
  }, []);

  return (
    <div className="container">
      <section>
        <Sidebar />
      </section>

      <div className="main">
        <Header />
        <h1>구매 내역</h1>

        <div className="table_scroll">
          <table className="list_container">
            <thead>
              <tr>
                <th>식자재 이름</th>
                <th>구매 수량</th>
                <th>개당 중량</th>
                <th>총 중량</th>
                <th>개당 가격</th>
                <th>총 구매가격</th>
                <th>구매처</th>
                <th>매입 날짜</th>
                <th>유통기한</th>
              </tr>
            </thead>
            <tbody>
              {purchaseList.length === 0 ? (
                <tr>
                  <td colSpan={9}>구매 내역이 없습니다.</td>
                </tr>
              ) : (
                purchaseList.map((purchase) => (
                  <tr key={purchase.purchaseId}>
                    <td>{purchase.foodMaterialName}</td>
                    <td>{purchase.foodMaterialCount}</td>
                    <td>{purchase.foodMaterialWeight}</td>
                    <td>{purchase.totalWeight}</td>
                    <td>{purchase.foodMaterialPrice.toLocaleString()}</td>
                    <td>{purchase.totalPrice.toLocaleString()}</td>
                    <td>{purchase.vender}</td>
                    <td>{purchase.incomeDate}</td>
                    <td>{purchase.expirationDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PuchasePage;
