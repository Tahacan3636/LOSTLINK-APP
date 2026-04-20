import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateItem from './pages/CreateItem'
import ItemDetail from './pages/ItemDetail'
import MapView from './pages/MapView'
import MyItems from './pages/MyItems'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/map"         element={<MapView />} />
          <Route path="/items/:id"   element={<ItemDetail />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/create"      element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
          <Route path="/my-items"    element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
          <Route path="*"            element={<div className="card">Sayfa bulunamadı.</div>} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} LostLink — Yazılım Mühendisliği Ödevi
      </footer>
    </div>
  )
}
