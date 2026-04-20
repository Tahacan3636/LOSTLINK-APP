import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES, getBrowserLocation } from '../lib/utils'

export default function CreateItem() {
  const { user } = useAuth()
  const nav = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'telefon',
    status: 'lost',
    location_text: '',
    latitude: null,
    longitude: null,
    contact_email: user?.email || '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)

  function handleFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function fetchLocation() {
    try {
      setGeoLoading(true); setErr(null)
      const { lat, lng } = await getBrowserLocation()
      setForm(s => ({ ...s, latitude: lat, longitude: lng }))
    } catch (e) {
      setErr('Konum alınamadı. Tarayıcı izni ver veya elle gir.')
    } finally {
      setGeoLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      // 1) Varsa fotoğrafı Storage'a yükle.
      let image_url = null
      if (file) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: upErr } = await supabase
          .storage.from('item-photos')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (upErr) throw upErr
        const { data } = supabase.storage.from('item-photos').getPublicUrl(path)
        image_url = data.publicUrl
      }
      // 2) items tablosuna kaydet.
      const { data: inserted, error: insErr } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description,
          category: form.category,
          status: form.status,
          image_url,
          latitude: form.latitude,
          longitude: form.longitude,
          location_text: form.location_text || null,
          contact_email: form.contact_email || user.email,
        })
        .select()
        .single()
      if (insErr) throw insErr
      nav(`/items/${inserted.id}`)
    } catch (e) {
      setErr(e.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-1">İlan Ver</h1>
      <p className="text-slate-500 mb-6">Kaybettiğin veya bulduğun bir eşya var mı? Detayları paylaş, birlikte buluşturalım.</p>

      {err && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{err}</div>}

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Durum seçici: radyo gibi çalışan iki büyük kart */}
        <div>
          <label className="label">Durum</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'lost',  title: 'KAYIP',   desc: 'Bir eşyamı kaybettim', cls: 'border-red-300 bg-red-50 text-red-700' },
              { value: 'found', title: 'BULUNDU', desc: 'Bir eşya buldum',      cls: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, status: opt.value })}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  form.status === opt.value ? opt.cls + ' ring-2 ring-offset-1' : 'border-slate-200 bg-white text-ink-700'
                }`}
              >
                <div className="font-bold">{opt.title}</div>
                <div className="text-xs opacity-80">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Başlık</label>
          <input
            type="text" required maxLength={80}
            className="input"
            placeholder="Örn: Mavi kapaklı iPhone 13"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Kategori</label>
          <select
            className="input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Açıklama</label>
          <textarea
            required rows={4} maxLength={800}
            className="input"
            placeholder="Eşyayı tanımlayacak detayları yaz: renk, marka, özel işaretler, bulunduğu yer..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Fotoğraf (opsiyonel)</label>
          <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
          {preview && (
            <img src={preview} alt="önizleme" className="mt-3 rounded-xl max-h-48 object-cover border border-slate-200" />
          )}
        </div>

        <div>
          <label className="label">Konum</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="input flex-1"
              placeholder="Açıklayıcı konum (Örn: Beşiktaş Meydan, kampüs kantini...)"
              value={form.location_text}
              onChange={(e) => setForm({ ...form, location_text: e.target.value })}
            />
            <button type="button" onClick={fetchLocation} className="btn-dark" disabled={geoLoading}>
              {geoLoading ? 'Alınıyor...' : '📍 Konumumu Al'}
            </button>
          </div>
          {form.latitude && (
            <p className="text-xs text-emerald-700 mt-2">
              ✓ Koordinat: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
            </p>
          )}
        </div>

        <div>
          <label className="label">İletişim E-postası</label>
          <input
            type="email" required
            className="input"
            value={form.contact_email}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
          />
          <p className="text-xs text-slate-400 mt-1">Diğer kullanıcılar bu e-postadan sana ulaşacak.</p>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Paylaşılıyor...' : '🚀 İlanı Paylaş'}
        </button>
      </form>
    </div>
  )
}
