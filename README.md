\# 🎒 What Did I Forget?



\## AI-Powered Travel Forgetfulness Prediction System



What Did I Forget? is a Machine Learning and Full-Stack application

that predicts the likelihood of forgetting travel-related items

based on trip context.



\## 🚨 Problem Statement



People often forget important items before leaving for college,

work, travel, gym, or other destinations.



Traditional checklist applications provide static reminders.

This project uses Machine Learning to estimate the forgetfulness

risk of individual items based on trip-related information.



\## 💡 Proposed Solution



The application takes trip information such as:



\- Day of the week

\- Destination

\- Time of day

\- Weather

\- Trip duration



The Machine Learning model then predicts the forgetfulness

probability for different items and classifies them into:



\- 🔴 High Risk

\- 🟡 Medium Risk

\- 🟢 Low Risk



\## 🧠 Machine Learning



The following models were evaluated:



\- Logistic Regression

\- Decision Tree

\- Random Forest



Random Forest was selected as the final model.



\## 📊 Model Results



| Model | Accuracy | Precision | Recall | F1 Score |

|---|---:|---:|---:|---:|

| Logistic Regression | 74.03% | 65.29% | 48.17% | 55.44% |

| Decision Tree | 71.78% | 60.16% | 46.95% | 52.74% |

| Random Forest | 74.95% | 67.66% | 48.48% | 56.48% |



\## 🏗️ System Architecture



User

↓

React Frontend

↓

FastAPI Backend

↓

Preprocessing

↓

Random Forest Model

↓

Forgetfulness Probability

↓

Risk Classification

↓

Personalized Checklist



\## 🛠️ Technologies Used



\### Machine Learning

\- Python

\- Pandas

\- NumPy

\- Scikit-learn

\- Random Forest



\### Backend

\- FastAPI

\- Uvicorn



\### Frontend

\- React

\- Vite

\- JavaScript

\- CSS



\## 📂 Project Structure



```text

What-Did-I-Forget/

│

├── backend/

├── dataset/

├── frontend/

├── model/

├── notebook/

├── screenshots/

├── docs/

├── README.md

├── requirements.txt

└── .gitignore

