export const mockSummary = {
  totalSpent: 1240,
  previousMonthSpent: 950,
  topCategory: 'Alimentation',
  topCategoryAmount: 420,
  transactionCount: 8,
}

export const mockCategoryBreakdown = [
  { category: 'Alimentation', amount: 420 },
  { category: 'Transport', amount: 180 },
  { category: 'Shopping', amount: 300 },
  { category: 'Factures', amount: 240 },
  { category: 'Autres', amount: 100 },
]

export const mockTransactions = [
  { id: 1, date: '2026-09-18', description: 'Déjeuner', category: 'Alimentation', amount: 35, paymentMethod: 'Carte' },
  { id: 2, date: '2026-09-17', description: 'Loyer', category: 'Factures', amount: 200, paymentMethod: 'Virement' },
  { id: 3, date: '2026-09-16', description: 'Taxi', category: 'Transport', amount: 12, paymentMethod: 'Espèces' },
  { id: 4, date: '2026-09-15', description: 'Courses', category: 'Alimentation', amount: 80, paymentMethod: 'Carte' },
  { id: 5, date: '2026-09-14', description: 'Vêtements', category: 'Shopping', amount: 150, paymentMethod: 'Carte' },
]