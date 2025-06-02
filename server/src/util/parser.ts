import { AadhaarData } from "../types/aadhaarData";


export function parseAadhaarText(extractedText: string): AadhaarData {
    const aadhaarData: AadhaarData = {};
    
    // Extract Aadhaar Number (12-digit number, possibly with spaces)
    const aadhaarRegex = /(\d{4}\s?\d{4}\s?\d{4})/;
    const aadhaarMatch = extractedText.match(aadhaarRegex);
    if (aadhaarMatch) {
        aadhaarData.aadhaarNumber = aadhaarMatch[1].replace(/\s/g, '');
    }

    // Extract Name (look for text after "Government of India" and before "Date of Birth")
    const nameRegex = /Government of India([\s\S]*?)Date of Birth/;
    const nameMatch = extractedText.match(nameRegex);
    if (nameMatch) {
        // Clean up the name by removing extra spaces and special characters
        aadhaarData.name = nameMatch[1].replace(/[^a-zA-Z\s]/g, '').trim();
    }

    // Extract Date of Birth
    const dobRegex = /Date of Birth\s?\/?\s?DOB\s?(\d{2}\/\d{2}\/\d{4})/;
    const dobMatch = extractedText.match(dobRegex);
    if (dobMatch) {
        aadhaarData.dob = dobMatch[1];
    }

    // Extract Gender
    const genderRegex = /Male|Female|Other|MALE|FEMALE|OTHER/;
    const genderMatch = extractedText.match(genderRegex);
    if (genderMatch) {
        aadhaarData.gender = genderMatch[0].toLowerCase();
    }

    const addressRegex = /Address:\s?([\s\S]*?)(\d{6})/;
    const addressMatch = extractedText.match(addressRegex);
    if (addressMatch) {
        // Clean up address by removing extra spaces and special characters
        let address = addressMatch[1].replace(/\s+/g, ' ').trim();
        address = address.replace(/[^a-zA-Z0-9\s,.\-\/]/g, '');
        
        // Remove C/O part if it exists
        address = address.replace(/^C\/O\s*[^,]+,\s*/i, '').trim();
        
        // Remove trailing hyphen if present
        address = address.replace(/-+$/, '').trim();
        
        aadhaarData.address = address;
        
        // Extract Pincode (6-digit number at the end of address)
        aadhaarData.pincode = addressMatch[2];
    }

    return aadhaarData;
}





  
