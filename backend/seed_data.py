import random
from datetime import datetime, timedelta
from app.database.database import SessionLocal
from app.database.models import Expense, User

db = SessionLocal()

# Récupère ton utilisateur (ajuste l'email si besoin)
user = db.query(User).filter(User.email == "azerty123@gmail.com").first()
if user is None:
    raise SystemExit("Utilisateur introuvable — vérifie l'email dans ce script.")

categories = {
    "Alimentation": (20, 80),
    "Transport": (5, 40),
    "Shopping": (30, 200),
    "Factures": (50, 150),
    "Loisirs": (10, 100),
}

start = datetime.now() - timedelta(days=450)  # ~15 mois
expenses = []

for day_offset in range(450):
    date = start + timedelta(days=day_offset)
    # 0 à 2 dépenses par jour, probabilité réaliste
    if random.random() < 0.6:
        n = random.choice([1, 1, 2])
        for _ in range(n):
            category = random.choice(list(categories.keys()))
            low, high = categories[category]
            amount = round(random.uniform(low, high), 2)
            expenses.append(Expense(
                user_id=user.id,
                amount=amount,
                category=category,
                description=f"Dépense {category.lower()}",
                date=date,
                payment_method=random.choice(["Carte", "Espèces", "Virement"]),
            ))

# Ajoute quelques anomalies volontaires pour tester la détection plus tard
for _ in range(5):
    date = start + timedelta(days=random.randint(0, 449))
    expenses.append(Expense(
        user_id=user.id,
        amount=round(random.uniform(500, 900), 2),
        category="Shopping",
        description="Achat exceptionnel",
        date=date,
        payment_method="Carte",
    ))

db.add_all(expenses)
db.commit()
print(f"{len(expenses)} dépenses créées pour {user.email}")