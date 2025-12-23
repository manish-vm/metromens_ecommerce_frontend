import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import formatPrice from '../utils/formatPrice';
import { getAddresses } from '../services/addressService';
import { createOrder } from '../services/orderService';
import '../css/checkout.css';

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState('address'); // 'address' or 'payment'
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const itemsPrice = items.reduce((sum, i) => {
    const price = Number(i?.product?.price) || 0;
    const qty = Number(i?.qty) || 0;
    return sum + price * qty;
  }, 0);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getAddresses();
        setAddresses(list || []);
        // preselect default
        const def = (list || []).find((a) => a.isDefault) || (list || [])[0];
        if (def) setSelectedAddressId(def._id);
      } catch (err) {
        console.error('Failed to load addresses', err);
      } finally {
        setLoadingAddresses(false);
      }
    };
    load();
  }, []);

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address first');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (placing) return;

    setPlacing(true);
    try {
      const order = await createOrder({ addressId: selectedAddressId, paymentMethod });
      // Clear the cart after successful order placement
      try {
        await clearCart();
      } catch (cartErr) {
        console.error('Failed to clear cart after order:', cartErr);
        // Continue with navigation even if cart clearing fails
      }
      // For UPI, simulate payment success
      if (paymentMethod === 'UPI') {
        // In a real app, this would redirect to UPI gateway
        alert('UPI Payment simulated successfully!');
      }
      // navigate to order success using returned orderId if available
      const oid = order.orderId || order._id;
      navigate(`/order-success/${encodeURIComponent(oid)}`);
    } catch (err) {
      console.error('Place order failed', err);
      const msg = err.response?.data?.message || 'Failed to place order';
      alert(msg);
      if (msg.includes('shipping address')) {
        navigate('/account', { state: { activeTab: 'address' } });
      }
    } finally {
      setPlacing(false);
    }
  };

  const handleUpiPayment = () => {
    // Simulate UPI payment by opening UPI apps
    const upiUrl = `upi://pay?pa=merchant@upi&pn=MerromensWear&am=${(itemsPrice + (itemsPrice > 999 ? 0 : 99) + Math.round(itemsPrice * 0.05)).toFixed(2)}&cu=INR`;
    window.open(upiUrl, '_blank');
    // After simulation, place the order
    setTimeout(() => handlePlaceOrder(), 2000);
  };

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-left">
          {step === 'address' && (
            <section className="checkout-addresses">
              <h2>Shipping Address</h2>

              {loadingAddresses ? (
                <div>Loading addresses…</div>
              ) : addresses.length === 0 ? (
                <div>
                  <p>No shipping addresses found.</p>
                  <button
                    className="btn-add-address"
                    onClick={() => navigate('/account', { state: { activeTab: 'address' } })}
                  >
                    Add Address +
                  </button>
                </div>
              ) : (
                <div className="address-list">
                  {addresses.map((a) => (
                    <label key={a._id} className={`address-card ${a.isDefault ? 'default' : ''}`}>
                      <input
                        type="radio"
                        name="shippingAddress"
                        checked={selectedAddressId === a._id}
                        onChange={() => setSelectedAddressId(a._id)}
                      />

                      <div className="address-body">
                        <div className="address-top">
                          <strong>{a.fullName}</strong>
                          {a.suggestedName && (
                            <span className="address-label">{a.suggestedName}</span>
                          )}
                          {a.isDefault && <span className="address-default">Default</span>}
                        </div>

                        <div className="address-line">{a.address}</div>
                        {a.locality && <div className="address-line">{a.locality}</div>}
                        <div className="address-meta">{a.city} - {a.pincode}</div>
                        <div className="address-meta">{a.state}</div>
                        <div className="address-meta">Phone: {a.phone}</div>
                      </div>
                    </label>
                  ))}

                  <div style={{ marginTop: 12 }}>
                    <button
                      className="addeditcheckaddress"
                      onClick={() => navigate('/account', { state: { activeTab: 'address' } })}
                    >
                      Add or Edit Addresses
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 'payment' && (
            <section className="checkout-payment">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-content">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order is delivered</p>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={true}
                  />
                  <div className="payment-content">
                    <strong>UPI Payment</strong>
                    <p>Pay using UPI apps (Paytm, PhonePe, GPay, etc.) <b>(this feature will be enabled soon)</b></p>
                  </div>
                </label>
              </div>
            </section>
          )}
        </div>

        <aside className="checkout-right">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{items.reduce((s, it) => s + Number(it.qty || 0), 0)}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(itemsPrice)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{itemsPrice < 999 ? formatPrice(49) : 'Free'}</span>
          </div>

          <div className="summary-row">
            <span>GST</span>
            <span>{formatPrice(Math.round(itemsPrice * 0.05))}</span>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Grand Total</span>
            <span>{formatPrice(itemsPrice + (itemsPrice > 999 ? 0 : 49) + Math.round(itemsPrice * 0.05))}</span>
          </div>

          {step === 'address' && (
            <button
              className="btn-continue-payment"
              onClick={handleContinueToPayment}
            >
              Continue to Payment
            </button>
          )}

          {step === 'payment' && (
            <>
              <button
                className="btn-back-to-address"
                onClick={() => setStep('address')}
                style={{ marginBottom: 10 }}
              >
                Back to Address
              </button>
              <button
                className="btn-place-order wide"
                onClick={paymentMethod === 'UPI' ? handleUpiPayment : handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : paymentMethod === 'UPI' ? 'Pay with UPI' : 'Place Order (COD)'}
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
