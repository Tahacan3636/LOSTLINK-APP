import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../lib/supabase'
import { categoryLabel, distanceKm, timeAgo } from '../lib/utils'
import Loader from '../components/Loader'
import ItemCard from '../components/ItemCard'

// Leaflet default marker ikonunun Vite ile default yolunu düzelt.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

export default function ItemDetail() {
  const { id } = useParams()
  const [item,    setItem]    = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr]         = useState(null)

  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null)
      const { data, error } = await supabase
        .from('items').select('*').eq('id', id).single()
      if (error) { setErr(error.message); setLoading(false); return }
      setItem(data)

      // Eşleşmeleri getir: karşı statü + aynı kategori + bulundu değil.
      // Bir kayıp ilan detayındaysak, aynı kategorideki "bulundu" ilanları öneririz.
      const oppositeStatus = data.status === 'lost' ? 'found' : 'lost'
      const { data: candidates } = await supabase
        .from('items')
        .select('*')
        .eq('category', data.category)
        .eq('status', oppositeStatus)
        .eq('is_recovered', false)
        .neq('id', data.id)
        .limit(30)

      // Konum varsa mesafeye göre sırala.
      const list = (candidates || []).map(c => ({
        ...c,
        _distance: distanceKm(data.latitude, data.longitude, c.latitude, c.longitude),
      }))
      list.sort((a, b) => {
        if (a._distance == null) return 1
        if (b._distance == null) return -1
        return a._distance - b._distance
      })
      setMatches(list.slice(0, 6))
      setLoading(false)
    })()
  }, [id])

  if (loading) return <Loader />
  if (err)     return <div className="card bg-red-50 text-red-700">Hata: {err}</div>
  if (!item)   return <div className="card">İlan bulunamadı.</div>

  const isLost = item.status === 'lost'

  return (
    <div className="space-y-8">
      <Link to="/" className="text-sm text-brand-600 hover:underline">← Tüm ilanlar</Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Görsel */}
        <div className="card p-0 overflow-hidden">
          <div className="aspect-video bg-slate-100">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl text-slate-300">📷</div>
            )}
          </div>
        </div>

        {/* Bilgiler */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className={isLost ? 'badge-lost' : 'badge-found'}>
              {isLost ? 'KAYIP' : 'BULUNDU'}
            </span>
            <span className="badge-cat">{categoryLabel(item.category)}</span>
            {item.is_recovered && (
              <span className="badge bg-blue-100 text-blue-700">SAHİBİNE ULAŞTI ✓</span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold">{item.title}</h1>
          <p className="text-slate-600 whitespace-pre-wrap">{item.description}</p>
          <div className="text-sm text-slate-500 space-y-1">
            <p>📍 {item.location_text || 'Konum metni belirtilmedi'}</p>
            <p>🕒 {timeAgo(item.created_at)}</p>
          </div>

          <div className="card bg-brand-50 border-brand-200">
            <p className="text-sm font-semibold text-ink-800 mb-1">İlan sahibiyle iletişime geç</p>
            <a
              href={`mailto:${item.contact_email}?subject=LostLink: ${encodeURIComponent(item.title)}`}
              className="btn-primary"
            >
              ✉️ {item.contact_email}
            </a>
          </div>
        </div>
      </div>

      {/* Harita */}
      {item.latitude && item.longitude && (
        <div className="card p-0 overflow-hidden">
          <div className="h-[320px]">
            <MapContainer center={[item.latitude, item.longitude]} zoom={14} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[item.latitude, item.longitude]} icon={markerIcon}>
                <Popup>{item.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Eşleşmeler */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-xl font-bold">
            {isLost ? 'Olası eşleşmeler (Bulunanlar)' : 'Olası sahipler (Kayıp ilanlar)'}
          </h2>
          <span className="text-xs text-slate-400">{matches.length} sonuç</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Aynı kategori + karşıt durum + varsa yakın konum sırasına göre listeleniyor. (AI yok, kural tabanlı.)
        </p>
        {matches.length === 0 ? (
          <div className="card text-slate-500 text-sm">Henüz eşleşen bir ilan yok.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(m => (
              <div key={m.id} className="relative">
                <ItemCard item={m} />
                {m._distance != null && (
                  <span className="absolute top-2 right-2 bg-ink-900/85 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    ~{m._distance.toFixed(1)} km
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
