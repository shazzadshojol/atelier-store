import { useState } from 'react'

export default function ProductImage({ product, loading = 'eager', decorative = false }) {
  const [failedSource, setFailedSource] = useState(null)
  const unavailable = failedSource === product.image

  if (unavailable) {
    return <div className="product-image-fallback" style={{ backgroundColor: product.color }} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : `${product.name}: image unavailable`} aria-hidden={decorative || undefined}><span aria-hidden="true">✳</span><span>{product.name}</span></div>
  }

  return <img src={product.image} alt={decorative ? '' : product.name} loading={loading} onError={() => setFailedSource(product.image)} />
}
