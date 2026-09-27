from sqlalchemy import Column, Integer, String, Float,DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class User(Base):
  __tablename__="users"
  
  id = Column(Integer, primary_key=True, index=True)
  name=Column(String, nullable=False)
  email = Column(String, unique=True, nullable=False,index=True)
  password_hash = Column(String, nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())

  expenses = relationship("Expense", back_populates="owner")

class Expense(Base):
  __tablename__="expenses"
  
  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer,ForeignKey("users.id"),nullable=False)
  amount = Column(Float, nullable=False)
  category = Column(String,nullable=False)
  description = Column(String, nullable=True)
  date = Column(DateTime(timezone=True), nullable=False)
  payment_method = Column(String,nullable=True)
  created_at = Column(DateTime(timezone=True),server_default=func.now())
  
  owner = relationship("User", back_populates="expenses")