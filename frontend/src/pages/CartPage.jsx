import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h1>Your cart is empty</h1>
          <p>Browse the catalog and add something you like.</p>
          <Link to="/" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container cart-page">
      <div className="section-head">
        <h1>Shopping cart</h1>
        <button type="button" className="btn btn-ghost" onClick={clearCart}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.productId} className="cart-item">
              <Link to={`/products/${item.productId}`} className="cart-thumb">
                <img src={item.thumbnail} alt={item.title} />
              </Link>
              <div className="cart-item-info">
                <h3>
                  <Link to={`/products/${item.productId}`}>{item.title}</Link>
                </h3>
                <p>${item.price.toFixed(2)} each</p>
                <div className="qty-controls">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-side">
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <p className="muted">Shipping and taxes calculated at checkout.</p>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to checkout
          </Link>
          <Link to="/" className="btn btn-secondary btn-block">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
