import { createClient } from '@supabase/supabase-js'

// .env içinde VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalı.
// Yoksa konsola uyarı düşer, app çökmek yerine kullanıcıya bilgi verir.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  // Demo/öğrenme amaçlı: gerçek prod'da throw atılır.
  console.warn('[LostLink] Supabase ortam değişkenleri eksik. .env dosyanı doldur.')
}

export const supabase = createClient(url ?? 'http://localhost', key ?? 'public-anon-key')
