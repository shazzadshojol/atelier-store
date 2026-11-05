export const products = [
  { id: 1, name: 'The Everyday Tote', category: 'Accessories', price: 48, color: '#e3ded3', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Ceramic Pour Over', category: 'Home', price: 38, color: '#e5e0d9', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Essential Notebook', category: 'Desk', price: 24, color: '#dedbd2', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Linen Cushion', category: 'Home', price: 42, color: '#e6e1d9', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80' },
]
export const categories = ['All', ...new Set(products.map((product) => product.category))]
