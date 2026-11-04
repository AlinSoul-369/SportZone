import React, { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import API from "./api/axios";
import { getProductImage, formatPrice } from "./utils/image";
import "./ShopPage.css";
import { useAuth } from "./context/AuthContext";

const ShopPage = () => {
  // ----- STATE لإدارة الفلتر الجانبي -----
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ----- STATE لإدارة السلة -----
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { user, refreshUser } = useAuth();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    type: 'info',
    title: '',
    message: ''
  });

  // ----- Fetch products from backend -----
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await API.get('/products');
        const productsData = res.data.products || [];
        setProducts(productsData);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ----- دوال إدارة السلة -----
  const addToCart = (product, qty = 1) => {
    const existing = cartItems.find((item) => item._id === product._id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: qty }]);
    }
    setFeedbackDialog({
      open: true,
      type: 'success',
      title: 'Added to cart',
      message: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace(" SYP", "")) : item.price;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // ----- دوال الفلتر -----
  const handleFilterApply = () => {
    setFeedbackDialog({
      open: true,
      type: 'success',
      title: 'Filters Applied',
      message: 'Your filters have been applied successfully.',
    });
    setIsDrawerOpen(false);
  };

  const handleResetFilters = () => {
    setFeedbackDialog({
      open: true,
      type: 'success',
      title: 'Filters Reset',
      message: 'Filters have been reset.',
    });
  };



  // ----- دالة عرض التقييم بالنجوم -----
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className="material-symbols-outlined star-icon"
          style={{
            fontVariationSettings: i <= rating ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>,
      );
    }
    return stars;
  };

  // ----- Product detail modal -----
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedQty(1);
    setIsProductOpen(true);
  };

  const confirmAddFromModal = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, Number(selectedQty) || 1);
      setIsProductOpen(false);
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (isCartOpen && user?._id) {
      refreshUser().catch(() => {});
    }
  }, [isCartOpen, user?._id, refreshUser]);

  return (
    <Layout>
      <div className="shop-page">
      {/* ===== OVERLAY للفلتر والسلة ===== */}
      <div
        className={`drawer-overlay ${isDrawerOpen || isCartOpen || isProductOpen || feedbackDialog.open ? "active" : ""}`}
        onClick={() => {
          setIsDrawerOpen(false);
          setIsCartOpen(false);
          setIsProductOpen(false);
          if (feedbackDialog.open) {
            setFeedbackDialog((prev) => ({ ...prev, open: false }));
          }
        }}
      ></div>

      {feedbackDialog.open && (
        <div className="feedback-dialog-overlay" onClick={() => setFeedbackDialog((prev) => ({ ...prev, open: false }))}>
          <div className={`feedback-dialog ${feedbackDialog.type}`} onClick={(e) => e.stopPropagation()}>
            <div className="feedback-dialog-header">
              <div>
                <h3>{feedbackDialog.title}</h3>
                <p>{feedbackDialog.message}</p>
              </div>
              <button className="feedback-close" onClick={() => setFeedbackDialog((prev) => ({ ...prev, open: false }))}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="feedback-dialog-actions">
              <button className="feedback-ok" onClick={() => setFeedbackDialog((prev) => ({ ...prev, open: false }))}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 3. SLIDING FILTER DRAWER ===== */}
      <aside className={`filter-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">Filters</h2>
          <button
            className="close-drawer"
            onClick={() => setIsDrawerOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="drawer-body">
          <div className="filter-section">
            <h3 className="filter-heading">Category</h3>
            <ul className="filter-list">
              <li>
                <label className="filter-checkbox">
                  <span className="checkbox-custom">
                    <span className="checkbox-inner"></span>
                  </span>
                  Clothing &amp; Apparel
                </label>
              </li>
              <li>
                <label className="filter-checkbox checked">
                  <span className="checkbox-custom">
                    <span className="checkbox-inner active"></span>
                  </span>
                  Shoes &amp; Footwear
                </label>
              </li>
              <li>
                <label className="filter-checkbox">
                  <span className="checkbox-custom">
                    <span className="checkbox-inner"></span>
                  </span>
                  Accessories
                </label>
              </li>
            </ul>
          </div>
          <div className="filter-section">
            <h3 className="filter-heading">Price Range</h3>
            <input
              type="range"
              min="0"
              max="500"
              className="price-slider"
              defaultValue="250"
            />
            <div className="price-labels">
              <span>0 SYP</span>
              <span>500+ SYP</span>
            </div>
          </div>
          <div className="filter-section">
            <h3 className="filter-heading">Size (US)</h3>
            <div className="size-grid">
              <button className="size-btn">7</button>
              <button className="size-btn">8</button>
              <button className="size-btn active">9</button>
              <button className="size-btn">10</button>
              <button className="size-btn">11</button>
              <button className="size-btn">12</button>
            </div>
          </div>
        </div>
        <div className="drawer-footer">
          <button className="reset-filters" onClick={handleResetFilters}>
            Reset Filters
          </button>
          <button className="apply-filters" onClick={handleFilterApply}>
            Apply Filters
          </button>
        </div>
      </aside>

      {/* ===== 4. CART MODAL ===== */}
      {isCartOpen && (
        <div className={`cart-modal`} role="dialog" aria-modal="true">
          <div className="drawer-header">
            <h2 className="drawer-title">Shopping Cart</h2>
            <button className="close-drawer" onClick={() => setIsCartOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="drawer-body cart-body">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-meta">
                        <span className="cart-item-price">{typeof item.price === 'string' ? item.price : formatPrice(item.price)}</span>
                        <span className="cart-item-qty">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Total</span>
                  <span className="cart-total-price">{getTotalPrice()} SYP</span>
                </div>

                {/* Offers form */}
                <div className="offer-form">
                  <label>Choose Offer</label>
                  <select value={selectedOffer ?? ''} onChange={(e) => setSelectedOffer(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">No offer</option>
                    {(user && Array.isArray(user.offers) ? user.offers : []).map((o, idx) => (
                      <option key={`${o}-${idx}`} value={o}>{`-${o}% off`}</option>
                    ))}
                  </select>
                </div>

                {/* Discount display */}
                {selectedOffer ? (
                  <div className="cart-discount">
                    <span>Discount ({selectedOffer}%)</span>
                    <span className="cart-discount-amount">{( (parseFloat(getTotalPrice()) * selectedOffer / 100).toFixed(2) )} SYP</span>
                  </div>
                ) : null}

                <div className="cart-final">
                  <span>Final Total</span>
                  <span className="cart-final-price">{( (parseFloat(getTotalPrice()) - (selectedOffer ? (parseFloat(getTotalPrice()) * selectedOffer / 100) : 0) ).toFixed(2) )} SYP</span>
                </div>

                <button className="cart-checkout" onClick={async () => {
                  try {
                    const items = cartItems.map(i => ({ productId: i._id, quantity: i.quantity }));
                    const payload = { userId: user?._id, items, appliedOffer: selectedOffer };
                    const res = await API.post('/carts', payload);

                    setFeedbackDialog({
                      open: true,
                      type: 'success',
                      title: 'Order Complete',
                      message: res.data.message || 'Your order has been placed successfully.',
                    });

                    setCartItems([]);
                    setIsCartOpen(false);

                    const rawLocal = localStorage.getItem('sportzone_user');
                    const rawSession = sessionStorage.getItem('sportzone_user');
                    [rawLocal && 'localStorage', rawSession && 'sessionStorage'].forEach((which) => {
                      if (!which) return;
                      try {
                        const raw = which === 'localStorage' ? localStorage.getItem('sportzone_user') : sessionStorage.getItem('sportzone_user');
                        if (!raw) return;
                        const parsed = JSON.parse(raw);
                        if (res.data.remainingBalance !== undefined) parsed.balance = res.data.remainingBalance;
                        if (selectedOffer && Array.isArray(parsed.offers)) {
                          const idx = parsed.offers.indexOf(selectedOffer);
                          if (idx !== -1) parsed.offers.splice(idx, 1);
                        }
                        if (which === 'localStorage') localStorage.setItem('sportzone_user', JSON.stringify(parsed));
                        else sessionStorage.setItem('sportzone_user', JSON.stringify(parsed));
                      } catch (err) { }
                    });
                  } catch (err) {
                    setFeedbackDialog({
                      open: true,
                      type: 'error',
                      title: 'Order Failed',
                      message: err.response?.data?.message || 'Failed to place the order. Please try again.',
                    });
                  }
                }}>Proceed to Checkout</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== 5. MAIN CONTENT ===== */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Elite Gear</h2>
            <p className="page-subtitle">Showing {products.length} Football Products</p>
          </div>
          <div className="header-actions">
            <div className="sort-dropdown">
              <span className="sort-label">Sort By:</span>
              <select className="sort-select">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
            <button
              className="filter-btn"
              onClick={() => setIsDrawerOpen(true)}
            >
              <span className="material-symbols-outlined">tune</span>
              Filter Products
            </button>
          </div>
        </div>

        <section className="product-grid">
          {loading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Loading products...</p>
          ) : error ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'red' }}>{error}</p>
          ) : products.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>No products available</p>
          ) : products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={getProductImage(product)} alt={product.name} />
              </div>
              <div className="product-info">
                <div className="product-name-price">
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">{formatPrice(product.price)}</span>
                </div>
                <div className="product-rating">
                  {renderStars(product.rating || 4)}
                </div>
                <button
                  className="add-to-cart"
                  onClick={() => openProductModal(product)}
                >
                  View & Add
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* ===== Product detail modal ===== */}
        {isProductOpen && selectedProduct && (
          <div className="product-modal" role="dialog" aria-modal="true">
            <div className="product-modal-inner">
              <div className="product-modal-left">
                <img src={getProductImage(selectedProduct)} alt={selectedProduct.name} />
              </div>
              <div className="product-modal-right">
                <h3 className="product-modal-title">{selectedProduct.name}</h3>
                <p className="product-modal-price">{formatPrice(selectedProduct.price)}</p>
                <p className="product-modal-desc">{selectedProduct.description || selectedProduct.desc || 'No description available.'}</p>
                <div className="product-modal-actions">
                  <label className="qty-label">Quantity</label>
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => setSelectedQty((q) => Math.max(1, Number(q) - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="qty-value" aria-live="polite">{selectedQty}</div>
                    <button
                      className="qty-btn"
                      onClick={() => setSelectedQty((q) => Number(q) + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="product-modal-cta">
                  <button className="btn-outline" onClick={() => { setIsProductOpen(false); setSelectedProduct(null); }}>Cancel</button>
                  <button className="btn-primary" onClick={confirmAddFromModal}>Confirm & Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pagination">
          <button className="page-nav">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="page-numbers">
            <button className="page-number active">1</button>
            <button className="page-number">2</button>
            <button className="page-number">3</button>
          </div>
          <button className="page-nav">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      {/* ===== 6. FLOATING CART BUTTON (مع عداد ديناميكي) ===== */}
      <button className="floating-cart" onClick={() => setIsCartOpen(true)}>
        <span className="material-symbols-outlined">shopping_cart</span>
        {cartItems.length > 0 && (
          <span className="cart-badge">{cartItems.length}</span>
        )}
      </button>
      </div>
    </Layout>
  );
};

export default ShopPage;
