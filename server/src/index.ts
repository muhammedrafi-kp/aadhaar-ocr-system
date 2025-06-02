import express from "express";
import {configDotenv} from "dotenv";
import morgan from "morgan";
import cors from "cors";
import ocrRoutes from "./routes/ocr.routes";

configDotenv();


const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/aadhaar", ocrRoutes);

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});
