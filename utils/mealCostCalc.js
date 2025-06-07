const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function generateMealCostExcel(mealOrderFilePath, workdaysByPerson, outputPath) {
  const workbook = XLSX.readFile(mealOrderFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const resultData = data.map(row => {
    const name = row['이름'];
    const cost = Number(row['비용']);
    const days = workdaysByPerson[name] || 0;
    const total = cost * days;

    return {
      이름: name,
      비용: cost,
      일수: days,
      식대: total,
    };
  });

  const newSheet = XLSX.utils.json_to_sheet(resultData);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, '식대 정산');

  XLSX.writeFile(newWorkbook, outputPath);
}

module.exports = {
    generateMealCostExcel
}
