import { useEffect, useState, useDeferredValue } from 'react';
import { api } from '../api/client';
import { CatalogFilters } from '../components/CatalogFilters';
import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/Spinner';

export function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = window.setTimeout(() => {
      api
        .getProducts({
          limit: 30,
          category: deferredSearch ? undefined : category || undefined,
          search: deferredSearch || undefined,
        })
        .then((data) => {
          if (cancelled) return;
          setProducts(data.products);
          setTotal(data.total);
        })
        .catch((err) => {
          if (cancelled) return;
          setError(err.message || 'Failed to load products');
          setProducts([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, deferredSearch ? 300 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [deferredSearch, category]);

  return (
    <div className="page catalog-page">
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">Online store</p>
          <h1 className="brand-hero">Forge Market</h1>
          <p className="hero-copy">
            Browse curated goods with live search, category filters, and a cart that
            remembers your picks.
          </p>
        </div>
        <div className="hero-visual" aria-hidden="true" />
      </section>

      <section className="container catalog-section">
        <div className="section-head">
          <h2>Product catalog</h2>
          <p>{loading ? 'Updating…' : `${total} products found`}</p>
        </div>

        <CatalogFilters
          search={search}
          category={category}
          categories={categories}
          onSearchChange={(value) => {
            setSearch(value);
            if (value) setCategory('');
          }}
          onCategoryChange={(value) => {
            setCategory(value);
            setSearch('');
          }}
        />

        {loading && <Spinner label="Loading products..." />}

        {!loading && error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <h3>No products match</h3>
            <p>Try another search term or category.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
