import { AadhaarData } from "../types/aadhaarData";

// Main function to parse Aadhaar data from raw OCR text
export function parseAadhaarData(text: string): AadhaarData {
  const data: AadhaarData = {};

  // Extract Aadhaar Number (12-digit number, optionally spaced)
  const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
  data.aadhaarNumber = aadhaarMatch?.[0].replace(/\s+/g, ''); // Remove spaces

  // Extract Date of Birth (format: DD/MM/YYYY or DD-MM-YYYY)
  const dobMatch = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
  data.dob = dobMatch?.[1];

  // Extract Gender (case-insensitive: Male, Female, Other)
  const genderMatch = text.match(/\b(Male|Female|Other|MALE|FEMALE|OTHER)\b/);
  if (genderMatch) {
    // Capitalize first letter
    data.gender = genderMatch[0][0].toUpperCase() + genderMatch[0].slice(1).toLowerCase();
  }

  // Define noise patterns to ignore while parsing name and address
  const NOISE: RegExp[] = [
    /government of india/i, /uidai/i, /gov\.in/i, /www/i, /help/i,
    /आधार|भारत सरकार|भारतीय विशिष्ट पहचान प्राधिकरण/i,
    /unique identifica|identification authority/i,
    /QR Code/i, /VID/i, /AADHAAR/i,
    /^address[:：]?\s*$/i, /^पता[:：]?\s*$/i,
    /\d{4}\s?\d{4}\s?\d{4}/,                   
    /\d{2}[\/\-]\d{2}[\/\-]\d{4}/,             
    /male|female|other|dob|जन्म|1947|1800|customer|toll\s*free/i 
  ];
  const isNoise = (s: string) => NOISE.some(r => r.test(s)); // Check if line is noise

  // Split text by lines, remove empty lines, and trim each
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Attempt to extract the name by checking for a pattern after a Hindi line
  let name = '';
  for (let i = 0; i < lines.length - 1; i++) {
    const cur = lines[i];
    const nxt = lines[i + 1];
    const isHindi = /[^\x00-\x7F]/.test(cur); // Check if line contains Hindi
    const latinName = /^[A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?$/;
    if (isHindi && latinName.test(nxt) && !isNoise(nxt)) {
      name = nxt;
      break;
    }
  }

  // Fallback: Look for a standalone line that matches typical name pattern
  if (!name) {
    name =
      lines.find(
        l =>
          /^[A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+/.test(l) &&
          !isNoise(l)
      ) ?? '';
  }
  data.name = name;

  // Try to find address starting from the line after "Address" or "पता"
  const addressLines: string[] = [];
  const addrIdx = lines.findIndex(l => /^address[:：]?\s*$/i.test(l));
  let idx = addrIdx >= 0 ? addrIdx + 1 : 0;
  while (idx < lines.length && addressLines.length < 7) {
    const l = lines[idx++];
    if (!isNoise(l) && l.length > 4) {
      addressLines.push(l.replace(/[,;]\s*$/, '')); // Clean ending punctuation
    }
  }

  // Fallback: Pick address-like lines from the bottom 40% of the document
  if (addressLines.length < 2) {
    const tail = lines.slice(Math.floor(lines.length * 0.6));
    addressLines.push(
      ...tail.filter(l => !isNoise(l) && l.length > 4)
    );
  }

  // Join address lines with comma separator
  if (addressLines.length) {
    data.address = addressLines.join(', ');
  }

  // Extract 6-digit PIN code from address or overall text
  const pin = (data.address ?? text).match(/\b\d{6}\b/);
  data.pincode = pin?.[0];

  return data;
}
