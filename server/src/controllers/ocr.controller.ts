import { Request, Response } from "express"
import { exportText } from "../services/ocr.service";
import { parseAadhaarText } from "../util/parser";

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

        const combinedText = `${frontText} ${backText}`;
        console.log("extracted text:", combinedText);


        if (!combinedText) {
            res.status(400).json({ message: "No Aadhaar number found" });
            return;
        }

        const aadhaarData = parseAadhaarText(combinedText);
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

