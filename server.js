const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 저장할 폴더
  },
  filename: (req, file, cb) => {
    // 원본 파일명과 확장자 유지
    cb(null, file.fieldname + path.extname(file.originalname));
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
    const { month } = req.body;

    console.log(month);

    res.status(200).json({
        message: "upload success"
    })
})

app.listen(PORT, () => {
    console.log(`Server is Listening on ${PORT}...!`);
});
