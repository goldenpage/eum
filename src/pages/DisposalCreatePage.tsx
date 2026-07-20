import { DisposalCreateForm } from "../features/disposals/DisposalCreateForm";
import { useDisposalCreate } from "../hooks/useDisposalCreate";
import "./css/DisposalCreatePage.css";

function DisposalCreatePage() {
  const {
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
  } = useDisposalCreate();

  return (
    <div className="container">
      <div className="main">
        <h1>폐기 품목 입력</h1>
        {errorMessage && (
          <p className="disposal-create-message error" role="alert">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="disposal-create-message success" role="status">
            {successMessage}
          </p>
        )}
        <DisposalCreateForm
          form={form}
          foodMaterials={foodMaterials}
          selectedFoodMaterial={selectedFoodMaterial}
          disposalPrice={disposalPrice}
          isLoadingOptions={isLoadingOptions}
          isSubmitting={isSubmitting}
          onChange={updateField}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}

export default DisposalCreatePage;
