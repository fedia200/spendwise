from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Expense
from app.schemas.expense import ExpenseCreate, ExpenseOut

app = FastAPI(title="SpendWise API")

@app.get("/health")
def health():
  return {"status": "ok"}

@app.post("/expenses", response_model=ExpenseOut)
def create_expense(expense: ExpenseCreate, db:Session = Depends(get_db)):
  new_expense = Expense(
    user_id=1,
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
def list_expenses(db: Session = Depends(get_db)):
  return db.query(Expense).all()

from fastapi import HTTPException

@app.get("/expenses/{expense_id}", response_model=ExpenseOut)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
  expense = db.query(Expense).filter(Expense.id == expense_id).first()
  #jamais d'erreur automatique
  if expense is None:
    raise HTTPException(status_code=404, detail="Expense not found")
  return expense


@app.put("/expenses/{expense_id}", response_model=ExpenseOut)
def update_expense(expense_id: int, updated: ExpenseCreate, db: Session = Depends(get_db)):
  expense = db.query(Expense).filter(Expense.id == expense_id).first()
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
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
  expense = db.query(Expense).filter(Expense.id == expense_id).first()
  if expense is None: raise HTTPException(status_code=404, detail="Expense not found")
  
  db.delete(expense)
  db.commit()
  return {"detail" : "Expense deleted"}

  