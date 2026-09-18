import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { CartProvider } from './context/CartContext';
import { CartPage } from './pages/CartPage';
import { CatalogPage } from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>
          <footer className="site-footer">
            <div className="container">
              <p>Forge Market · product data via DummyJSON</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
