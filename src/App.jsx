import { useEffect, useMemo, useState } from 'react'
import './App.css'

const products = [
  { id: 1, name: 'The Everyday Tote', category: 'Accessories', price: 48, color: '#e3ded3', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Ceramic Pour Over', category: 'Home', price: 38, color: '#e5e0d9', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Essential Notebook', category: 'Desk', price: 24, color: '#dedbd2', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Linen Cushion', category: 'Home', price: 42, color: '#e6e1d9', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80' },
]
const categories = ['All', 'Home', 'Accessories', 'Desk']
function App() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
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
  const [cartOpen, setCartOpen] = useState(false)
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matches = products.filter((product) =>
      (category === 'All' || product.category === category) &&
      `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery),
    )
    if (sort === 'price-low') return matches.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') return matches.sort((a, b) => b.price - a.price)
    return matches
  }, [category, query, sort])
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  return <>
    <div className="announcement">Thoughtfully chosen for everyday living <span>✦</span> Discover the collection</div>
    <header className="header"><a className="brand" href="#top">ATELIER<span>.</span></a><nav aria-label="Main navigation"><a href="#collection">Shop</a><a href="#story">Our story</a><a href="#newsletter">Journal</a></nav><button className="bag" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${cart.length} items`}>Bag <span>{cart.length}</span></button></header>
    <main id="top"><section className="hero"><div className="hero-copy"><p className="eyebrow">THE ART OF EVERYDAY</p><h1>Objects for a<br/><em>life well lived.</em></h1><p>Beautifully considered essentials, made for the moments that make a home.</p><a className="button" href="#collection">Explore the collection <span>↗</span></a><div className="hero-note"><span>01 / 04</span><span>CURATED WITH CARE</span></div></div><div className="hero-image" role="img" aria-label="A warm, thoughtfully styled living space"><div className="image-caption">MADE TO BE KEPT <span>↘</span></div></div></section>
    <section className="values"><div><span>✳</span><p>Considered design<small>Made to live with</small></p></div><div><span>◇</span><p>Everyday quality<small>Thoughtful details</small></p></div><div><span>↗</span><p>Timeless pieces<small>For years to come</small></p></div></section>
    <section className="collection" id="collection"><div className="section-head"><div><p className="eyebrow">A LITTLE SOMETHING SPECIAL</p><h2>Find your everyday.</h2></div><p>Useful things, beautiful details.<br/>A collection made for living.</p></div><div className="filters" aria-label="Product categories">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div><div className="catalog-tools"><label>Search products<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an item" /></label><label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div><p className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'item' : 'items'}</p>{visible.length === 0 && <p className="empty-results">No items match your search. Try a different search or category.</p>}<div className="products">{visible.map((product) => <article className="product" key={product.id}><div className="product-image" style={{backgroundColor: product.color}}><img src={product.image} alt={product.name} loading="lazy"/><button onClick={() => setCart([...cart, product])} aria-label={`Add ${product.name} to bag`}>+</button></div><div className="product-info"><div><small>{product.category}</small><h3>{product.name}</h3></div><span>${product.price}</span></div></article>)}</div></section>
    <section className="story" id="story"><p className="eyebrow">A MORE THOUGHTFUL EVERYDAY</p><h2>Less, but better.</h2><p>We believe the things we surround ourselves with should bring a little more intention to every day.</p><a href="#collection">Discover our collection ↗</a></section>
    <section className="newsletter" id="newsletter"><div><p className="eyebrow">NOTES FROM ATELIER</p><h2>Good things, occasionally.</h2><p>New arrivals and inspiration for a more considered life.</p></div><a href="mailto:hello@example.com?subject=Atelier%20updates">Get in touch ↗</a></section></main>
    <footer><a className="brand" href="#top">ATELIER<span>.</span></a><p>Thoughtful objects for everyday life.</p><span>© {new Date().getFullYear()} Atelier. All rights reserved.</span></footer>
    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping bag"><div className="drawer-head"><h2>Your bag</h2><button onClick={() => setCartOpen(false)} aria-label="Close bag">×</button></div>{cart.length === 0 ? <p>Your bag is waiting for something special.</p> : <><ul>{cart.map((item, index) => <li key={`${item.id}-${index}`}><span>{item.name}<small>${item.price}</small></span><button onClick={() => setCart(cart.filter((_, i) => i !== index))}>Remove</button></li>)}</ul><div className="subtotal"><span>Subtotal</span><strong>${total}</strong></div><p className="cart-note">Checkout will be available when the store opens.</p></>}</aside></div>}
  </>
}
export default App
