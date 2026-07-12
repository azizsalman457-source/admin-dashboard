import express from 'express';
import SubjectRouter from './routes/subjects';
import cors from "cors";
import {ClassRouter} from './routes/Classes';
import { teacherRouter } from './routes/teacher';
import { DepartmentRouter } from "./routes/departments";
const app = express();
const PORT=8000;
if(!process.env.FRONTEND_URL)
{
    throw new Error('FRONTEND_URL is not set in .env file');
}
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use(express.json());

app.use('/api/subjects',SubjectRouter);
app.use('/api/classes',ClassRouter);
app.use('/api/teachers',teacherRouter);

app.use("/api/departments", DepartmentRouter);

app.get('/',(req,res)=>{
    res.send('hello, welcome to classroom api');
});

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});