import { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { registerUser} from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]  = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await registerUser(name, email, password)
      navigate('/login')
    }catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-slate-800">
          Créer un compte
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}


        <label className="block mb-4">
          <span className="text-sm text-slate-600">Nom</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-slate-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-slate-600">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700"
        >
          S'inscrire
        </button>

        <p className="mt-4 text-sm text-slate-600 text-center">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-slate-800 underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register