import { useCallback, useEffect, useMemo, useState } from "react";
import type { FoodMaterialDto } from "../types/dto/FoodMaterialDto";
import {
  createDisposalItem,
  getDisposalFoodMaterials,
} from "../features/disposals/createApi";

interface DisposalCreateForm {
  foodMaterialId: string;
  reasonId: string;
  disposalCountAll: string;
  disposalDate: string;
}

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function createInitialForm(): DisposalCreateForm {
  return {
    foodMaterialId: "",
    reasonId: "",
    disposalCountAll: "",
    disposalDate: getToday(),
  };
}

export function useDisposalCreate() {
  const [form, setForm] = useState<DisposalCreateForm>(createInitialForm);
  const [foodMaterials, setFoodMaterials] = useState<FoodMaterialDto[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadFoodMaterials = useCallback(async () => {
    setIsLoadingOptions(true);
    setErrorMessage("");

    try {
      setFoodMaterials(await getDisposalFoodMaterials());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "식자재 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFoodMaterials();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadFoodMaterials]);

  const selectedFoodMaterial = useMemo(
    () =>
      foodMaterials.find(
        (foodMaterial) => foodMaterial.foodMaterialId === form.foodMaterialId,
      ) ?? null,
    [foodMaterials, form.foodMaterialId],
  );

  const disposalPrice = useMemo(() => {
    const disposalCountAll = Number(form.disposalCountAll);

    if (
      !selectedFoodMaterial ||
      !Number.isFinite(disposalCountAll) ||
      disposalCountAll <= 0 ||
      selectedFoodMaterial.totalWeight <= 0
    ) {
      return 0;
    }

    const totalPrice =
      selectedFoodMaterial.foodMaterialCount *
      selectedFoodMaterial.foodMaterialPrice;

    return Math.round(
      (totalPrice / selectedFoodMaterial.totalWeight) * disposalCountAll,
    );
  }, [selectedFoodMaterial, form.disposalCountAll]);

  const updateField = (field: keyof DisposalCreateForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const disposalCountAll = Number(form.disposalCountAll);

    if (!form.foodMaterialId) {
      setErrorMessage("폐기할 식자재를 선택해주세요.");
      return;
    }
    if (!form.reasonId) {
      setErrorMessage("폐기 사유를 선택해주세요.");
      return;
    }
    if (!form.disposalDate) {
      setErrorMessage("폐기일을 입력해주세요.");
      return;
    }
    if (!Number.isFinite(disposalCountAll) || disposalCountAll <= 0) {
      setErrorMessage("총 폐기용량은 0보다 커야 합니다.");
      return;
    }
    if (!Number.isFinite(disposalPrice) || disposalPrice < 0) {
      setErrorMessage("총 폐기가격은 0 이상이어야 합니다.");
      return;
    }
    if (
      selectedFoodMaterial &&
      disposalCountAll > selectedFoodMaterial.totalWeight
    ) {
      setErrorMessage("총 폐기용량이 현재 재고 중량보다 큽니다.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createDisposalItem({
        foodMaterialId: form.foodMaterialId,
        reasonId: form.reasonId,
        disposalCountAll,
        disposalPrice,
        disposalDate: form.disposalDate,
      });

      setSuccessMessage("폐기 품목이 등록되었습니다.");
      setForm(createInitialForm());
      await loadFoodMaterials();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "폐기 품목 등록 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(createInitialForm());
    setErrorMessage("");
    setSuccessMessage("");
  };

  return {
    form,
    foodMaterials,
    selectedFoodMaterial,
    disposalPrice,
    isLoadingOptions,
    isSubmitting,
    errorMessage,
    successMessage,
    updateField,
    handleSubmit,
    handleReset,
  };
}
