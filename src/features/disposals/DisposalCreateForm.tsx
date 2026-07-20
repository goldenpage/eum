import Button from "../../components/Button";
import Input from "../../components/Input";
import type { FoodMaterialDto } from "../../types/dto/FoodMaterialDto";
import { DISPOSAL_REASONS } from "./constants";
interface DisposalCreateFormValue {
  foodMaterialId: string;
  reasonId: string;
  disposalCountAll: string;
  disposalDate: string;
}

interface DisposalCreateFormProps {
  form: DisposalCreateFormValue;
  foodMaterials: FoodMaterialDto[];
  selectedFoodMaterial: FoodMaterialDto | null;
  disposalPrice: number;
  isLoadingOptions: boolean;
  isSubmitting: boolean;
  onChange: (field: keyof DisposalCreateFormValue, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function DisposalCreateForm({
  form,
  foodMaterials,
  selectedFoodMaterial,
  disposalPrice,
  isLoadingOptions,
  isSubmitting,
  onChange,
  onSubmit,
  onReset,
}: DisposalCreateFormProps) {
  return (
    <form
      className="disposal-create-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="disposal-create-field">
        <span>식자재</span>
        <select
          value={form.foodMaterialId}
          onChange={(event) => onChange("foodMaterialId", event.target.value)}
          disabled={isLoadingOptions || isSubmitting}
          className="disposal-create-select"
          name="foodMaterialId"
        >
          <option value="">
            {isLoadingOptions ? "시자재 불러오는 중" : "식자재 선택"}
          </option>
          {foodMaterials.map((foodMaterial) => (
            <option
              key={foodMaterial.foodMaterialId}
              value={foodMaterial.foodMaterialId}
            >
              {foodMaterial.foodMaterialName} ({foodMaterial.foodMaterialId})
            </option>
          ))}
        </select>
      </label>
      {selectedFoodMaterial && (
        <div className="disposal-create-stock" aria-live="polite">
          현재 재고 중량 : {selectedFoodMaterial.totalWeight.toLocaleString()}g
        </div>
      )}
      <label className="disposal-create-field">
        <span>폐기 사유</span>
        <select
          value={form.reasonId}
          onChange={(event) => onChange("reasonId", event.target.value)}
          disabled={isSubmitting}
          className="disposal-create-select"
          name="reasonId"
        >
          <option value="">폐기 사유 선택</option>
          {DISPOSAL_REASONS.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
      </label>
      <div className="disposal-create-field">
        <Input
          text="총 폐기용량(g)"
          inputType="number"
          value={form.disposalCountAll}
          onChange={(value) => onChange("disposalCountAll", value)}
          min={1}
          name="disposalCountAll"
        />
      </div>
      <div className="disposal-create-field">
        <span>총 폐기가격</span>
        <strong>{disposalPrice.toLocaleString()}원</strong>
      </div>
      <div className="disposal-create-field">
        <Input
          text="폐기일"
          inputType="date"
          value={form.disposalDate}
          onChange={(value) => onChange("disposalDate", value)}
          name="disposalDate"
        />
      </div>
      <div className="disposal-create-actions">
        <Button type="submit" className="disposal-create-submit">
          {isSubmitting ? "등록 중" : "등록"}
        </Button>
        <Button type="button" onClick={onReset}>
          초기화
        </Button>
      </div>
    </form>
  );
}
