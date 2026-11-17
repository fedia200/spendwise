import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await registerUser(name, email, password)
      navigate('/login')
    } catch (err) {
      const detail = err.response?.data?.detail;
setError(
  Array.isArray(detail)
    ? detail.map((d) => d.msg).join(", ")
    : detail || "Une erreur est survenue"
);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-xl border border-ink/10"
      >
        <div className="font-display text-2xl leading-none flex items-baseline mb-6 justify-center">
          <span className="text-ink font-semibold">spend</span>
          <span className="text-forest italic font-semibold">wise</span>
        </div>

        {error && (
          <p className="mb-4 text-sm text-anomaly bg-anomaly/5 border-l-4 border-anomaly px-3 py-2 rounded-r">
            {error}
          </p>
        )}

        <label className="block mb-4">
          <span className="text-sm text-ink/60">Nom</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-forest transition-colors"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-ink/60">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-forest transition-colors"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-ink/60">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full border border-ink/15 rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-forest transition-colors"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-forest text-white py-2 rounded-lg font-medium hover:bg-forest/90 transition-colors"
        >
          S'inscrire
        </button>

        <p className="mt-4 text-sm text-ink/60 text-center">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-forest underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register