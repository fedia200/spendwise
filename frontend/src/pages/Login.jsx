import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await loginUser(email, password)
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl border border-ink/10">
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
          Se connecter
        </button>

        <p className="mt-4 text-sm text-ink/60 text-center">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-forest underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login