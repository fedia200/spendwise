import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-slate-800">
          Connexion à SpendWise
        </h1>

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
          Se connecter
        </button>

        <p className="mt-4 text-sm text-slate-600 text-center">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-slate-800 underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login