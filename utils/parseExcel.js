const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function findExcelFile(baseName, dir = 'uploads') {
  const files = fs.readdirSync(dir);
  const matched = files.find(file =>
    file.startsWith(baseName) && 
    (file.toLowerCase().endsWith('.xls') || file.toLowerCase().endsWith('.xlsx'))
  );
  return matched ? path.join(dir, matched) : null;
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

function countWorkdaysInPeriod(nameList, workLogFilePath, startDate, endDate) {
  const workbook = XLSX.readFile(workLogFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const result = {};
  nameList.forEach(name => result[name] = 0); // 이름별 초기화

  rows.forEach(row => {
    const name = row['이름'];
    const dateStr = row['근무일자'];
    const workIn = row['출근'];
    const workOut = row['퇴근'];

    const parsedDate = dayjs(dateStr, ['YYYY/MM/DD', 'YYYY-M-D', 'M월 D일'], true);
    if (!parsedDate.isValid()) return;
    if (!nameList.includes(name)) return;
    if (parsedDate.isBefore(startDate) || parsedDate.isAfter(endDate)) return;
    if (!workIn && !workOut) return;

    result[name]++;
  });

  return result;
}

module.exports = {
  findExcelFile,
  readPersonName,
  countWorkdaysInPeriod
};
