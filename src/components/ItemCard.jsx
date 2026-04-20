import { Link } from 'react-router-dom'
import { categoryLabel, timeAgo } from '../lib/utils'

// Liste ve eşleşme kartı. Detay sayfasına linkler.
export default function ItemCard({ item }) {
  const isLost = item.status === 'lost'
  return (
    <Link
      to={`/items/${item.id}`}
      className="card hover:shadow-md transition overflow-hidden p-0 flex flex-col"
    >
      <div className="aspect-video bg-slate-100 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-slate-300">📷</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={isLost ? 'badge-lost' : 'badge-found'}>
            {isLost ? 'KAYIP' : 'BULUNDU'}
          </span>
          <span className="badge-cat">{categoryLabel(item.category)}</span>
          {item.is_recovered && (
            <span className="badge bg-blue-100 text-blue-700">SAHİBİNE ULAŞTI</span>
          )}
        </div>
        <h3 className="font-semibold text-slate-900 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-2">
          <span>📍 {item.location_text || 'Konum belirtilmedi'}</span>
          <span>{timeAgo(item.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}
