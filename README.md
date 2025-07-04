# 🆔 Aadhaar OCR System

A full-stack application for extracting and parsing Aadhaar card data using the power of **Google Cloud Vision API**, built with a modern TypeScript stack.

## 🚀 Overview

This system enables users to upload images of Aadhaar cards and instantly extract structured information like:

- 🔢 Aadhaar Number  
- 👤 Name  
- 🎂 Date of Birth  
- 🚻 Gender  
- 🏠 Address  
- 📮 Pincode  

OCR is handled using **Google Cloud Vision**, with custom parsing logic to extract clean and accurate data from scanned Aadhaar cards.

---

## 🛠️ Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| 🔧 Frontend | **React** + **TypeScript**       |
| 🔧 Backend  | **Node.js** + **Express** + **TypeScript** |
| ☁️ OCR      | **Google Cloud Vision API**      |
| 📦 Tools    | Vite, Axios, Tailwind CSS, Multer |

---

## 📸 Features

- 📤 Upload Aadhaar images (front & back)
- 🤖 OCR extraction using GCP Vision
- 🔍 Intelligent Aadhaar parser (regex + rule-based)
- 📄 View structured results in clean UI
- ⚠️ Handles noise & OCR errors gracefully

---

## 🌐 Live Demo

> Coming Soon! ✨  
> [Optional: Link to deployed frontend (e.g., Vercel, Netlify) or backend (e.g., Render, GCP App Engine)]

---

## ⚙️ Getting Started

### 🔽 Clone the Repo

```bash
git clone https://github.com/your-username/aadhar-ocr-system.git
cd aadhar-ocr-system

```

### 🧪 Prerequisites

- Node.js ≥ v18

- Google Cloud Platform account

- Vision API enabled on GCP

- GOOGLE_APPLICATION_CREDENTIALS key (JSON)

---

### 📦 Backend Setup

```bash
cd server
npm install
```

### 🛠️ Environment Variables

- Create a .env file in /server:

```bash
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=./path-to-your-gcp-credentials.json

```

- Then start the server:
```bash
npm run dev

```

### 🎨 Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📤 Upload Flow
 - User uploads front and/or back of Aadhaar card.

 - Backend sends image to Google Cloud Vision.

 - Extracted text is parsed using a custom regex engine.

- Parsed details are sent back and rendered in the UI.

## 🖥️
### 🎨 Frontend Setup
```json
{
  "aadhaarNumber": "xxxxxxxxxxxx",
  "name": "Full Name",
  "dob": "DD/MM/YYYY",
  "gender": "Male | Female | Other",
  "address": "Full postal address extracted from Aadhaar",
  "pincode": "XXXXXX"
}

```


---

## 🌟 Support This Project



If you found this project helpful or interesting, please consider giving it a ⭐ on GitHub  😊


[![GitHub Stars](https://img.shields.io/github/stars/muhammedrafi-kp/aadhaar-ocr-system.github?style=social)](https://github.com/muhammedrafi-kp/aadhaar-ocr-system.github/stargazers)
