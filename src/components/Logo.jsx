// LostLink logo bileşeni.
// 1) Gerçek logo resmi (public/logo.jpeg) - büyük başlıklarda kullanılır.
// 2) Text-logo - küçük ekranlar / footer için (gradient yazı).
export default function Logo({ variant = 'text', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
    xl: 'h-28',
  }

  if (variant === 'image') {
    return (
      <img
        src="/logo.jpeg"
        alt="LostLink"
        className={`${sizes[size]} w-auto select-none ${className}`}
        draggable={false}
      />
    )
  }

  // text variant
  const textSize = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl', xl: 'text-5xl' }[size]
  return (
    <span className={`inline-flex items-baseline ${textSize} ${className}`}>
      <span className="lost-word">Lost</span>
      <span className="link-word">Link</span>
    </span>
  )
}
