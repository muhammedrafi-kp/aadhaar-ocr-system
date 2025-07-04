import { Request, Response } from "express"
import { exportText } from "../services/ocr.service";
import { parseAadhaarData } from "../util/parser";

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

export const extractAadhaar = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as MulterFiles;

        // console.log("req.files:", files);

        if (!files || !files.front || !files.back) {
            res.status(400).json({ message: "Both front and back files are required" });
            return;
        }

        const front = files.front[0];
        const back = files.back[0];

        // console.log("front:", front);
        // console.log("back:", back);

        if (!front || !back) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }


        // Process both images
        const frontText = await exportText(front.buffer);
        const backText = await exportText(back.buffer);

        console.log("frontText:", frontText);
        console.log("backText:", backText);

        const aadhaarFrontPattern = /Government of India/i
        const aadhaarBackPattern = /Unique Identification Authority of India/i

        if (!frontText.match(aadhaarFrontPattern) && !backText.match(aadhaarBackPattern)) {
            res.status(400).json({ message: "Invalid Aadhaar card, Please upload a clearer front and back image for better accuracy." });
            return;
        }

        if (!frontText.match(aadhaarFrontPattern)) {
            res.status(400).json({ message: " Invalid Front Image, Please upload a clearer front image for better accuracy." });
            return;
        }

        if (!backText.match(aadhaarBackPattern)) {
            res.status(400).json({ message: " Invalid Back Image, Please upload a clearer back image for better accuracy." });
            return;
        }

        const combinedText = `${frontText} ${backText}`;
        console.log("extracted text:", combinedText);


        if (!combinedText) {
            res.status(400).json({ message: "No Aadhaar details found" });
            return;
        }

        const aadhaarData = parseAadhaarData(combinedText);
        console.log("aadhaarData:", aadhaarData);

        if (Object.keys(aadhaarData).length === 0) {
            res.status(400).json({ message: "No Aadhaar data found" });
            return;
        }

        res.status(200).json({ success: true, aadhaarData, message: "Aadhaar number extracted successfully" });

    } catch (error: any) {

        if (error.status === 400) {
            res.status(400).json({ message: error.message });
            return;
        }
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

