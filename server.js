const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const { readPersonName, countWorkdaysInPeriod } = require('./utils/parseExcel');
const { generateMealCostExcel } = require('./utils/mealCostCalc');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 저장할 폴더
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  },
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/upload', upload.fields([{ name: 'workLogFile' }, { name: 'mealOrderFile' }]), (req, res) => {
    try {
        const mealOrderPath = req.files['mealOrderFile'][0].path;
        const workLogPath = req.files['workLogFile'][0].path;
        const timestamp = Date.now();
        const fileName = `meal_cost_summary_${timestamp}.xlsx`;
        const outputPath = path.join('output', fileName);

        const nameList = readPersonName(mealOrderPath);
        const workdays = countWorkdaysInPeriod(nameList, workLogPath);

        generateMealCostExcel(mealOrderPath, workdays, outputPath);

        console.log('✅ 식대 엑셀 파일 생성 완료:', outputPath);
        res.download(outputPath, 'meal_cost_summary.xlsx', (error) => {
            if(error) {
                console.error('파일 다운로드 중 에러: error');
            }

            // 다운로드 완료 후 파일 삭제
            [mealOrderPath, workLogPath, outputPath].forEach(file => {
            fs.unlink(file, (unlinkErr) => {
            if (unlinkErr) console.error('파일 삭제 실패:', file, unlinkErr);
            else console.log('파일 삭제 완료:', file);
            });
        });
        }); 
    } catch(err) {
        console.error('에러 발생:', err);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server is Listening on ${PORT}...!`);
});
