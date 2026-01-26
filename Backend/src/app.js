import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from "./routes/reportRoutes.js"
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use("/api/auth",authRoutes)
app.use("/api/reports", reportRoutes);
export default app;