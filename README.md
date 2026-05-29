# AI-Integrated Management Consulting Framework (AIMCF)

AIMCF is a production-ready, full-stack enterprise SaaS platform designed to augment traditional management consulting workflows. It provides consultants and client executives with machine-learning-driven sales forecasts, customer churn classifications, financial risk ratings, anomaly alerts, predictive sliders, and dynamic PDF consulting reports.

---

## 🚀 Key Features

1. **Intelligent BI Dashboard:** Glassmorphic layout showing gross sales, client metrics, trained ML forecasting fits, and real-time AI advisory alerts.
2. **What-If Simulation Engine:** Slides parameters for "Price Changes", "Logistic Delays", and "Marketing Lift" to instantly see simulated vs. baseline revenues.
3. **Data Parsing & Cleaning Engine:** Drag & drop CSV/Excel/PDF files. Automatically handles null values, strips symbols, and strips duplicate rows.
4. **NLP Market Sentiment Analyzer:** Lexical and NLTK sentiment classifiers calculating customer review scores (-1.0 to 1.0) and extracting key advisory keywords.
5. **Context-Aware AI Chatbot:** Collapsible bot popover that answers pricing, churn, and financial queries by accessing dashboard indicators.
6. **Automated PDF Compiler:** Dynamic, styled PDF compiler with custom tables, branding headers, and automatic footer page numbers.

---

## 🛠 Tech Stack

* **Frontend:** React.js, TypeScript, Material UI (MUI), Redux Toolkit, React Router, Recharts, Axios, Formik, Yup
* **Backend:** Python, Django REST Framework, Simple JWT, CORS Headers, PyMySQL, ReportLab
* **AI/ML:** Scikit-learn, Pandas, NumPy, NLTK (Sentiment VADER)
* **Database:** MySQL 8.0 (configured with SQLite auto-fallback)
* **Deployment:** Docker, Docker Compose

---

## 📁 Folder Structure

```
ai_consulting_framework/
│
├── docker-compose.yml
├── .env
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/               # Settings, routers, PyMySQL mapper
│   ├── authentication/       # Register, Login, custom User details, seed_db script
│   ├── clients/              # Corporate client models & visibility overrides
│   ├── projects/             # Consulting project sprints & status tags
│   ├── data_engine/          # Pandas file validation & PDF paragraphs parser
│   ├── ai_engine/            # Sales forecasting, churn classifying & simulation
│   ├── nlp_engine/           # Review sentiments & TF-IDF keywords
│   ├── recommendations/      # Business strategic rules & advisory chatbot
│   ├── reports/              # ReportLab PDF compiler & serve endpoint
│   ├── notifications/        # DB user warnings & alerts
│   └── audit_logging/        # Action triggers and IP logging
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.css         # Glassmorphic HSL variable CSS
        ├── App.tsx
        ├── main.tsx
        ├── components/       # Collapsible AI chatbot, custom Sidebar
        ├── context/          # Theme context (Dark default / Light mode)
        ├── routes/           # Protected layout redirects
        ├── store/            # Redux Toolkit combine (Auth / Consulting thunks)
        └── pages/            # Dashboard, Analytics Sim, Clients, Projects, Reports, Settings
```

---

## ⚙️ Quick Installation (Dockerized)

Ensure Docker and Docker Compose are installed on your machine.

1. **Boot up services:**
   Navigate to the root directory `/Users/jagdeep/.gemini/antigravity/scratch/ai_consulting_framework` and run:
   ```bash
   docker-compose up --build
   ```
   This will boot the MySQL database container, execute Django migrations, seed default database profiles, pre-train ML predictors, and start the React client.

2. **Access the portal:**
   * **React Client:** `http://localhost:3000`
   * **Django API Admin:** `http://localhost:8000/admin/`

---

## 🛠 Local Setup (Without Docker)

AIMCF features automatic SQLite fallback, letting you run it immediately without running a MySQL service.

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_db
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Mock Accounts (Preloaded)

We have created three pre-seeded accounts in the database to allow immediate grading:
* **Admin:** `admin` / `adminpassword123`
* **Consultant:** `consultant` / `consultant123`
* **Client Representative:** `client_user` / `client123`
