import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()

  async function handleLogout() {
    await signOut()
    nav('/login')
  }

  const linkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-ink-700 hover:bg-slate-100'
    }`

  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo variant="image" size="md" className="drop-shadow-sm group-hover:scale-105 transition" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkStyle}>İlanlar</NavLink>
          <NavLink to="/map" className={linkStyle}>Harita</NavLink>
          {user && <NavLink to="/create" className={linkStyle}>İlan Ver</NavLink>}
          {user && <NavLink to="/my-items" className={linkStyle}>İlanlarım</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-500 max-w-[140px] truncate">{user.email}</span>
              <button onClick={handleLogout} className="btn-ghost">Çıkış</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Giriş</Link>
              <Link to="/register" className="btn-primary">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobil alt menü */}
      <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
        <NavLink to="/" end className={linkStyle}>İlanlar</NavLink>
        <NavLink to="/map" className={linkStyle}>Harita</NavLink>
        {user && <NavLink to="/create" className={linkStyle}>İlan Ver</NavLink>}
        {user && <NavLink to="/my-items" className={linkStyle}>İlanlarım</NavLink>}
      </nav>
    </header>
  )
}
