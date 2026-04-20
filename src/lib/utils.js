// Sabit kategori listesi — tek yerden yönetilir ki form ve filtre aynı olsun.
export const CATEGORIES = [
  { value: 'telefon',     label: 'Telefon',    icon: '📱' },
  { value: 'canta',       label: 'Çanta',      icon: '👜' },
  { value: 'anahtar',     label: 'Anahtar',    icon: '🔑' },
  { value: 'cuzdan',      label: 'Cüzdan',     icon: '💳' },
  { value: 'belge',       label: 'Belge/Kimlik', icon: '📄' },
  { value: 'elektronik',  label: 'Elektronik', icon: '💻' },
  { value: 'giyim',       label: 'Giyim',      icon: '🧥' },
  { value: 'aksesuar',    label: 'Aksesuar',   icon: '⌚' },
  { value: 'diger',       label: 'Diğer',      icon: '📦' },
]

export function categoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label ?? value
}

// Haversine formülü: iki koordinat arası km cinsinden mesafe.
// Kayıp/bulunan eşleşmesinde "yakın mı?" kontrolü için kullanılır.
export function distanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some(v => v == null)) return null
  const R = 6371 // Dünya yarıçapı km
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Tarihi "2 saat önce" / "3 gün önce" gibi göster.
export function timeAgo(iso) {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)      return 'az önce'
  if (diff < 3600)    return `${Math.floor(diff / 60)} dakika önce`
  if (diff < 86400)   return `${Math.floor(diff / 3600)} saat önce`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} gün önce`
  return new Date(iso).toLocaleDateString('tr-TR')
}

// Kullanıcının tarayıcı konumunu al — Geolocation API Promise'e sarılı.
export function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Konum desteği yok'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}
