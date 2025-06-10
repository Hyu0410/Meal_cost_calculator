const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function countWorkdaysInPeriod_old(nameList, workLogFilePath) {
  const workbook = XLSX.readFile(workLogFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const result = {};
  nameList.forEach(name => result[name] = 0); // 이름별 초기화

  rows.forEach(row => {
    const name = row['이름'];
    const workIn = row['출근'];
    const workOut = row['퇴근'];

    if (!nameList.includes(name)) return;
    if (!workIn && !workOut) return;

    result[name]++;
  });

  return result;
}

function countWorkdaysInPeriod_new(nameList, workLogFilePath) {
  const workbook = XLSX.readFile(workLogFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    range: 2
  });

  const result = {};
  nameList.forEach(name => result[name] = new Set());

  rows.forEach(row => {
    let name = row['이름'];
    let datetime = row['인증일시'];
    let mode = row['인증모드'];

    if (!nameList.includes(name)) {
      return;
    }
    if (!datetime || !mode) {
      return;
    }

    // 날짜 문자열 추출
    if (typeof datetime === 'string' && datetime.startsWith("'")) {
      datetime = datetime.slice(1);
    }
    const date = datetime.split(' ')[0];

    if (mode.includes('출근') || mode.includes('퇴근')) {
      result[name].add(date); // 출근 혹은 퇴근이 있으면 날짜 저장
    }
  })

  //최종 출근일수 변환
  const finalCnt = {};
  for (const name in result) {
    finalCnt[name] = result[name].size;
  }

  return finalCnt;
}

function generateMealCostExcel(mealOrderFilePath, workdaysByPerson, outputPath) {
  const workbook = XLSX.readFile(mealOrderFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const resultData = data.map(row => {
    const name = row['이름'];
    const cleanedName = name.replace(/\s+/g, '').trim();
    const cost = Number(row['비용']);
    const days = workdaysByPerson[cleanedName] || 0;
    const total = cost * days;

    return {
      이름: cleanedName,
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
  countWorkdaysInPeriod_old,
  countWorkdaysInPeriod_new,
  generateMealCostExcel
}
