import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import API from './api/axios';
import { getProductImage, formatPrice, getTeamAbbr } from './utils/image';
import './HomePage.css';

const HERO_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCRkECoUYo7dEr43B-6FqDLgUXKIpX06080oly3rhPUbmVh67XcArqRA7KYrrGP-d0WdMdvRKU8CMA4sLnTzWeIGHjNbhYbtXDuORQRpvcysBJBjTadESh97momSvl2pY4IUtc_sSHh95MoVg69GUPfb3-gQv3Oi-0QvFNbRp8T7CmuDpMIA820C63fM7dxR3eXjm6f9EouqedQRuHzIiRFPxLSRCyNLuv6NyuWHdh2kr5utgPLVAyj593csO7QnQW67Hx80c6GTi4';

const PITCH_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHvV7Y86vmaT2iKT2otAwYNlFCST4wtqioeEzjpZTm4_Z3v6-mDKbyGP-eK9ZPM6B3t2k7FmcdDb9kAEIK6Y0Z-BDLCR4V-2BX3u75k04_ABA2A4PWLPiuLtuKwM3MXZUyVLCKnZ0Xh4sKY9kF8Gki45HPrmFWmiwTIH4ATWT7-HiAMoLzN06pgpVDVVgb19iflOwqXmmq3Y5L6uMdfen1HR6e-nWNispi3amhxmbgAu-3Etxy1USQfOwwzxn_ctfiwvVEoI-wJF0';

