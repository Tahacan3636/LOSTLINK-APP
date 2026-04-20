import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loader from './Loader'

// Auth gerektiren sayfaları saran wrapper.
// Oturum yoksa /login'e yönlendirir; yüklenirken Loader gösterir.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user)   return <Navigate to="/login" replace />
  return children
}
