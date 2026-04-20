import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../lib/supabase'
import { CATEGORIES, categoryLabel } from '../lib/utils'
import Loader from '../components/Loader'

// Kayıp -> kırmızı, Bulundu -> yeşil pin.
// Leaflet default shadow ile custom DivIcon kullanıyoruz ki filtrelenebilsin.
function pinIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:30px;height:40px;">
        <div style="
          width:28px;height:28px;border-radius:50%;
          background:${color};border:3px solid white;
          box-shadow:0 4px 12px rgba(0,0,0,0.25);
        "></div>
        <div style="
          position:absolute;left:10px;top:24px;
          width:0;height:0;
          border-left:4px solid transparent;
          border-right:4px solid transparent;
          border-top:10px solid ${color};
        "></div>
      </div>`,
    iconSize: [30, 40], iconAnchor: [14, 38],
  })
}

const LOST_COLOR  = '#dc2626'
const FOUND_COLOR = '#059669'

export default function MapView() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all') // all | lost | found
  const [category, setCategory] = useState('all')

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('items')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
      setItems(data || [])
      setLoading(false)
    })()
  }, [])

  const filtered = items.filter(i =>
    (filter === 'all' || i.status === filter) &&
    (category === 'all' || i.category === category)
  )

  // Varsayılan merkez: Türkiye. İlan varsa ilk ilan.
  const center = filtered[0]
    ? [filtered[0].latitude, filtered[0].longitude]
    : [39.0, 35.0]
  const zoom = filtered[0] ? 11 : 6

  if (loading) return <Loader label="Harita hazırlanıyor..." />

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Harita</h1>
          <p className="text-slate-500 text-sm">Tüm ilanları harita üzerinde gör.</p>
        </div>
        <span className="text-xs text-slate-400">{filtered.length} konumlu ilan</span>
      </div>

      <div className="card flex flex-wrap items-end gap-3">
        <div>
          <label className="label">Durum</label>
          <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tümü</option>
            <option value="lost">Kayıp</option>
            <option value="found">Bulundu</option>
          </select>
        </div>
        <div>
          <label className="label">Kategori</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Tüm kategoriler</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{background:LOST_COLOR}}/> Kayıp</span>
          <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{background:FOUND_COLOR}}/> Bulundu</span>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="h-[70vh]">
          <MapContainer center={center} zoom={zoom} scrollWheelZoom>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(i => (
              <Marker
                key={i.id}
                position={[i.latitude, i.longitude]}
                icon={pinIcon(i.status === 'lost' ? LOST_COLOR : FOUND_COLOR)}
              >
                <Popup>
                  <div className="space-y-1 min-w-[180px]">
                    <div className="flex gap-1 mb-1">
                      <span className={i.status === 'lost' ? 'badge-lost' : 'badge-found'}>
                        {i.status === 'lost' ? 'KAYIP' : 'BULUNDU'}
                      </span>
                      <span className="badge-cat">{categoryLabel(i.category)}</span>
                    </div>
                    <div className="font-bold text-ink-900">{i.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-2">{i.description}</div>
                    <Link to={`/items/${i.id}`} className="text-brand-600 text-xs font-semibold">Detay →</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
