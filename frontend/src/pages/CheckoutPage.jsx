import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim() || form.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name (at least 2 characters).';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!/^[+]?[0-9\s-]{7,20}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }
  if (!form.address.trim() || form.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters.';
  }
  if (!form.city.trim() || form.city.trim().length < 2) {
    errors.city = 'Enter a valid city.';
  }
  if (!/^[A-Za-z0-9\s-]{3,12}$/.test(form.postalCode.trim())) {
    errors.postalCode = 'Enter a valid postal code.';
  }

  return errors;
}

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const isEmpty = items.length === 0 && !successId;

  const payloadItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    [items],
  );

  if (isEmpty) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h1>Nothing to checkout</h1>
          <p>Your cart is empty. Add products before checking out.</p>
          <Link to="/" className="btn btn-primary">
            Browse catalog
          </Link>
        </div>
      </div>
    );
  }

  if (successId) {
    return (
      <div className="page container">
        <div className="empty-state success">
          <h1>Order confirmed</h1>
          <p>Thank you! Your order ID is:</p>
          <code className="order-id">{successId}</code>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
            Back to store
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setServerError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.checkout({
        ...form,
        items: payloadItems,
      });
      clearCart();
      setSuccessId(result.orderId);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const fields = [
    ['fullName', 'Full name', 'text'],
    ['email', 'Email', 'email'],
    ['phone', 'Phone', 'tel'],
    ['address', 'Address', 'text'],
    ['city', 'City', 'text'],
    ['postalCode', 'Postal code', 'text'],
  ];

  return (
    <div className="page container checkout-page">
      <div className="section-head">
        <h1>Checkout</h1>
        <p>Total due: ${subtotal.toFixed(2)}</p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        {fields.map(([key, label, type]) => (
          <label key={key} className={`form-field${errors[key] ? ' has-error' : ''}`}>
            <span>{label}</span>
            <input
              type={type}
              name={key}
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
              aria-invalid={Boolean(errors[key])}
            />
            {errors[key] && <em className="field-error">{errors[key]}</em>}
          </label>
        ))}

        {serverError && (
          <div className="alert alert-error" role="alert">
            {serverError}
          </div>
        )}

        <div className="form-actions">
          <Link to="/cart" className="btn btn-secondary">
            Back to cart
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
}
