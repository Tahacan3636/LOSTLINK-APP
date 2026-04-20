import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Auth state'i tüm uygulama ağacına yayalım: navbar, sayfalar, protected route
// hepsi oturum bilgisine ihtiyaç duyuyor. Context bu paylaşımı sağlar.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // İlk yüklemede mevcut oturumu al (sayfa yenilemesinde login korunsun).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    // Oturum değişirse (login/logout) state'i otomatik güncelle.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signIn:  (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp:  (email, password) => supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
