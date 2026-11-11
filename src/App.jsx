import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, products } from './data/catalog'
import ProductCard from './components/ProductCard'
import ProductImage from './components/ProductImage'
import './App.css'


function App() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [showSaved, setShowSaved] = useState(false)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('atelier-saved') || '[]')
      return Array.isArray(saved) ? saved.filter((id) => products.some((product) => product.id === id)) : []
    } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem('atelier-saved', JSON.stringify(savedIds)) } catch { /* Keep saved items for this session. */ }
  }, [savedIds])
  const toggleSaved = (id) => setSavedIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id])
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('atelier-bag') || '[]')
      return Array.isArray(saved) ? saved.map((id) => products.find((product) => product.id === id)).filter(Boolean) : []
    } catch {
      return []
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('atelier-bag', JSON.stringify(cart.map((item) => item.id)))
    } catch {
      // Keep the bag available for the current session if storage is unavailable.
    }
  }, [cart])
  useEffect(() => {
    const syncSavedState = (event) => {
      if (event.storageArea !== localStorage) return
      try {
        if (event.key === 'atelier-bag' || event.key === null) {
          const ids = JSON.parse(event.key === null ? '[]' : event.newValue || '[]')
          if (Array.isArray(ids)) setCart(ids.map((id) => products.find((product) => product.id === id)).filter(Boolean))
        }
        if (event.key === 'atelier-saved' || event.key === null) {
          const ids = JSON.parse(event.key === null ? '[]' : event.newValue || '[]')
          if (Array.isArray(ids)) setSavedIds([...new Set(ids.filter((id) => products.some((product) => product.id === id)))])
        }
      } catch {
        // Ignore malformed values and retain the current view.
      }
    }
    window.addEventListener('storage', syncSavedState)
    return () => window.removeEventListener('storage', syncSavedState)
  }, [])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [detailQuantity, setDetailQuantity] = useState(1)
  const openProduct = (product) => {
    setDetailQuantity(1)
    setSelectedProduct(product)
  }
  const productDialog = useRef(null)
  useEffect(() => {
    const dialog = productDialog.current
    if (selectedProduct && !dialog.open) dialog.showModal()
    if (!selectedProduct && dialog.open) dialog.close()
    return () => { if (dialog.open) dialog.close() }
  }, [selectedProduct])
  const [cartOpen, setCartOpen] = useState(false)
  const bagDialog = useRef(null)
  useEffect(() => {
    const dialog = bagDialog.current
    if (cartOpen && !dialog.open) dialog.showModal()
    if (!cartOpen && dialog.open) dialog.close()
    return () => { if (dialog.open) dialog.close() }
  }, [cartOpen])
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matches = products.filter((product) =>
      (!showSaved || savedIds.includes(product.id)) &&
      (category === 'All' || product.category === category) &&
      `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery),
    )
    if (sort === 'price-low') return matches.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') return matches.sort((a, b) => b.price - a.price)
    return matches
  }, [category, query, sort, showSaved, savedIds])
  const hasActiveFilters = category !== 'All' || query.trim() !== '' || showSaved || sort !== 'featured'
  const clearFilters = () => {
    setCategory('All')
    setQuery('')
    setSort('featured')
    setShowSaved(false)
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const bagItems = products.map((product) => ({
    ...product,
    quantity: cart.filter((item) => item.id === product.id).length,
  })).filter((item) => item.quantity > 0)
  const changeQuantity = (product, amount) => {
    setCart((current) => {
      if (amount > 0) return [...current, product]
      const index = current.findIndex((item) => item.id === product.id)
      return index < 0 ? current : current.filter((_, itemIndex) => itemIndex !== index)
    })
  }
  const removeProduct = (id) => setCart((current) => current.filter((item) => item.id !== id))
  return <>
    <div className="announcement">Thoughtfully chosen for everyday living <span>✦</span> Discover the collection</div>
    <header className="header"><a className="brand" href="#top">ATELIER<span>.</span></a><nav aria-label="Main navigation"><a href="#collection">Shop</a><a href="#story">Our story</a><a href="#newsletter">Journal</a></nav><button className="bag" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${cart.length} items`}>Bag <span>{cart.length}</span></button></header>
    <main id="top"><section className="hero"><div className="hero-copy"><p className="eyebrow">THE ART OF EVERYDAY</p><h1>Objects for a<br/><em>life well lived.</em></h1><p>Beautifully considered essentials, made for the moments that make a home.</p><a className="button" href="#collection">Explore the collection <span>↗</span></a><div className="hero-note"><span>01 / 04</span><span>CURATED WITH CARE</span></div></div><div className="hero-image" role="img" aria-label="A warm, thoughtfully styled living space"><div className="image-caption">MADE TO BE KEPT <span>↘</span></div></div></section>
    <section className="values"><div><span>✳</span><p>Considered design<small>Made to live with</small></p></div><div><span>◇</span><p>Everyday quality<small>Thoughtful details</small></p></div><div><span>↗</span><p>Timeless pieces<small>For years to come</small></p></div></section>
    <section className="collection" id="collection"><div className="section-head"><div><p className="eyebrow">A LITTLE SOMETHING SPECIAL</p><h2>Find your everyday.</h2></div><p>Useful things, beautiful details.<br/>A collection made for living.</p></div><div className="filters" aria-label="Product categories">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div><div className="catalog-tools"><label>Search products<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an item" /></label><label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><button className="saved-filter" aria-pressed={showSaved} onClick={() => setShowSaved((current) => !current)}>Saved ({savedIds.length})</button></div><div className="catalog-summary"><p className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'item' : 'items'}</p>{hasActiveFilters && <button className="clear-filters" onClick={clearFilters}>Clear filters</button>}</div>{visible.length === 0 && <div className="empty-results"><p>{showSaved && savedIds.length === 0 ? 'You have no saved items yet. Select the heart on an item to save it here.' : 'No items match your selection. Try a different search or category.'}</p><button className="clear-filters" onClick={clearFilters}>View all items</button></div>}<div className="products">{visible.map((product) => <ProductCard key={product.id} product={product} saved={savedIds.includes(product.id)} onToggleSaved={toggleSaved} onAddToBag={(item) => setCart((current) => [...current, item])} onOpenDetails={openProduct} />)}</div></section>
    <section className="story" id="story"><p className="eyebrow">A MORE THOUGHTFUL EVERYDAY</p><h2>Less, but better.</h2><p>We believe the things we surround ourselves with should bring a little more intention to every day.</p><a href="#collection">Discover our collection ↗</a></section>
    <section className="newsletter" id="newsletter"><div><p className="eyebrow">NOTES FROM ATELIER</p><h2>Good things, occasionally.</h2><p>New arrivals and inspiration for a more considered life.</p></div><a href="mailto:hello@example.com?subject=Atelier%20updates">Get in touch ↗</a></section></main>
    <footer><a className="brand" href="#top">ATELIER<span>.</span></a><p>Thoughtful objects for everyday life.</p><span>© {new Date().getFullYear()} Atelier. All rights reserved.</span></footer>
    <dialog ref={productDialog} className="product-dialog" aria-labelledby="product-dialog-title" onCancel={(event) => { event.preventDefault(); setSelectedProduct(null) }} onClick={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null) }}>
      {selectedProduct && <div className="product-dialog-content"><button className="product-dialog-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details">×</button><ProductImage product={selectedProduct} /><div className="product-dialog-copy"><p className="eyebrow">{selectedProduct.category}</p><h2 id="product-dialog-title">{selectedProduct.name}</h2><p className="detail-price">${selectedProduct.price}</p><p className="detail-description">A considered addition to your everyday collection.</p><div className="detail-quantity"><span>Quantity</span><div className="quantity-controls" aria-label={`Quantity for ${selectedProduct.name}`}><button onClick={() => setDetailQuantity((quantity) => Math.max(1, quantity - 1))} disabled={detailQuantity === 1} aria-label="Decrease quantity">−</button><span aria-live="polite">{detailQuantity}</span><button onClick={() => setDetailQuantity((quantity) => Math.min(20, quantity + 1))} disabled={detailQuantity === 20} aria-label="Increase quantity">+</button></div></div><button className="button detail-add" onClick={() => { setCart((current) => [...current, ...Array(detailQuantity).fill(selectedProduct)]); setSelectedProduct(null); setCartOpen(true) }}>Add to bag · ${selectedProduct.price * detailQuantity} <span>↗</span></button><button className="detail-save" aria-pressed={savedIds.includes(selectedProduct.id)} onClick={() => toggleSaved(selectedProduct.id)}>{savedIds.includes(selectedProduct.id) ? '♥ Saved to your list' : '♡ Save for later'}</button></div></div>}
    </dialog>
    <dialog ref={bagDialog} className="drawer" aria-labelledby="bag-title" onCancel={(event) => { event.preventDefault(); setCartOpen(false) }} onClick={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><div className="drawer-head"><h2 id="bag-title">Your bag</h2><button onClick={() => setCartOpen(false)} aria-label="Close bag">×</button></div>{cart.length === 0 ? <p>Your bag is waiting for something special.</p> : <><ul className="bag-items">{bagItems.map((item) => <li key={item.id}><ProductImage product={item} decorative /><div className="bag-item-details"><strong>{item.name}</strong><small>${item.price} each</small><div className="quantity-controls" aria-label={`Quantity for ${item.name}`}><button onClick={() => changeQuantity(item, -1)} aria-label={`Decrease quantity of ${item.name}`}>−</button><span aria-live="polite">{item.quantity}</span><button onClick={() => changeQuantity(item, 1)} aria-label={`Increase quantity of ${item.name}`}>+</button></div></div><div className="bag-item-total"><strong>${item.price * item.quantity}</strong><button onClick={() => removeProduct(item.id)} aria-label={`Remove ${item.name} from bag`}>Remove</button></div></li>)}</ul><div className="subtotal"><span>Subtotal</span><strong>${total}</strong></div><p className="cart-note">Checkout will be available when the store opens.</p></>}</dialog>
  </>
}
export default App
