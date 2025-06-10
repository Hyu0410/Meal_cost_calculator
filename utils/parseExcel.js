const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { detectFormat } = require('./formatDetector');

function getFirst3Rows(filePath) { // 첫번째 시트에서 1-3행만 읽어와 2차원 배열로 리턴
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rows = [];
  for (let rowNum = 1 ; rowNum < 4 ; rowNum++) {
    const row = [];

    for (let col = 0 ; col <= 20 ; col++){
      const cellAddress = XLSX.utils.encode_cell({
        c: col,
        r: rowNum - 1
      });
      const cell = worksheet[cellAddress];
      row.push(cell ? cell.v : undefined);
    }
    rows.push(row);
  }

  return rows;
}

function readPersonName(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found: ' + filePath);
  }
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // 첫 번째 시트
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  const names = data.map(row => row['이름']).filter(name => name);
  return names;
}

function countWorkdaysInPeriod(nameList, workLogFilePath) {
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

module.exports = {
  getFirst3Rows,
  readPersonName,
  countWorkdaysInPeriod
};
