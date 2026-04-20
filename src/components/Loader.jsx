export default function Loader({ label = 'Yükleniyor...' }) {
  return (
    <div className="flex items-center justify-center py-12 text-slate-500">
      <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full mr-3" />
      <span>{label}</span>
    </div>
  )
}
