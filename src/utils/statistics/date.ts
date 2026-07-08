export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const getStartAndEndDate = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  const startDate = `${year}-${String(monthNumber).padStart(2, "0")}-01`;

  const endDateObject = new Date(year, monthNumber, 1);
  const endYear = endDateObject.getFullYear();
  const endMonth = String(endDateObject.getMonth() + 1).padStart(2, "0");

  return {
    startDate,
    endDate: `${endYear}-${endMonth}-01`,
  };
};

export const getSixMonthRange = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const startDateObject = new Date(year, monthNumber - 6, 1);
  const endDateObject = new Date(year, monthNumber, 1);

  const startYear = startDateObject.getFullYear();
  const startMonth = String(startDateObject.getMonth() + 1).padStart(2, "0");
  const endYear = endDateObject.getFullYear();
  const endMonth = String(endDateObject.getMonth() + 1).padStart(2, "0");

  return {
    startDate: `${startYear}-${startMonth}-01`,
    endDate: `${endYear}-${endMonth}-01`,
  };
};
