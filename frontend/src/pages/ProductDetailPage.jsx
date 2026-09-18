import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { Spinner } from '../components/Spinner';
import { useCart } from '../context/CartContext';

export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getProduct(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setActiveImage(0);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Product not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page container">
        <Spinner label="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Product unavailable</h2>
          <p>{error ?? 'We could not find this product.'}</p>
          <Link to="/" className="btn btn-primary">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const discounted =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="page container product-detail">
      <Link to="/" className="back-link">
        ← Back to catalog
      </Link>

      <div className="product-detail-layout">
        <div className="gallery">
          <img
            src={images[activeImage]}
            alt={product.title}
            className="gallery-main"
          />
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  className={index === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.title}</h1>
          {product.brand && <p className="brand-line">Brand: {product.brand}</p>}
          <p className="description">{product.description}</p>

          <div className="product-meta large">
            <span className="price">${discounted.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="price-old">${product.price.toFixed(2)}</span>
            )}
            <span className="rating">{product.rating.toFixed(1)}★</span>
          </div>

          <p className="stock">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="qty-row">
            <label htmlFor="qty">Quantity</label>
            <input
              id="qty"
              type="number"
              min={1}
              max={Math.max(product.stock, 1)}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={product.stock < 1}
            onClick={() => {
              addToCart(product, quantity);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1800);
            }}
          >
            {added ? 'Added to cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
