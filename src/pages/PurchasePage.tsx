import { useState, useEffect, useRef } from "react";
import client from "../api/client";
import "../pages/css/PurchasePage.css";
import Button from "../components/Button";
import Input from "../components/Input";

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

const PAGE_SIZE = 7;

function today() {
  return new Date().toISOString().substring(0, 10);
}

function weekAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().substring(0, 10);
}

function filterPurchaseList(
  list: PurchaseItem[],
  keyword: string,
  startDate: string,
  endDate: string,
) {
  return list.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.foodMaterialName.includes(keyword) ||
      item.vender.includes(keyword);
    const matchesStart = !startDate || item.incomeDate >= startDate;
    const matchesEnd = !endDate || item.incomeDate <= endDate;

    return matchesKeyword && matchesStart && matchesEnd;
  });
}

function PuchasePage() {
  const [allPurchaseList, setAllPurchaseList] = useState<PurchaseItem[]>([]);
  const [filteredList, setFilteredList] = useState<PurchaseItem[]>([]);
  const [purchaseList, setPurchaseList] = useState<PurchaseItem[]>([]);

  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState(weekAgo());
  const [endDate, setEndDate] = useState(today());

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const scrollRef = useRef<HTMLDivElement>(null);

  async function loadPurchaseList() {
    try {
      setIsLoading(true);

      const res = await client.get<PurchaseItem[]>("/api/purchase");
      if (Array.isArray(res.data)) {
        const data = res.data;
        setAllPurchaseList(data);

        const result = filterPurchaseList(data, "", weekAgo(), today());
        setFilteredList(result);
        setPurchaseList(result.slice(0, PAGE_SIZE));
        setCurrentPage(1);
        setTotalPage(Math.max(1, Math.ceil(result.length / PAGE_SIZE)));
      } else {
        console.warn("구매 내역 응답이 배열이 아님:", res.data);
      }
    } catch (e) {
      console.error("구매 내역 불러오기 실패", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPurchaseList();
  }, []);

  function runSearch(nextKeyword: string, nextStart: string, nextEnd: string) {
    const result = filterPurchaseList(
      allPurchaseList,
      nextKeyword,
      nextStart,
      nextEnd,
    );

    setFilteredList(result);
    setPurchaseList(result.slice(0, PAGE_SIZE));
    setCurrentPage(1);
    setTotalPage(Math.max(1, Math.ceil(result.length / PAGE_SIZE)));
  }

  function onSearch() {
    runSearch(keyword.trim(), startDate, endDate);
  }

  function onStartDateChange(value: string) {
    setStartDate(value);
    runSearch(keyword.trim(), value, endDate);
  }

  function onEndDateChange(value: string) {
    setEndDate(value);
    runSearch(keyword.trim(), startDate, value);
  }

  function onAllList() {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setFilteredList(allPurchaseList);
    setPurchaseList(allPurchaseList.slice(0, PAGE_SIZE));
    setCurrentPage(1);
    setTotalPage(Math.max(1, Math.ceil(allPurchaseList.length / PAGE_SIZE)));
  }

  function loadNextPurchases() {
    if (isLoading || isLoadingMore) return;
    if (currentPage >= totalPage) return;

    setIsLoadingMore(true);

    const nextPage = currentPage + 1;
    setPurchaseList(filteredList.slice(0, nextPage * PAGE_SIZE));
    setCurrentPage(nextPage);

    setIsLoadingMore(false);
  }

  function onTableScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 40;

    if (isNearBottom) {
      loadNextPurchases();
    }
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isLoading || isLoadingMore) return;
    if (currentPage >= totalPage) return;

    if (el.scrollHeight <= el.clientHeight) {
      loadNextPurchases();
    }
  }, [purchaseList, isLoading, isLoadingMore, currentPage, totalPage]);

  return (
    <div className="purchase_page">
      <div className="main">
        <h1>구매 내역</h1>

        <div className="purchase-toolbar">
          <Input
            text=""
            inputType="text"
            value={keyword}
            onChange={setKeyword}
            placeholder="식자재이름 or 구매처 입력"
            width={220}
            height={30}
          />

          <div className="purchase-date-range">
            <div>매입날짜</div>
            <div className="purchase-date-range__inputs">
              <Input
                text=""
                inputType="date"
                value={startDate}
                onChange={onStartDateChange}
                height={30}
              />
              <span>~</span>
              <Input
                text=""
                inputType="date"
                value={endDate}
                onChange={onEndDateChange}
                height={30}
              />
            </div>
          </div>

          <Button type="button" onClick={onSearch}>
            검색
          </Button>
          <Button type="button" onClick={onAllList}>
            전체 조회
          </Button>
        </div>

        <div className="table_scroll" ref={scrollRef} onScroll={onTableScroll}>
          <table className="list_container">
            <thead>
              <tr>
                <th>이름</th>
                <th>구매 수량</th>
                <th className="col-only-desktop">개당 중량</th>
                <th className="col-only-desktop">총 중량</th>
                <th className="col-only-desktop">개당 가격</th>
                <th>총 가격</th>
                <th>구매처</th>
                <th>매입날짜</th>
                <th className="col-only-desktop">유통기한</th>
              </tr>
            </thead>
            <tbody>
              {purchaseList.length === 0 ? (
                <tr>
                  <td colSpan={9}>구매 내역이 없습니다.</td>
                </tr>
              ) : (
                <>
                  {purchaseList.map((purchase) => (
                    <tr key={purchase.purchaseId}>
                      <td>{purchase.foodMaterialName}</td>
                      <td>{purchase.foodMaterialCount}</td>
                      <td className="col-only-desktop">
                        {purchase.foodMaterialWeight}
                      </td>
                      <td className="col-only-desktop">
                        {purchase.totalWeight}
                      </td>
                      <td className="col-only-desktop">
                        {purchase.foodMaterialPrice.toLocaleString()}
                      </td>
                      <td>{purchase.totalPrice.toLocaleString()}</td>
                      <td>{purchase.vender}</td>
                      <td>{purchase.incomeDate}</td>
                      <td className="col-only-desktop">
                        {purchase.expirationDate}
                      </td>
                    </tr>
                  ))}
                  {isLoadingMore && (
                    <tr>
                      <td colSpan={9}>다음 구매 내역을 불러오는 중입니다.</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PuchasePage;
