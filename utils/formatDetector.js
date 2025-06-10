const XLSX = require('xlsx');

/**
 * 엑셀 파일에서 첫 번째 시트를 읽고, 컬럼명을 기반으로 포맷 유형 감지.
 * 
 * @param {string} filePath - 엑셀 파일 경로  
 * 
 * @returns {'old' | 'new'}  
 *   → 'old'는 출근/퇴근 열이 있는 포맷,  
 *   → 'new'는 인증일시/인증모드 열이 있는 포맷.
 * 
 * @throws {Error}  
 *   → 만약 둘 다 아닌 경우(즉, 알 수 없는 포맷이면),  
 *      Error를 던져서 에러 발생.
 */

function detectFormat(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // old 포맷은 0번째 행 헤더 확인
    const firstRow = jsonData[0] || [];
    if (firstRow.includes('출근') && firstRow.includes('퇴근') && firstRow.includes('이름')) {
        return 'old'
    }

    const thirdRow = jsonData[2] || [];
    if (thirdRow.includes('이름') && thirdRow.includes('인증일시') && thirdRow.includes('인증모드')) {
        return 'new'
    }
}

module.exports = {
    detectFormat
}
