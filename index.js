import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import router from './routes/index.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 8080;
app.use('/api', router);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
 