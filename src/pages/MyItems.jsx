import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { categoryLabel, timeAgo } from '../lib/utils'
import Loader from '../components/Loader'

export default function MyItems() {
  const { user } = useAuth()
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  async function toggleRecovered(item) {
    await supabase
      .from('items')
      .update({ is_recovered: !item.is_recovered })
      .eq('id', item.id)
    load()
  }

  async function remove(item) {
    if (!confirm(`"${item.title}" ilanı silinsin mi?`)) return
    await supabase.from('items').delete().eq('id', item.id)
    load()
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">İlanlarım</h1>
          <p className="text-slate-500 text-sm">Paylaştığın tüm ilanları buradan yönet.</p>
        </div>
        <Link to="/create" className="btn-primary">+ Yeni İlan</Link>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <div className="text-6xl mb-4">📦</div>
          <p className="font-semibold">Henüz ilanın yok.</p>
          <p className="text-sm">Paylaşmak için "Yeni İlan"a tıkla.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.id} className="card flex flex-col sm:flex-row gap-4">
              <Link to={`/items/${i.id}`} className="shrink-0">
                <div className="w-full sm:w-32 aspect-video sm:aspect-square rounded-lg bg-slate-100 overflow-hidden">
                  {i.image_url ? (
                    <img src={i.image_url} alt={i.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-slate-300">📷</div>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className={i.status === 'lost' ? 'badge-lost' : 'badge-found'}>
                    {i.status === 'lost' ? 'KAYIP' : 'BULUNDU'}
                  </span>
                  <span className="badge-cat">{categoryLabel(i.category)}</span>
                  {i.is_recovered && <span className="badge bg-blue-100 text-blue-700">SAHİBİNE ULAŞTI</span>}
                </div>
                <Link to={`/items/${i.id}`} className="font-bold text-ink-900 hover:text-brand-600 line-clamp-1">
                  {i.title}
                </Link>
                <p className="text-sm text-slate-600 line-clamp-2">{i.description}</p>
                <div className="text-xs text-slate-400 mt-1">{timeAgo(i.created_at)}</div>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button onClick={() => toggleRecovered(i)} className="btn-ghost text-sm">
                  {i.is_recovered ? '↩️ Geri Al' : '✓ Sahibine Ulaştı'}
                </button>
                <button onClick={() => remove(i)} className="btn-danger text-sm">🗑 Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
