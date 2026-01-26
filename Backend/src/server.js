import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';
const PORT=process.env.PORT||5000;

// Connect to Database
connectDB().then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
});