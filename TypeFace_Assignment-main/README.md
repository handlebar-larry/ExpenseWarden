# Expense Tracker

A full-stack Expense Tracker application to manage your personal finances. This project allows users to track their expenses and incomes, visualize spending patterns, and manage their budget efficiently.

---

# Frontend Deployed :- https://expensewarden.netlify.app

## Features

- **Authentication**: Secure signup, login, and logout for users.
- <img width="1920" height="1009" alt="image" src="https://github.com/user-attachments/assets/ae902610-e2aa-4bcd-b085-e80a0ce4072f" />
- **Add, View, and Delete Expenses**: 
  - Add new expenses with date, category, amount, and description.
  - View recent expenses in a paginated list.
  - Delete any expense as needed.
  - <img width="1920" height="1009" alt="image" src="https://github.com/user-attachments/assets/7656ad73-5dd5-4f93-9810-88d983b3272d" />

- **Add, View, and Delete Incomes**:
  - Add income entries with similar details.
  - Paginated income tracking and deletion.
  - <img width="1920" height="1009" alt="image" src="https://github.com/user-attachments/assets/ec997a3b-d4be-4aeb-b762-bb8432129fa5" />

- **Filtering and Date Range**:
  - Filter expenses by date range.
  - Switch between filtering all expenses or by custom duration.
- **Expense and Income Statistics**:
  - View total expenses and incomes for the current month and year.
  - Annual and monthly breakdowns.
  - Category-wise breakdown per month.
- **Data Visualization**:
  - Bar chart: Monthly expense trends for a selected year.
  - Pie chart: Distribution of expenses by category.
- **Image Upload & Auto Extraction**:
  - Upload receipts (image or PDF).
  - Automatic extraction of total amount and merchant name using AI (Google Gemini API).
- **User Experience**:
  - Responsive and modern UI (React, TailwindCSS).
  - Toast notifications for important actions.

---

## Technologies Used

### Frontend

- **React** (with Vite for fast development)
- **Zustand**: State management for user/auth and queries.
- **Recharts**: For bar and pie chart visualizations.
- **React Router**: Client-side routing.
- **Axios**: API requests to the backend.
- **TailwindCSS**: Styling and utility classes.
- **react-icons**: Iconography.
- **react-hot-toast**: Toast notifications.

### Backend

- **Node.js** with **Express.js**: REST API server.
- **MongoDB** (via Mongoose): User, expenses, and incomes persistence.
- **JWT**: Authentication and session management.
- **Multer**: Receipt file uploads.
- **pdf-lib, sharp, pdf2pic**: For image/PDF processing.
- **Google Generative AI (Gemini API)**: To extract structured data from uploaded receipts.

---

## Backend Logic & Functions

### Authentication

- **Signup/Login/Logout**: 
  - User details stored in MongoDB.
  - JWT tokens for session management.

### Expense & Income Management

- **Add Expense/Income**: 
  - POST endpoints receive data and append to user’s record.
- **Delete Expense/Income**: 
  - Remove an entry from the user’s document by ID.
- **Paginated Views**: 
  - Fetch expenses/incomes with pagination for better performance.
- **Date Range Queries**:
  - Filter expenses/incomes between two dates.
- **Statistics**:
  - Yearly stats: Aggregate expenses/incomes for each month.
  - Monthly category stats: Group by category for a given month.

### Receipt Processing (AI Integration)

- **Image/PDF Upload**: 
  - User uploads a file via frontend.
- **AI Extraction**:
  - File is processed and converted if needed.
  - Google Gemini API is prompted to extract the total amount and merchant/store name from the receipt.
  - Returns structured JSON to auto-fill expense fields.

---

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- (Optional) Google Gemini API key for receipt extraction

### Installation

**Backend:**
```bash
cd Backend
npm install
cp .env.example .env # Set your environment variables
npm start
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

---

## Folder Structure

- `/Frontend` - React frontend
- `/Backend` - Node.js backend

---

## License

MIT
