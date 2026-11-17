import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Expense, User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/expenses", tags=["import"])


@router.post("/import-csv")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Le fichier doit être au format .csv")

    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception:
        raise HTTPException(status_code=400, detail="Fichier CSV illisible")

    required_columns = {"amount", "category", "date"}
    missing = required_columns - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Colonnes manquantes dans le CSV : {', '.join(missing)}"
        )

    created = 0
    skipped = 0
    errors = []

    for idx, row in df.iterrows():
        try:
            new_expense = Expense(
                user_id=current_user.id,
                amount=float(row["amount"]),
                category=str(row["category"]),
                description=str(row.get("description", "")) if pd.notna(row.get("description", "")) else "",
                date=pd.to_datetime(row["date"]),
                payment_method=str(row.get("payment_method", "Carte")) if pd.notna(row.get("payment_method", "")) else "Carte",
            )
            db.add(new_expense)
            created += 1
        except Exception as e:
            skipped += 1
            errors.append(f"Ligne {idx + 2}: {str(e)}")

    db.commit()

    return {
        "created": created,
        "skipped": skipped,
        "errors": errors[:10],
    }