const PREDICTOR_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlgM9dakw1FGS1ZCqWsuhyYNAH3eQNqeCumK1zfe8CXufeTtzmrrhJQhzdXCPgxNoCrnoEgyzwqhDrwAZxhqCSd9Uavyb0QFxsD2kzOmUXFn6ZW9_Q37V_6_fIfRnszEAA7Mm1PFvGPzXRo8rUr8W0egB4o5TKF8QOkIwcz7Sbxt3jD4uJX5yuFb1sIr8ZQxYkYwb0wwQuc4DvN_yOdlw1_GyxNfqfPsduoFFfipBoNFD_luKNbWany0pyeIgB8rinK8jNSpHC5uw';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHomeData() {
      setLoading(true);
      setError('');

      try {
        const [productsRes, matchesRes, slotsRes] = await Promise.all([
          API.get('/products'),
          API.get('/matches', { params: { status: 'upcoming' } }),
          API.get('/reserves/available-slots'),
        ]);

        setProducts((productsRes.data.products || []).slice(0, 4));
        setUpcomingMatch((matchesRes.data.matches || [])[0] || null);

        const days = slotsRes.data.days || [];
        const todaySlots = days[0]?.slots?.length ?? 0;
        setAvailableSlots(todaySlots);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load home page data.');
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  const matchDate = upcomingMatch
    ? new Date(upcomingMatch.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Layout className="homepage-layout">
      <div className="homepage">
        <section className="hero">
          <div className="hero-bg">
            <div
              className="hero-bg-image"
              style={{ backgroundImage: `url("${HERO_BG}")` }}
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content">
            <span className="hero-badge">Football Exclusive</span>
            <h1 className="hero-title">
              THE ULTIMATE ZONE <br />
              FOR <span className="hero-title-highlight">FOOTBALL LOVERS</span>
            </h1>
            <div className="hero-actions">
              <Link to="/courts" className="btn-primary">
                Book a Pitch
              </Link>
              <Link to="/shop" className="btn-secondary">
                Shop Football Gear
              </Link>
            </div>
          </div>
        </section>

        <section className="quick-access">
          <div className="quick-grid">
            <Link to="/shop" className="quick-card">
              <div className="quick-icon">
                <span className="material-symbols-outlined">pedal_bike</span>
              </div>
              <h3 className="quick-title">Football Gear Shop</h3>
              <p className="quick-desc">
                Pro-grade cleats, jerseys, and accessories for the elite athlete.
              </p>
              <div className="quick-link">
                Explore Shop
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
            <Link to="/courts" className="quick-card">
              <div className="quick-icon">
                <span className="material-symbols-outlined">sports_soccer</span>
              </div>
              <h3 className="quick-title">Pitch Booking</h3>
              <p className="quick-desc">
                Rent premium grass and synthetic pitches for your next match.
              </p>
              <div className="quick-link">
                Reserve Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
            <Link to="/match" className="quick-card">
              <div className="quick-icon">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <h3 className="quick-title">Match Predictor</h3>
              <p className="quick-desc">
                Predict live scores and win exclusive store vouchers and gear.
              </p>
              <div className="quick-link">
                Join Contest
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="featured-pitches">
          <div className="section-header">
            <div>
              <h2 className="section-title">Premium Pitches</h2>
              <div className="section-underline" />
            </div>
            <Link to="/courts" className="view-all">
              View All Facilities
              <span className="material-symbols-outlined">open_in_new</span>
            </Link>
          </div>

          <div className="pitch-card">
            <div className="pitch-image">
              <div
                className="pitch-image-bg"
                style={{ backgroundImage: `url("${PITCH_BG}")` }}
              />
              <span className="pitch-badge">GRASS PITCH</span>
            </div>
            <div className="pitch-info">
              <h4 className="pitch-name">Elite 7-A-Side Arena</h4>
              <p className="pitch-desc">
                Mid-sized pitch perfect for tactical team sessions. Designed for
                elite performance and high-speed play.
              </p>
              {loading ? (
                <p className="pitch-slots">Loading availability...</p>
              ) : (
                <p className="pitch-slots">
                  {availableSlots > 0
                    ? `${availableSlots} slots available today`
                    : 'No slots left today — check upcoming days'}
                </p>
              )}
              <Link to="/courts" className="btn-primary w-full">
                View Available Hours
              </Link>
            </div>
          </div>
        </section>

        <section className="trending-gear">
          <div className="section-header container">
            <div>
              <h2 className="section-title">Trending Gear</h2>
              <div className="section-underline" />
            </div>
            <Link to="/shop" className="view-all">
              View All Products
              <span className="material-symbols-outlined">open_in_new</span>
            </Link>
          </div>

          {loading ? (
            <p className="page-loading">Loading products...</p>
          ) : error ? (
            <p className="page-empty">{error}</p>
          ) : products.length === 0 ? (
            <p className="page-empty">No products available yet.</p>
          ) : (
            <div className="gear-scroll">
              {products.map((product) => (
                <div key={product._id} className="gear-card">
                  <div className="gear-image">
                    <img src={getProductImage(product)} alt={product.name} />
                  </div>
                  <p className="gear-category">{product.category}</p>
                  <h5 className="gear-name">{product.name}</h5>
                  <p className="gear-price">{formatPrice(product.price)}</p>
                  <Link to="/shop" className="btn-outline">
                    View in Shop
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="predictor-banner">
          <div className="predictor-bg">
            <div
              className="predictor-bg-image"
              style={{ backgroundImage: `url("${PREDICTOR_BG}")` }}
            />
            <div className="predictor-overlay" />
          </div>
          <div className="predictor-content">
            <div className="predictor-text">
              <h2 className="predictor-title">
                Predict {upcomingMatch ? 'The Next' : ''} <br />
                <span className="predictor-highlight">Big Football Match</span>
              </h2>
              <p className="predictor-desc">
                {upcomingMatch
                  ? `${upcomingMatch.team1} vs ${upcomingMatch.team2} — ${matchDate}. Correct scores win purchase vouchers and exclusive gear!`
                  : 'Think you know the outcome? Correct scores win purchase vouchers, exclusive gear, and limited edition club kits!'}
              </p>
              <Link to="/match" className="btn-primary">
                Predict &amp; Win Now
              </Link>
            </div>
            {upcomingMatch && (
              <div className="predictor-vs">
                <div className="vs-team">
                  <div className="vs-badge dark">{getTeamAbbr(upcomingMatch.team1)}</div>
                  <p>{upcomingMatch.team1.toUpperCase()}</p>
                </div>
                <div className="vs-divider">VS</div>
                <div className="vs-team">
                  <div className="vs-badge green">{getTeamAbbr(upcomingMatch.team2)}</div>
                  <p>{upcomingMatch.team2.toUpperCase()}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default HomePage;
