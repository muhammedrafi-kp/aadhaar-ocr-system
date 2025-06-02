import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

interface CustomError extends Error {
    status?: number;
}

export const exportText= async(imageBuffer:Buffer): Promise<string> => {

    try {
        const [result] = await client.textDetection(imageBuffer);
        if (!result.textAnnotations?.length) {
            const error = new Error("No text detected in image") as CustomError;
            error.status = 400;
            throw error;
        }
        const text = result.textAnnotations;
        const textContent = text.map((t) => t.description).join(" ");
        if (!textContent) {
            const error = new Error("No text content found in the detected text") as CustomError;
            error.status = 400;
            throw error;
        }
        return textContent;
    } catch (error:any) {
        console.log("Error in exportText:", error.message);
        throw error;
    }
}



