# Weed Detection Frontend

## Overview
This repository contains the frontend interface for the Weed and Crop Detection System, a web-based application built with Next.js and React.  
It allows users to upload agricultural field images and run predictions using multiple deep learning models like ResNet, U-Net, EfficientNet, and DeepLabV3.

---

## Features
- Image Upload & Preview — Drag and drop or browse to upload field images (JPG, JPEG, PNG up to 10MB).
- Model Selection — Choose from multiple pre-trained models, each implemented by a unique contributor.
- Prediction Interface — Sends image data to the backend API (`/predict`) for weed/crop classification.
- Responsive UI — Optimized for both desktop and mobile layouts.
- Modern Design — Built with Lucide icons, custom gradients, and smooth transitions.

---

## Tech Stack
| Category | Technology |
|-----------|-------------|
| Frontend Framework | Next.js (v15.5.4) |
| UI Library | React (v19.1.0) |
| Icons | Lucide React |
| Language | TypeScript |
| Styling | CSS-in-JS (via `style jsx`) |
| Build Tool | Turbopack |
| Linter | ESLint |

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Pyro-Warrior-1884/Weed_Detection_Frontend.git
cd Weed_Detection_Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

By default, the app runs at **http://localhost:3000**

---

## Backend Connection
This frontend expects a backend service running locally at:

```
http://localhost:8000/predict
```

Make sure the backend (from `Weed_Detection_Backend`) is active before triggering predictions.

---

## Model Information
| Model ID | Model Name | Description | Contributor |
|-----------|-------------|--------------|--------------|
| `resnet` | ResNet-50 | High-accuracy CNN model for image classification | CSE22532 |
| `unet` | U-Net | Image segmentation model for weed detection | CSE22505 |
| `efficientnet` | EfficientNet | Lightweight model with efficient scaling | CSE22538 |
| `deeplabv3` | DeepLabV3 | Advanced segmentation architecture | CSE22552 |

---

## Project Structure
```
Weed_Detection_Frontend/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # App layout and metadata
│   │   └── page.tsx            # Main frontend logic and UI
│
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

---

## Key Functionalities
- Image Validation — Ensures only valid formats and file sizes are accepted.
- Dynamic Model Cards — Highlights the selected model interactively.
- Real-time Feedback — Displays loading spinners and error messages.
- Progressive Results Display — Shows model predictions once available.

---

## Scripts

| Command | Description |
|----------|--------------|
| `npm run dev` | Starts the development server with Turbopack |
| `npm run build` | Builds the production-ready app |
| `npm start` | Starts the app in production mode |
| `npm run lint` | Runs ESLint checks |

---

## Contributors
| Name | ID | Role |
|------|----|------|
| CSE22532 | Model Contributor | ResNet-50 |
| CSE22505 | Model Contributor | U-Net |
| CSE22538 | Model Contributor | EfficientNet |
| CSE22552 | Model Contributor | DeepLabV3 |
