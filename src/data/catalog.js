export const products = [
  { id: 1, name: 'The Everyday Tote', category: 'Accessories', description: 'An everyday carry for the things you like to keep close.', price: 48, color: '#e3ded3', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Ceramic Pour Over', category: 'Home', description: 'A simple pour-over piece for a slower coffee ritual.', price: 38, color: '#e5e0d9', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Essential Notebook', category: 'Desk', description: 'A place for notes, ideas, and the details of your day.', price: 24, color: '#dedbd2', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Linen Cushion', category: 'Home', description: 'A soft accent for a comfortable, welcoming space.', price: 42, color: '#e6e1d9', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80' },
]
export const categories = ['All', ...new Set(products.map((product) => product.category))]
