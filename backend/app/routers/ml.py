from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import numpy as np
from sklearn.linear_model import LinearRegression

from app.database.database import get_db
from app.database.models import Expense, User
from app.core.dependencies import get_current_user
from sklearn.ensemble import IsolationForest

router = APIRouter(prefix="/ml", tags=["ml"])


@router.get("/forecast")
def forecast_expenses(
    months_ahead: int = 3,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Agrège les dépenses par mois (année-mois) pour l'utilisateur connecté
    rows = (
        db.query(
            func.date_trunc("month", Expense.date).label("month"),
            func.sum(Expense.amount).label("total"),
        )
        .filter(Expense.user_id == current_user.id)
        .group_by(func.date_trunc("month", Expense.date))
        .order_by(func.date_trunc("month", Expense.date))
        .all()
    )

    if len(rows) < 3:
        return {"error": "Pas assez d'historique pour une prévision fiable (minimum 3 mois)."}

    # X = index du mois (0, 1, 2...), y = total dépensé ce mois-là
    X = np.array(range(len(rows))).reshape(-1, 1)
    y = np.array([float(r.total) for r in rows])

    model = LinearRegression()
    model.fit(X, y)

    # Prédit les mois suivants
    future_X = np.array(range(len(rows), len(rows) + months_ahead)).reshape(-1, 1)
    predictions = model.predict(future_X)

    history = [
        {"month": r.month.strftime("%Y-%m"), "total": round(float(r.total), 2)}
        for r in rows
    ]
    forecast = [
        {"month_offset": i + 1, "predicted_total": round(max(0, float(p)), 2)}
        for i, p in enumerate(predictions)
    ]

    return {
        "history": history,
        "forecast": forecast,
        "trend_per_month": round(float(model.coef_[0]), 2),
    }
    
@router.get("/anomalies")
def detect_anomalies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.date)
        .all()
    )

    if len(expenses) < 10:
        return {"error": "Pas assez de données pour détecter des anomalies (minimum 10 dépenses)."}

    # On entraîne le modèle sur le seul montant (feature la plus discriminante ici)
    amounts = np.array([[e.amount] for e in expenses])

    model = IsolationForest(contamination=0.02, random_state=42)
    # contamination=0.02 : on s'attend à ~2% d'anomalies dans les données
    predictions = model.fit_predict(amounts)  # -1 = anomalie, 1 = normal

    anomalies = [
        {
            "id": e.id,
            "amount": e.amount,
            "category": e.category,
            "date": e.date.strftime("%Y-%m-%d"),
            "description": e.description,
        }
        for e, pred in zip(expenses, predictions)
        if pred == -1
    ]

    return {
        "total_expenses_analyzed": len(expenses),
        "anomalies_found": len(anomalies),
        "anomalies": anomalies,
    }