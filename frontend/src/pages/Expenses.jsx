import { useState, useEffect } from 'react'
import { getExpenses, createExpense, deleteExpense } from '../services/api'
import Navbar from '../components/Navbar'

function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [error, setError] = useState('')

  function loadExpenses() {
    getExpenses()
      .then(setExpenses)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await createExpense({
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date).toISOString(),
        payment_method: paymentMethod,
      })
      setAmount('')
      setCategory('')
      setDescription('')
      setDate('')
      setPaymentMethod('')
      loadExpenses()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id)
      loadExpenses()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Navbar />
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dépenses</h1>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          type="number"
          step="0.01"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Moyen de paiement"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700"
        >
          Ajouter
        </button>
      </form>

      <div className="bg-white rounded-lg shadow p-5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Date</th>
              <th className="py-2">Description</th>
              <th className="py-2">Catégorie</th>
              <th className="py-2">Paiement</th>
              <th className="py-2 text-right">Montant</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-b border-slate-100">
                <td className="py-2">{e.date.slice(0, 10)}</td>
                <td className="py-2">{e.description}</td>
                <td className="py-2">{e.category}</td>
                <td className="py-2">{e.payment_method}</td>
                <td className="py-2 text-right">{e.amount} TND</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Expenses