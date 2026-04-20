import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setErr(null); setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) return setErr(error.message)
    nav('/')
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="text-center mb-6">
        <Logo variant="image" size="lg" className="mx-auto" />
        <p className="text-ink-700 mt-2 font-medium">Kayıp eşyanı buluşturan platform</p>
      </div>

      <div className="card">
        <h1 className="text-2xl font-extrabold mb-1">Giriş Yap</h1>
        <p className="text-slate-500 text-sm mb-6">Hesabına giriş yaparak ilan verebilir ve ilanları yönetebilirsin.</p>

        {err && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">E-posta</label>
            <input
              type="email" required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Şifre</label>
            <input
              type="password" required minLength={6}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Hesabın yok mu? <Link to="/register" className="text-brand-600 font-semibold">Kayıt ol</Link>
        </p>
      </div>
    </div>
  )
}
