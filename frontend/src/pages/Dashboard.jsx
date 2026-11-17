import { useState, useEffect } from 'react'
import { getExpenses, getSummary, getCategoriesBreakdown, getForecast, getAnomalies } from '../services/api'
import Navbar from '../components/Navbar'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function formatAmount(n) {
  return `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`
}

const CATEGORY_COLORS = ['#2F6F5E', '#C99A3C', '#C4573B', '#6B8E8A', '#A8762C', '#8B4332']

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-ink text-cream px-3 py-2 rounded text-sm">
      {label && <p className="font-medium mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey || p.name} className="text-cream/80">
          {p.name}: {formatAmount(p.value)}
        </p>
      ))}
    </div>
  )
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-ink/10">
      <p className="text-xs uppercase tracking-wide text-ink/50 mb-2">{label}</p>
      <p className="text-2xl font-display text-ink">{value}</p>
      {sub && <p className={`text-sm mt-1 ${accent || 'text-ink/50'}`}>{sub}</p>}
    </div>
  )
}

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [forecast, setForecast] = useState(null)
  const [anomalies, setAnomalies] = useState(null)

  useEffect(() => {
    getExpenses().then(setExpenses).catch(console.error)
    getSummary().then(setSummary).catch(console.error)
    getCategoriesBreakdown().then(setCategoryBreakdown).catch(console.error)
    getForecast().then(setForecast).catch(console.error)
    getAnomalies().then(setAnomalies).catch(console.error)
  }, [])

  function buildForecastChartData(data) {
    if (!data || !data.history || data.error) return []
    const chartData = data.history.map((h) => ({ month: h.month, actual: h.total, predicted: null }))
    if (data.forecast && data.forecast.length > 0 && chartData.length > 0) {
      chartData[chartData.length - 1].predicted = chartData[chartData.length - 1].actual
      const [lastYear, lastMonth] = data.history[data.history.length - 1].month.split('-').map(Number)
      data.forecast.forEach((p) => {
        const date = new Date(lastYear, lastMonth - 1 + p.month_offset, 1)
        const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        chartData.push({ month: label, actual: null, predicted: p.predicted_total })
      })
    }
    return chartData
  }

  if (!summary) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-ink/60">Chargement...</div>
  }

  const hasAnomalies = anomalies && !anomalies.error && anomalies.anomalies_found > 0

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-display text-3xl text-ink mb-1">Bonjour :)</h1>
        <p className="text-sm text-ink/60 mb-8">Voici un aperçu de vos finances</p>

        {/* Cartes de stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total dépensé" value={formatAmount(summary.total_spent)} />
          <StatCard
            label="Catégorie principale"
            value={summary.top_category || '—'}
            sub={formatAmount(summary.top_category_amount)}
          />
          <StatCard label="Transactions" value={summary.transaction_count} />
          <StatCard
            label="Tendance"
            value={forecast && !forecast.error ? formatAmount(Math.abs(forecast.trend_per_month)) : '—'}
            sub={forecast && !forecast.error ? (forecast.trend_per_month >= 0 ? '↑ par mois' : '↓ par mois') : null}
            accent={forecast && forecast.trend_per_month >= 0 ? 'text-anomaly' : 'text-forest'}
          />
        </div>

        {/* Anomalies, si présentes */}
        {hasAnomalies && (
          <div className="border-l-4 border-anomaly bg-anomaly/5 px-5 py-4 mb-8 rounded-r-xl">
            <p className="text-sm font-medium text-anomaly mb-2">
              {anomalies.anomalies_found} dépense{anomalies.anomalies_found > 1 ? 's' : ''} inhabituelle{anomalies.anomalies_found > 1 ? 's' : ''} détectée{anomalies.anomalies_found > 1 ? 's' : ''}
            </p>
            <ul className="text-sm text-ink/70 space-y-1">
              {anomalies.anomalies.slice(0, 3).map((a) => (
                <li key={a.id}>{a.category} — {formatAmount(a.amount)} le {a.date.slice(0, 10)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Camembert + Prévision côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-5 border border-ink/10">
            <h2 className="font-display text-lg text-ink mb-4">Répartition par catégorie</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 border border-ink/10">
            <h2 className="font-display text-lg text-ink mb-4">Prévision des dépenses</h2>
            {!forecast ? (
              <p className="text-sm text-ink/50">Chargement...</p>
            ) : forecast.error ? (
              <p className="text-sm text-ink/50">{forecast.error}</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={buildForecastChartData(forecast)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C2B28" opacity={0.08} />
                  <XAxis dataKey="month" stroke="#1C2B28" opacity={0.6} tickLine={false} axisLine={{ stroke: '#1C2B28', opacity: 0.1 }} fontSize={12} />
                  <YAxis stroke="#1C2B28" opacity={0.6} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="actual" name="Réel" stroke="#2F6F5E" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
                  <Line type="monotone" dataKey="predicted" name="Prévision" stroke="#C99A3C" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Transactions récentes */}
        <div className="bg-white rounded-xl p-5 border border-ink/10">
          <h2 className="font-display text-lg text-ink mb-4">Transactions récentes</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-ink/50">
                <th className="py-2 font-normal">Date</th>
                <th className="py-2 font-normal">Description</th>
                <th className="py-2 font-normal">Catégorie</th>
                <th className="py-2 font-normal">Paiement</th>
                <th className="py-2 font-normal text-right">Montant</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard