import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/utils'
import ItemCard from '../components/ItemCard'
import Loader from '../components/Loader'
import Logo from '../components/Logo'

export default function Home() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [err, setErr]           = useState(null)

  // Filtre state'i
  const [q, setQ]               = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus]     = useState('all')
  const [sort, setSort]         = useState('new')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) setErr(error.message)
      else       setItems(data || [])
      setLoading(false)
    })()
  }, [])

  // Filtreleme client-side — demo için yeterli, daha fazla ilan olursa server-side yapılabilir.
  const filtered = useMemo(() => {
    let list = [...items]
    if (category !== 'all') list = list.filter(i => i.category === category)
    if (status   !== 'all') list = list.filter(i => i.status === status)
    if (q.trim()) {
      const s = q.toLocaleLowerCase('tr')
      list = list.filter(i =>
        (i.title       || '').toLocaleLowerCase('tr').includes(s) ||
        (i.description || '').toLocaleLowerCase('tr').includes(s) ||
        (i.location_text || '').toLocaleLowerCase('tr').includes(s)
      )
    }
    if (sort === 'old') list.sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
    return list
  }, [items, q, category, status, sort])

  const stats = useMemo(() => ({
    total: items.length,
    lost:  items.filter(i => i.status === 'lost' && !i.is_recovered).length,
    found: items.filter(i => i.status === 'found' && !i.is_recovered).length,
    recovered: items.filter(i => i.is_recovered).length,
  }), [items])

  return (
    <div className="space-y-8">
      {/* --- HERO --- */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-gradient text-white p-8 md:p-12">
        <div className="absolute inset-0 bg-orbit opacity-60 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-brand-400/30 animate-orbit-spin" />
        <div className="absolute -left-10 -bottom-16 w-64 h-64 rounded-full border border-brand-400/20 animate-orbit-spin" style={{ animationDirection: 'reverse' }} />

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-brand-200 font-semibold tracking-widest text-xs uppercase mb-3">
              Kayıp Eşyayı Buluşturan Platform
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Kaybettiğin eşya <span className="link-word">uzak değil</span>,<br />
              yakınındaki birinde olabilir.
            </h1>
            <p className="text-brand-100/80 max-w-xl mb-6">
              Konumuna ve kategorisine göre eşleşmeleri otomatik gösteriyoruz — yapay zekâya gerek yok.
              Basit, hızlı ve topluluk tabanlı.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/create" className="btn-primary">🚀 İlan Ver</Link>
              <Link to="/map" className="btn-dark border border-white/20">🗺️ Haritayı Gör</Link>
            </div>
          </div>
          <Logo variant="image" size="xl" className="hidden md:block animate-float drop-shadow-2xl" />
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Toplam İlan"       value={stats.total}     color="text-ink-900" />
        <StatCard label="Aranıyor (Kayıp)"  value={stats.lost}      color="text-red-600" />
        <StatCard label="Bulundu — Sahibini Arıyor" value={stats.found} color="text-emerald-600" />
        <StatCard label="Mutlu Son"         value={stats.recovered} color="text-brand-600" />
      </section>

      {/* --- FİLTRELER --- */}
      <section className="card">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="label">Ara</label>
            <input
              className="input"
              placeholder="Başlık, açıklama veya konumda ara..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Kategori</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Tüm kategoriler</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Durum</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Tümü</option>
              <option value="lost">Kayıp</option>
              <option value="found">Bulundu</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-slate-500">{filtered.length} ilan</span>
          <select className="input max-w-[160px]" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">En yeni</option>
            <option value="old">En eski</option>
          </select>
        </div>
      </section>

      {/* --- LİSTE --- */}
      {loading ? (
        <Loader label="İlanlar yükleniyor..." />
      ) : err ? (
        <div className="card bg-red-50 text-red-700">Hata: {err}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <div className="text-6xl mb-4">🔎</div>
          <p className="font-semibold">Henüz ilan yok (veya filtreye uygun sonuç yok).</p>
          <p className="text-sm">İlk ilanı sen ver!</p>
        </div>
      ) : (
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => <ItemCard key={item.id} item={item} />)}
        </section>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card">
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  )
}
