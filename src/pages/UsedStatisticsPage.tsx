import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import Sidebar from "../components/Sidebar";
import "./UsedStatisticsPage.css";

function getCurrentMonth(){
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function UsedStatisticsPage() {
  const [selectedMonth, setSelectedMonth]=useState(getCurrentMonth);

  function onSearch(){
  console.log(selectedMonth);
}

  return (
    <div className="container">
      <section>
        <Sidebar />
      </section>

      <main className="main">
        <div>
          <Header />
        </div>

        <div className="used-statistics-top">
          <h1>지출 통계</h1>

          <div className="used-statistics-search-area">
            <Input 
            text="조회 월"
            inputType="month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            />

            <Button type="button" onClick={onSearch}>조회</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UsedStatisticsPage;
