import {Router} from "express";
import { extractAadhaar } from "../controllers/ocr.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/extract", upload, extractAadhaar);

export default router;
