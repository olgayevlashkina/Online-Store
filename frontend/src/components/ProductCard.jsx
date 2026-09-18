import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discounted =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-media">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3>
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="product-meta">
          <span className="price">${discounted.toFixed(2)}</span>
          {product.discountPercentage > 0 && (
            <span className="price-old">${product.price.toFixed(2)}</span>
          )}
          <span className="rating">{product.rating.toFixed(1)}★</span>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
