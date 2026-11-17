import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-ink/10 px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="font-display text-2xl leading-none flex items-baseline">
          <span className="text-ink font-semibold">spend</span>
          <span className="text-forest italic font-semibold">wise</span>
        </Link>
        <div className="flex gap-6">
          <Link to="/dashboard" className="text-ink/70 hover:text-ink font-medium transition-colors">
            Dashboard
          </Link>
          <Link to="/expenses" className="text-ink/70 hover:text-ink font-medium transition-colors">
            Dépenses
          </Link>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-anomaly hover:underline"
      >
        Déconnexion
      </button>
    </nav>
  )
}

export default Navbar