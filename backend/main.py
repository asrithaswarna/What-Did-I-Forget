from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="What Did I Forget?",
    description="ML-powered forgetfulness prediction API",
    version="1.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",

        # Add your Vercel URL here after frontend deployment.
        # Example:
        # "https://your-project.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# LOAD MODEL
# =========================================================
#
# Project structure:
#
# What-Did-I-Forget/
#
# ├── backend/
# │   └── main.py
# │
# ├── model/
# │   ├── random_forest_model.pkl
# │   └── preprocessor.pkl
# │
# └── frontend/
#
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "model" / "random_forest_model.pkl"
PREPROCESSOR_PATH = BASE_DIR / "model" / "preprocessor.pkl"


model = None
preprocessor = None


try:
    print("======================================")
    print("LOADING MODEL...")
    print("======================================")

    print("Model path:", MODEL_PATH)
    print("Preprocessor path:", PREPROCESSOR_PATH)

    model = joblib.load(MODEL_PATH)
    print("MODEL LOADED SUCCESSFULLY")

    preprocessor = joblib.load(PREPROCESSOR_PATH)
    print("PREPROCESSOR LOADED SUCCESSFULLY")

    print("======================================")

except Exception as e:

    print("======================================")
    print("ERROR LOADING MODEL/PREPROCESSOR")
    print("======================================")
    print(str(e))
    print("======================================")

    model = None
    preprocessor = None


# =========================================================
# INPUT FORMAT
# =========================================================

class PredictionInput(BaseModel):

    day_of_week: str
    destination: str
    time_of_day: str
    weather: str
    trip_duration: str

    item: str

    item_relevance: float
    item_importance: float
    times_carried_before: float
    previous_forget_count: float


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "What Did I Forget? API is running!",
        "status": "online"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    if model is None or preprocessor is None:

        return {
            "status": "error",
            "model_loaded": False,
            "preprocessor_loaded": False
        }

    return {
        "status": "healthy",
        "model_loaded": True,
        "preprocessor_loaded": True
    }


# =========================================================
# PREDICTION
# =========================================================

@app.post("/predict")
def predict(data: PredictionInput):

    try:

        # -------------------------------------------------
        # Check model
        # -------------------------------------------------

        if model is None or preprocessor is None:

            raise HTTPException(
                status_code=500,
                detail="Model or preprocessor could not be loaded."
            )


        # -------------------------------------------------
        # Convert input into DataFrame
        # -------------------------------------------------

        input_data = pd.DataFrame([{

            "day_of_week": data.day_of_week,

            "destination": data.destination,

            "time_of_day": data.time_of_day,

            "weather": data.weather,

            "trip_duration": data.trip_duration,

            "item": data.item,

            "item_relevance": data.item_relevance,

            "item_importance": data.item_importance,

            "times_carried_before": data.times_carried_before,

            "previous_forget_count": data.previous_forget_count

        }])


        print("\n======================================")
        print("NEW PREDICTION REQUEST")
        print("======================================")

        print(input_data)


        # -------------------------------------------------
        # PREPROCESS
        # -------------------------------------------------

        processed_data = preprocessor.transform(input_data)


        # -------------------------------------------------
        # PREDICT
        # -------------------------------------------------

        probabilities = model.predict_proba(processed_data)[0]


        # -------------------------------------------------
        # Find probability of class 1
        # -------------------------------------------------

        if hasattr(model, "classes_"):

            classes = list(model.classes_)

            if 1 in classes:

                forget_probability = probabilities[
                    classes.index(1)
                ]

            else:

                forget_probability = max(probabilities)

        else:

            forget_probability = max(probabilities)


        forget_probability = float(forget_probability)

        forget_percentage = forget_probability * 100


        # -------------------------------------------------
        # THRESHOLD
        # -------------------------------------------------
        #
        # Final threshold selected for this project = 0.35
        #
        # -------------------------------------------------

        threshold = 0.35


        if forget_probability >= threshold:

            prediction_label = "FORGOT"

        else:

            prediction_label = "NOT FORGOTTEN"


        # -------------------------------------------------
        # RISK
        # -------------------------------------------------

        if forget_probability >= 0.60:

            risk = "HIGH"

        elif forget_probability >= 0.35:

            risk = "MEDIUM"

        else:

            risk = "LOW"


        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        result = {

            "item": data.item,

            "forget_probability": round(
                forget_probability,
                4
            ),

            "forget_percentage": round(
                forget_percentage,
                2
            ),

            "prediction": prediction_label,

            "risk": risk,

            "threshold": threshold

        }


        print("\nRESULT:")
        print(result)

        print("======================================\n")


        return result


    except HTTPException:

        raise


    except Exception as e:

        print("\n======================================")
        print("PREDICTION ERROR")
        print("======================================")

        print(str(e))

        print("======================================\n")


        raise HTTPException(

            status_code=500,

            detail=str(e)

        )