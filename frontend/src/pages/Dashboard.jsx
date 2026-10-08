import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'
import { getExpenses } from '../services/api'
import Navbar from '../components/Navbar'

function Dashboard() {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .catch((err) => console.error(err))
  }, [])

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }))

  const topCategory = categoryBreakdown.reduce(
    (top, c) => (c.amount > (top?.amount || 0) ? c : top),
    null
  )

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Navbar />
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h1>

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-slate-500">Total dépensé</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">
            {totalSpent} TND
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-slate-500">Catégorie principale</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">
            {topCategory ? topCategory.category : '—'}
          </p>
          <p className="text-sm text-slate-500">
            {topCategory ? `${topCategory.amount} TND` : ''}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-slate-500">Transactions</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">
            {expenses.length}
          </p>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Dépenses par catégorie</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryBreakdown}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#475569" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Transactions récentes</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Date</th>
              <th className="py-2">Description</th>
              <th className="py-2">Catégorie</th>
              <th className="py-2">Paiement</th>
              <th className="py-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-b border-slate-100">
                <td className="py-2">{e.date}</td>
                <td className="py-2">{e.description}</td>
                <td className="py-2">{e.category}</td>
                <td className="py-2">{e.payment_method}</td>
                <td className="py-2 text-right">{e.amount} TND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard