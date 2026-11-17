import { useState, useEffect } from 'react'
import { getExpenses, createExpense, deleteExpense } from '../services/api'
import Navbar from '../components/Navbar'

function formatAmount(n) {
  return `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`
}

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

  const inputClass =
    "border border-ink/15 rounded-lg px-3 py-2 text-ink placeholder:text-ink/40 bg-white focus:outline-none focus:border-forest transition-colors"

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-display text-3xl text-ink mb-6">Dépenses</h1>

        {error && (
          <p className="mb-4 text-sm text-anomaly bg-anomaly/5 border-l-4 border-anomaly px-3 py-2 rounded-r">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-ink/10 p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="number"
            step="0.01"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Moyen de paiement"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            className="bg-forest text-white rounded-lg px-4 py-2 font-medium hover:bg-forest/90 transition-colors"
          >
            Ajouter
          </button>
        </form>

        <div className="bg-white rounded-xl border border-ink/10 p-5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-ink/50">
                <th className="py-2 font-normal">Date</th>
                <th className="py-2 font-normal">Description</th>
                <th className="py-2 font-normal">Catégorie</th>
                <th className="py-2 font-normal">Paiement</th>
                <th className="py-2 font-normal text-right">Montant</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b border-ink/5">
                  <td className="py-2 text-ink/70">{e.date.slice(0, 10)}</td>
                  <td className="py-2 text-ink">{e.description}</td>
                  <td className="py-2 text-ink/70">{e.category}</td>
                  <td className="py-2 text-ink/70">{e.payment_method}</td>
                  <td className="py-2 text-right text-ink">{formatAmount(e.amount)}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-anomaly hover:underline"
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
    </div>
  )
}

export default Expenses