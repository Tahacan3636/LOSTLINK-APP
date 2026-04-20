import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

export default function Register() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setErr(null); setMsg(null); setLoading(true)
    const { error } = await signUp(form.email, form.password)
    setLoading(false)
    if (error) return setErr(error.message)
    // Supabase default: email confirm açıksa kullanıcı doğrulama mailinden sonra girebilir.
    // Email confirm KAPALI'ysa bu aşamadan sonra direkt login yapılabilir.
    setMsg('Kayıt başarılı. Giriş sayfasına yönlendiriliyorsun...')
    setTimeout(() => nav('/login'), 1500)
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="text-center mb-6">
        <Logo variant="image" size="lg" className="mx-auto" />
        <p className="text-ink-700 mt-2 font-medium">Aramıza katıl, kayıp eşyalarını paylaş</p>
      </div>

      <div className="card">
        <h1 className="text-2xl font-extrabold mb-1">Kayıt Ol</h1>
        <p className="text-slate-500 text-sm mb-6">LostLink hesabını oluştur — saniyeler içinde hazırsın.</p>

        {err && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{err}</div>}
        {msg && <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mb-4">{msg}</div>}

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
            <p className="text-xs text-slate-400 mt-1">En az 6 karakter.</p>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Zaten hesabın var mı? <Link to="/login" className="text-brand-600 font-semibold">Giriş yap</Link>
        </p>
      </div>
    </div>
  )
}
