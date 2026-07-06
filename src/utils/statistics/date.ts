export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const getStartAndEndDate = (month) => {
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
