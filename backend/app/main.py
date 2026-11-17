from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Expense
from app.schemas.expense import ExpenseCreate, ExpenseOut

from app.schemas.user import UserCreate, UserOut, Token
from app.database.models import User
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_user
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from app.routers import ml, import_csv

app = FastAPI(title="SpendWise API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ml.router)
app.include_router(import_csv.router)

@app.get("/health")
def health():
  return {"status": "ok"}

@app.post("/expenses", response_model=ExpenseOut)
def create_expense(
  expense: ExpenseCreate,
  db:Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  new_expense = Expense(
    user_id=current_user.id,
    amount=expense.amount,
    category=expense.category,
    description=expense.description,
    date=expense.date,
    payment_method=expense.payment_method,
  )
  db.add(new_expense)
  db.commit()
  db.refresh(new_expense)
  return new_expense

@app.get("/expenses",response_model=list[ExpenseOut])
def list_expenses(
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
  ):
  return db.query(Expense).filter(Expense.user_id == current_user.id).all()

from fastapi import HTTPException

@app.get("/expenses/{expense_id}", response_model=ExpenseOut)
def get_expense(expense_id: int,
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user),
                ):
  expense = db.query(Expense).filter(
    Expense.id == expense_id,
    Expense.user_id == current_user.id,
    ).first()
  #jamais d'erreur automatique
  if expense is None:
    raise HTTPException(status_code=404, detail="Expense not found")
  return expense


@app.put("/expenses/{expense_id}", response_model=ExpenseOut)
def update_expense(
  expense_id: int,
  updated: ExpenseCreate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
  ):
  expense = db.query(Expense).filter(
    Expense.id == expense_id,
    Expense.user_id == current_user.id,
    ).first()
  if expense is None:
    raise HTTPException(status_code=404, detail="Expense not found")
  
  expense.amount = updated.amount
  expense.category = updated.category
  expense.description = updated.description
  expense.date = updated.date
  expense.payment_method = updated.payment_method
  
  db.commit()
  db.refresh(expense)
  return expense

@app.delete("/expenses/{expense_id}")
def delete_expense(
  expense_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
  ):
  expense = db.query(Expense).filter(
    Expense.id == expense_id,
    Expense.user_id == current_user.id,
    ).first()
  if expense is None: 
    raise HTTPException(status_code=404, detail="Expense not found")
  
  db.delete(expense)
  db.commit()
  return {"detail" : "Expense deleted"}
@app.get("/analytics/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()

    if not expenses:
        return {
            "total_spent": 0,
            "transaction_count": 0,
            "top_category": None,
            "top_category_amount": 0,
        }

    data = [{"amount": e.amount, "category": e.category} for e in expenses]
    df = pd.DataFrame(data)

    total_spent = df["amount"].sum()
    transaction_count = len(df)

    category_totals = df.groupby("category")["amount"].sum()
    top_category = category_totals.idxmax()
    top_category_amount = category_totals.max()

    return {
        "total_spent": float(total_spent),
        "transaction_count": int(transaction_count),
        "top_category": top_category,
        "top_category_amount": float(top_category_amount),
    }
    
@app.get("/analytics/categories")
def get_categories_breakdown(
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()
  
  if not expenses:
    return []
    
  data = [{"amount": e.amount, "category": e.category} for e in expenses]
  df = pd.DataFrame(data)
  
  category_totals = df.groupby("category")["amount"].sum()
  
  return [
    {'category': cat, "amount": float(amount)}
    for cat, amount in category_totals.items()
  ]
  
@app.get("/analytics/monthly")
def get_monthly_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()

    if not expenses:
        return []

    data = [{"amount": e.amount, "date": e.date} for e in expenses]
    df = pd.DataFrame(data)

    df["month"] = pd.to_datetime(df["date"]).dt.to_period("M").astype(str)
    monthly_totals = df.groupby("month")["amount"].sum().sort_index()

    return [
        {"month": month, "amount": float(amount)}
        for month, amount in monthly_totals.items()
    ]
    

@app.post("/auth/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
  existing_user = db.query(User).filter(User.email ==user.email).first()
  if existing_user:
    raise HTTPException(status_code=400, detail="Email already registered")
  new_user = User(
    name=user.name,
    email=user.email,
    password_hash=hash_password(user.password),
  )
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  return new_user


@app.post("/auth/login", response_model=Token)
def login(credentials: UserCreate, db: Session = Depends(get_db)):
  user = db.query(User).filter(User.email == credentials.email).first()
  if user is None or not verify_password(credentials.password, user.password_hash):
    raise HTTPException(status_code=401, detail="Incorrect email or password")
  access_token = create_access_token(data={"sub": user.email})
  return {"access_token": access_token, "token_type": "bearer"}


