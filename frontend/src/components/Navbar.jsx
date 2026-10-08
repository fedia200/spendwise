import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between">
      <div className="flex gap-6">
        <Link to="/dashboard" className="text-slate-700 hover:text-slate-900 font-medium">
          Dashboard
        </Link>
        <Link to="/expenses" className="text-slate-700 hover:text-slate-900 font-medium">
          Dépenses
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:underline"
      >
        Déconnexion
      </button>
    </nav>
  )
}

export default Navbar