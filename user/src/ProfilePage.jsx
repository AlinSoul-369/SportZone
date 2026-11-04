import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { useAuth } from "./context/AuthContext";
import { formatPrice } from "./utils/image";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const walletBalance = formatPrice(user?.balance ?? 0);

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const reservations = [
    {
      id: 1,
      pitch: "Al-Bayan Pitch",
      date: "Sunday, June 24",
      time: "05:00 PM - 06:30 PM",
      status: "Confirmed",
      statusClass: "confirmed",
    },
    {
      id: 2,
      pitch: "Court X Center",
      date: "Monday, June 18",
      time: "08:00 PM - 09:00 PM",
      status: "Completed",
      statusClass: "completed",
    },
  ];

  const orders = [
    {
      id: 1,
      name: "Vapor Velocity Pro",
      sku: "SZ-8829-BK",
      qty: 1,
      date: "May 12, 2024",
      total: "85,000 SYP",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1MIL2aAkzwXchZptj7yJohVLSB9hJOXcIZ5QqnPHbEvP4PvkVqDve1-40ApfYM1UieYHLW86PQZaztGW6WbbEPSMpNGbBtDDIHff_KpzxaUgYd7yPq-aLV88_ZTla3TE2_nJ3cDMZulzj9AbIso6uRARQUwiUsnpdxMq3rMseccDBVdkiqEnWhL3Q2x48bRa6-bthMvhNp1eDwijpEyhmHV9Tm8WO_ISe81jYh7H6TWX-swGqKeF3CXxEHSUrKN-dsAVqjTUkrpQ",
    },
    {
      id: 2,
      name: "Aero-Drift Performance Tee",
      sku: "SZ-1104-NV",
      qty: 2,
      date: "Apr 28, 2024",
      total: "44,500 SYP",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn_LwCNS0uhKN7duMSLktM3vBu8Miphx22Aa7n1kQat8kaTnL_w7tZeWBooeq3C2LwXUnMt40QINXxUc83hZi1eKMXWLnrkVCynvX9QTVTgTCgdKe1hQmMIZVSz09lsQKVdFrSTMlhhQy6shtCsAdxSyig-1IcwlNjgVIC7X-cRALXhKX8l9rfMeMIuViz84fJ062ESdZcbGZOmBnFzoc4MugG9-iRx6OLxEaCs7XBeTtv1D-Yjyw3kuKXvmn5hyHboPRJqJDrd9A",
    },
  ];

  return (
    <Layout>
      <div className="profile-page">
        <main className="profile-main">
          <div className="profile-grid">
            <div className="profile-card-wrapper">
              <div className="profile-card">
                <div className="profile-avatar">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h1 className="profile-name">{user?.fullname}</h1>
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="material-symbols-outlined">mail</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="material-symbols-outlined">call</span>
                    <span>{user?.phone}</span>
                  </div>
                </div>
                <div className="wallet-container">
                  <span className="wallet-label">Wallet Balance</span>
                  <span className="wallet-amount">{walletBalance}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span>
                  LOG OUT
                </button>
              </div>
            </div>

            <div className="history-wrapper">
              <section className="reservations-section">
                <h2 className="section-title">My Reservations</h2>
                <div className="reservations-list">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className={`reservation-item ${res.statusClass === "completed" ? "completed" : ""}`}
                    >
                      <div className="reservation-info">
                        <h3 className="reservation-pitch">{res.pitch}</h3>
                        <div className="reservation-meta">
                          <span>{res.date}</span>
                          <span>{res.time}</span>
                        </div>
                      </div>
                      <div className="reservation-status">
                        <span className={`status-badge ${res.statusClass}`}>
                          {res.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="orders-section">
                <h2 className="section-title">Order History</h2>
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-image">
                        <img src={order.img} alt={order.name} />
                      </div>
                      <div className="order-info">
                        <h3 className="order-name">{order.name}</h3>
                        <p className="order-sku">SKU: {order.sku}</p>
                        <div className="order-details">
                          <span>Qty: {order.qty}</span>
                          <span>{order.date}</span>
                          <span>{order.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProfilePage;
