import ProductImage from './ProductImage'

export default function ProductCard({ product, saved, onToggleSaved, onAddToBag, onOpenDetails }) {
  const savedLabel = saved ? `Remove ${product.name} from saved items` : `Save ${product.name} to saved items`

  return (
    <article className="product">
      <div className="product-image" style={{ backgroundColor: product.color }}>
        <ProductImage product={product} loading="lazy" />
        <button className="save-product" onClick={() => onToggleSaved(product.id)} aria-label={savedLabel} aria-pressed={saved}>
          {saved ? '♥' : '♡'}
        </button>
        <button onClick={() => onAddToBag(product)} aria-label={`Add ${product.name} to bag`}>+</button>
      </div>
      <div className="product-info">
        <div>
          <small>{product.category}</small>
          <h3><button className="product-detail-trigger" onClick={() => onOpenDetails(product)}>{product.name}</button></h3>
        </div>
        <span>${product.price}</span>
      </div>
    </article>
  )
}
