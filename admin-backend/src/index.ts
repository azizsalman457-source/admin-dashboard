import express from 'express';
import SubjectRouter from './routes/subjects';
import cors from "cors";
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

app.use('/api/subjects',SubjectRouter)

app.get('/',(req,res)=>{
    res.send('hello, welcome to classroom api');
});

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});