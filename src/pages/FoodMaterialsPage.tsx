import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import Sidebar from "../components/Sidebar";
import type { FoodMaterialDto } from "../types/dto/FoodMaterialDto";

const foodMaterialData: FoodMaterialDto[] =[{
  foodMaterialId: "FM001",
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
  foodMaterialId: "FM002",
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
  foodMaterialId: "FM003",
  foodMaterialName: "홍띵보육포",
  foodCategory: "가공식품",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "손 빼",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",
},
{
  foodMaterialId: "FM004",
  foodMaterialName: "밥",
  foodCategory: "곡류",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "우리쌀",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",},
{
  foodMaterialId: "FM005",
  foodMaterialName: "피카츄",
  foodCategory: "육류",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "한지우",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",},
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
  expirationDate: "2026-12-31",},
{
  foodMaterialId: "FM007",
  foodMaterialName: "홍명보 앞다리살",
  foodCategory: "육류",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "빨명보",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",},
{
  foodMaterialId: "FM008",
  foodMaterialName: "홍명보뒷다리살",
  foodCategory: "육류",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "명보가최고야",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",},
{
  foodMaterialId: "FM009",
  foodMaterialName: "38억",
  foodCategory: "지폐",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "달다달어",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",},
{
  foodMaterialId: "FM010",
  foodMaterialName: "면",
  foodCategory: "면류",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "사리가게",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",},
{
  foodMaterialId: "FM011",
  foodMaterialName: "치즈",
  foodCategory: "발효식품",
  foodMaterialCount: 20,
  foodMaterialWeight: 500,
  totalWeight: 10000,
  foodMaterialPrice: 12000,
  foodMaterialType: "고체",
  vender: "꾸덕꾸덕",
  incomeDate: "2026-06-30",
  expirationDate: "2026-12-31",}
]

function formatNumber(value:number){
  return value.toLocaleString();
}

function formatMoney(value:number){
  return `${value.toLocaleString()}원`;
}

function FoodMaterialsPage() {
  const [keyword, setKeyword]=useState("");
  const [sortType, setSortType]=useState("idDesc");
  const[allFoodMaterials, setAllFoodMaterials] = useState<FoodMaterialDto[]>(foodMaterialData);
  const[foodMaterials, setFoodMaterials]=useState<FoodMaterialDto[]>(foodMaterialData);

  const sortFoodMaterials=(targetFoodMaterials:FoodMaterialDto[], targetSortType:string) =>{
    const sortedFoodMaterials=[...targetFoodMaterials];
    if(targetSortType==="idAsc"){
      sortedFoodMaterials.sort((a,b)=>a.foodMaterialId.localeCompare(b.foodMaterialId));
    }else if(targetSortType==="idDesc"){
      sortedFoodMaterials.sort((a,b)=>b.foodMaterialId.localeCompare(a.foodMaterialId));
    }else if(targetSortType==="expAsc"){
      sortedFoodMaterials.sort((a,b)=>a.expirationDate.localeCompare(b.expirationDate));
    }else if(targetSortType==="expDesc"){
      sortedFoodMaterials.sort((a,b)=>b.expirationDate.localeCompare(a.expirationDate));
    }
    return sortedFoodMaterials;
  }

  const onSortChange=(nextSortType:string)=>{setSortType(nextSortType);
    const sortedFoodMaterials = sortFoodMaterials(foodMaterials, nextSortType);
    setFoodMaterials(sortedFoodMaterials);
  }
  
  const onSearch= () =>{
    const result = allFoodMaterials.filter((foodMaterial)=>foodMaterial.foodMaterialName.includes(keyword))
    const sortedResult=sortFoodMaterials(result, sortType);
    setFoodMaterials(sortedResult);
  }

  const onAllList=()=>{
    setKeyword("");
    const sortedAllFoodMaterials=sortFoodMaterials(allFoodMaterials,sortType);
    setFoodMaterials(sortedAllFoodMaterials);
  }

  const onDelete=(foodMaterialId:string)=>{
    const nextAllFoodMaterials=allFoodMaterials.filter((foodMaterial)=>foodMaterial.foodMaterialId !== foodMaterialId)
    setAllFoodMaterials(nextAllFoodMaterials);

    const nextFoodMaterials=nextAllFoodMaterials.filter((foodMaterial)=>foodMaterial.foodMaterialName.includes(keyword))
    const sortedNextFoodMaterials=sortFoodMaterials(nextFoodMaterials,sortType)
    setFoodMaterials(sortedNextFoodMaterials);
  }



  return (
    <div style={{display:"flex", minHeight:"100vh"}}>
      <aside style={{flex:"0 0 170px"}}>
        <Sidebar />
      </aside>
      <main style={{flex:"1", minWidth:0,padding:"20px",boxSizing:"border-box"}}>
      <div style={{display:"flex", justifyContent:"flex-end"}}>
        <Header />
      </div>
      <h1>식자재 조회</h1>
      <div style={{display:"flex", flexWrap:"wrap",gap:"10px", alignItems:"flex-end", marginBottom:"20px"}}>
        <Input text="식자재명" inputType="text" value={keyword} onChange={setKeyword} placeholder="식자재명을 입력하세요" width={250} height={30}/>

        <label>
          <div>정렬</div>
          <select value={sortType} onChange={(event)=>onSortChange(event.target.value)} style={{height:"36px"}}>
            <option value="idAsc">식자재 번호 오름차순</option>
            <option value="idDesc">식자재 번호 내림차순</option>
            <option value="expAsc">유통기한 임박순</option>
            <option value="expDesc">유통기한 여유순</option>
          </select>
        </label>
        <Button type="button" onClick={onSearch}>검색</Button>
        <Button type="button" onClick={onAllList}>전체 조회</Button>
      </div>
      <div style={{width:"100%", height:"300px",overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:"1200px",borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>식자재 번호</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>식자재명</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>카테고리</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>수량</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>단위 중량</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>총중량</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>매입 가격</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>품목 유형</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>구입처</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>매입일</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>유통기한</th>
              <th style={{position:"sticky",top:0, backgroundColor:"white",zIndex:1}}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {foodMaterials.length===0 ? (
              <tr>
                <td colSpan={12}>조회된 식자재가 없습니다</td>
              </tr>
            ):(foodMaterials.map((foodMaterial)=>(
              <tr key={foodMaterial.foodMaterialId}>
                <td>{foodMaterial.foodMaterialId}</td>
                <td>{foodMaterial.foodMaterialName}</td>
                <td>{foodMaterial.foodCategory}</td>
                <td>{foodMaterial.foodMaterialCount}</td>
                <td>{formatNumber(foodMaterial.foodMaterialWeight)}g</td>
                <td>{formatNumber(foodMaterial.totalWeight)}g</td>
                <td>{formatMoney(foodMaterial.foodMaterialPrice)}</td>
                <td>{foodMaterial.foodMaterialType}</td>
                <td>{foodMaterial.vender}</td>
                <td>{foodMaterial.incomeDate}</td>
                <td>{foodMaterial.expirationDate}</td>
                <td>
                  <button type="button" onClick={()=>onDelete(foodMaterial.foodMaterialId)}> 삭제</button>
                </td>
              </tr>
            )))}
          </tbody>

        </table>

      </div>
      </main>
    </div>
  );
}

export default FoodMaterialsPage;
