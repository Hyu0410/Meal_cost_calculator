const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

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

module.exports = {
  findExcelFile,
  readPersonName
};
