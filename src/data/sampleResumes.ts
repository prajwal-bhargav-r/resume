import { SampleResume } from "../types";

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: "ml-student",
    label: "Alex Chen — ML / AI Student",
    roleHint: "Machine Learning Engineer",
    companyHint: "NVIDIA",
    level: "Student",
    fileName: "Alex_Chen_ML_Resume.pdf",
    text: `ALEX CHEN
alex.chen.dev@email.com | (555) 234-5678 | San Jose, CA
linkedin.com/in/alexchen-ai | github.com/alexchen-ml

EDUCATION
University of California, Berkeley — B.S. Computer Science & Data Science
Expected May 2026 | GPA: 3.72
Relevant Coursework: Data Structures, Algorithms, Linear Algebra, Probability & Statistics, Machine Learning (CS 189), Artificial Intelligence (CS 188)

TECHNICAL SKILLS
Languages: Python, C++, Java, SQL, Bash
Frameworks & Libraries: Scikit-learn, Pandas, NumPy, Matplotlib, PyTorch (basics), Flask
Developer Tools: Git, GitHub, VS Code, Jupyter Notebooks, Linux CLI

PROJECTS
Heart Disease Risk Classifier | Python, Scikit-learn, Pandas, Matplotlib
- Made a machine learning project using Python to classify patient heart disease risk based on clinical health metrics.
- Cleaned and prepared the dataset of 1,020 patient records using Pandas, handling missing values and outlier normalization.
- Implemented logistic regression and random forest models to predict patient outcomes.
- Achieved an 84% cross-validated accuracy score on test splits.

E-Commerce Product Review Sentiment Analyzer | Python, NLTK, Flask
- Built a sentiment analysis tool for online customer reviews.
- Parsed and tokenized over 5,000 product reviews with Python regex and NLTK library.
- Developed a simple web frontend with HTML/CSS and Flask API to show positive or negative sentiment predictions.
- Used Git for version control and documented project setup in GitHub README.

Campus Course Scheduler Algorithm | C++, Data Structures
- Designed an automated course scheduling program in C++ resolving room conflicts and student prerequisites using graph topological sorting and backtracking algorithms.

EXPERIENCE & ACTIVITIES
Undergraduate Teaching Assistant — Intro to Programming | UC Berkeley
August 2024 - Present
- Conduct weekly lab walkthroughs for 40+ sophomore students covering recursion, dynamic memory allocation, and debugging.
- Host 3 office hours per week assisting students with programming assignments and code review.

AI Club Project Member
September 2023 - Present
- Participated in weekly Kaggle tabular data challenges and paper reading groups.`
  },
  {
    id: "sde-fresher",
    label: "Priya Sharma — Full Stack Fresher",
    roleHint: "Software Engineer",
    companyHint: "Google",
    level: "Fresher",
    fileName: "Priya_Sharma_SDE_Resume.pdf",
    text: `PRIYA SHARMA
priya.sharma.tech@gmail.com | +1 (415) 555-0192 | Seattle, WA
github.com/priyasharma-code | linkedin.com/in/priyasharma-swe

SUMMARY
Recent Computer Science graduate with hands-on experience building full-stack web applications, RESTful APIs, and distributed data structures. Seeking a Software Engineer role.

EDUCATION
University of Washington — B.S. in Computer Science
Graduated June 2024 | GPA: 3.80

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java, C++, SQL
Web & Backend: React.js, Node.js, Express, Tailwind CSS, PostgreSQL, MongoDB, REST APIs
Tools & Cloud: Git, Docker (basic), Postman, Jest, AWS (S3, EC2 basic)

PROJECTS
TaskFlow — Collaborative Project Management Application
- Developed full-stack task tracker using React, Node.js, and MongoDB.
- Created REST API endpoints for user authentication, task CRUD operations, and project boards.
- Implemented JWT token authentication and password hashing with bcrypt.
- Styled responsive user interface with Tailwind CSS.

Distributed Key-Value Store Prototype | Java, Sockets, Multi-threading
- Built an in-memory key-value database in Java supporting concurrent GET, PUT, and DELETE operations.
- Utilized Java concurrent hash maps and socket networking with custom binary protocol.
- Wrote unit test suite using JUnit achieving 88% statement coverage.

Personal Portfolio & Tech Blog | Next.js, Markdown, Vercel
- Built modern static blog with Next.js and Markdown parsing for technical writing on software engineering topics.

EXPERIENCE
Software Engineering Intern | CloudScale Solutions
June 2023 - September 2023
- Worked on internal metrics dashboard for server uptime monitoring using React and Express.
- Fixed 15+ UI bug tickets and improved API error handling routines.
- Participated in daily standups, code reviews, and bi-weekly sprint planning meetings.`
  },
  {
    id: "data-analyst",
    label: "Marcus Vance — Junior Data Analyst",
    roleHint: "Data Analyst",
    companyHint: "Amazon",
    level: "0–2 years",
    fileName: "Marcus_Vance_Data_Resume.pdf",
    text: `MARCUS VANCE
marcus.vance@analytics.io | (312) 555-8942 | Chicago, IL
linkedin.com/in/marcusvance-data | github.com/marcusvance

PROFESSIONAL SUMMARY
Data Analyst with 1.5 years experience translating raw transactional datasets into executive dashboards, automated SQL reporting pipelines, and statistical analyses.

EXPERIENCE
Junior Data Analyst | RetailMetric Systems | Chicago, IL
Jan 2023 - Present
- Formulated complex SQL queries (multi-table JOINs, CTEs, window functions) to extract customer lifetime value and churn rates from PostgreSQL database.
- Designed 6 interactive Tableau executive dashboards monitoring inventory turnover and regional sales performance across 140 store locations.
- Automated weekly sales summary reports using Python (Pandas/OpenPyXL), eliminating 4 hours of manual spreadsheet compilation per week.
- Collaborated with product managers to define tracking KPIs for quarterly marketing campaigns.

EDUCATION
University of Illinois Urbana-Champaign — B.S. in Statistics & Economics
Graduated December 2022

TECHNICAL SKILLS
Query & Analytics: SQL (PostgreSQL, MySQL), Python (Pandas, NumPy), Excel (Pivot Tables, XLOOKUP, VBA)
Visualization: Tableau, Power BI, Matplotlib, Seaborn
Methodologies: A/B Testing, Cohort Analysis, Statistical Hypothesis Testing, ETL Pipelines

KEY PROJECTS
Superstore Customer Retention & Cohort Study | Python, SQL, Tableau
- Analyzed 50,000+ customer retail orders to evaluate cohort retention over a 24-month horizon.
- Identified product categories with 35% higher repeat purchase rates, presenting findings to business stakeholders.

Credit Card Fraud Detection Exploratory Analysis | Python, Scikit-learn
- Conducted exploratory data analysis on imbalanced credit card fraud dataset using SMOTE sampling and classification metrics.`
  }
];
