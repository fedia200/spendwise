from pydantic import BaseModel
from datetime import datetime
from typing import Optional

#ExpenseCreate: ce que le frontnd envoie 
class ExpenseCreate(BaseModel):
  amount: float
  category: str
  description: Optional[str] = None
  date: datetime
  payment_method: Optional[str] = None
  

#ExpenseOut ce que l'API renvoie.
class ExpenseOut(BaseModel):
  id: int
  user_id: int
  amount: float
  category: str
  description: Optional[str] = None
  date: datetime
  payment_method: Optional[str] = None
  
  class Config:
    from_attributes = True
    
  
  