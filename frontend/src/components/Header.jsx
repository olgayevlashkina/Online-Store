import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">F</span>
          <span className="brand-text">Forge Market</span>
        </Link>

        <nav className="nav" aria-label="Main">
          <NavLink to="/" end>
            Catalog
          </NavLink>
          <NavLink to="/cart">
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
