// express 모듈을 불러옵니다.
import express from 'express';
import path from "path";
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';

// express 애플리케이션을 생성합니다.
const app = express();
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 3000;

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')))

app.use('/user', userRouter);
app.use('/post', postRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

