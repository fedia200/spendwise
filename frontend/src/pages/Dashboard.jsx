import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { mockSummary, mockCategoryBreakdown, mockTransactions} from '../mockData'

function Dashboard() {
  const change = ((mockSummary.totalSpent - mockSummary.previousMonthSpent) / mockSummary.previousMonthSpent) * 100
  const isIncrease = change >=0
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2x1 font-semibold text-slate-800 mb-6">Dashboard</h1>

      {/*Cartes*/}
      <div className="grid gris-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="bg-white rounded-lg shadow p-5">Total dépensé (mois)</p>
          <p className="text-2x1" font-semibold text-slate-800 mt-1>
            {mockSummary.totalSpent} TND
          </p>
        </div>

        <div className="bg-white rounded =-lf shadow p-5">
          <p className="text-sm text-slate-500">Vs mois précédent</p>
          <p className={`text-2x1 font-semibold text-slate-800 mt-1 ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
            {isIncrease ? '+' : ''}{change.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className='text-sm text-slate-500'>Catégorie principale</p>
          <p className="text-2x1 font-semibold text-slate-800 mt-1">
            {mockSummary.topCategory}
          </p>
          <p className="text-sm text-slate-500">{mockSummary.topCategoryAmount} TND</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-slate-500">Transactions</p>
          <p className="text-2x1 font-semibold text-slate-800 mt-1">
            {mockSummary.transactionCount}
          </p>
        </div>
      </div>
    
    {/* Graphique */}
      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Dépenses par catégorie</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockCategoryBreakdown}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar datakey="amount" fill="#eb9ed8" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    {/*Tableau */}
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
            {mockTransactions.map((t) =>(
              <tr key={t.id} className="border-b border-slate-100">
                <td className="py-2">{t.date}</td>
                <td className="py-2">{t.description}</td>
                <td className="py-2">{t.category}</td>
                <td className="py-2">{t.paymentMethod}</td>
                <td className="py-2 text-right">{t.amount} TND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}
export default Dashboard