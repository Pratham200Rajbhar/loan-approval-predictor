# CrediPredict - Loan Approval Predictor

CrediPredict is an end-to-end Machine Learning web application designed to evaluate loan applications and estimate approval chances in real-time. The system uses a trained Random Forest model to analyze applicant financial profiles, combined with a highly polished Google-inspired React dashboard.

---

## 🏗️ Project Architecture

The project is structured into three main directories:

1. **`ml_notebook/`**: Contains the complete data science pipeline:
   - Data Ingestion & Exploratory Data Analysis (EDA)
   - Data Preprocessing & Categorical Encoding
   - Model Training (Random Forest Classifier) & Hyperparameter Tuning
   - Exporters for model artifacts (`rf_model.pkl`, `scaler.pkl`, `label_encoders.pkl`)

2. **`backend/`**: A production-ready **FastAPI** web server that:
   - Loads the trained Random Forest model.
   - Exposes REST API endpoints for predicting loan approval statuses (`/api/predict`).
   - Automatically handles scaling and encoding pipelines matching the training phase.

3. **`frontend/`**: A responsive **React + Vite** single-page application that:
   - Features a clean, professional, and accessible UI designed using **Vanilla CSS**.
   - Includes real-time indicators for total combined income, estimated monthly repayment (EMI) in Indian Rupees (₹), and Payment-to-Income ratios.
   - Provides helpful inline tooltips next to each label explaining what input is required.
   - Displays clear prediction results with confidence scores and helpful financial advice based on the outcome.

---

## ⚡ Tech Stack

- **Machine Learning**: Python, Scikit-Learn, Pandas, NumPy, Joblib, Jupyter Notebooks
- **Backend API**: Python, FastAPI, Pydantic, Uvicorn
- **Frontend App**: React, Vite, Lucide Icons, Vanilla CSS (Google Design Language, responsive, dark/light theme support)

---

## 🚀 Setup & Installation

Follow these steps to get both the backend and frontend services running on your local machine:

### 1. Prerequisites
Ensure you have the following installed:
- **Python** (version 3.11 or higher)
- **Node.js** (version 18 or higher) and **npm**

---

### 2. Backend Setup (FastAPI)

1. Open your terminal and navigate to the project root.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
   ```
3. Install the required backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Verify the model artifacts are located in `backend/models/`:
   - `rf_model.pkl`
   - `scaler.pkl`
   - `label_encoders.pkl`
5. Run the FastAPI development server:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
6. The backend server will run on **`http://localhost:8000`**. You can view the interactive API documentation at `http://localhost:8000/docs`.

---

### 3. Frontend Setup (React)

1. Open a new terminal window/tab and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:5173`** to access the Loan Approval Predictor dashboard.

---

## 📊 Features & UI Capabilities

- **Real-Time API Monitor**: The frontend constantly checks connection health to the FastAPI server and displays a live connection status badge in the header.
- **Dynamic Estimates**: As you slide the loan amount or change monthly income numbers, the form immediately computes your monthly repayment (EMI) and warns you if the loan repayment eats up more than 40% of your total income.
- **Interactive Tooltips**: Every label features a hoverable `ⓘ` help icon explaining the input fields in simple terms.
- **Tailored Client Advisory**: Based on whether your loan is predicted as **Approved** or **Rejected**, the results panel displays custom suggestions (e.g., documents to prepare or profile areas to improve).
- **System Theme Matching**: Adapts automatically to your system's light or dark mode setting for maximum comfort.
