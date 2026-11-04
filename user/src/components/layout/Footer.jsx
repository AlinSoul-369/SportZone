import { Link } from 'react-router-dom';
import './Layout.css';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBF0LQXw2otdL56xfnpgfDsluveu1DUdUAGyolSZBw-w6cXFKiJWy0Yd0vXOQfMiU2fKor6WNPlAYnLz76gtENQAr3ZmLt-5PRcG8s9WyRmT_vfiBDOICgV91InE3EwTdfU23Q98wV-nQW7TIc3zyaC5LVVSljQ6CO6widL-pHXcDn0N6L5dGRIs-ZShIiBcuGh-XgWSzDGmxEgOcvquMVXB2eZ6ecFWFn4hyFqW8u_RMizRLDYCiZwOh5w3xoDbZi0sFmhQn-I1Tc';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <Link to="/" className="site-logo">
            <img src={LOGO_URL} alt="SportZone Logo" className="site-logo-img" />
            <span className="site-logo-text">
              SPORT<span className="site-logo-highlight">ZONE</span>
            </span>
          </Link>
          <p className="site-footer-desc">
            Precision performance gear and world-class football facilities for
            those who live for the pitch.
          </p>
          <div className="site-social-icons">
            <a href="#" aria-label="Website">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a href="#" aria-label="Share">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a href="#" aria-label="Email">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="site-footer-heading">Quick Links</h4>
          <ul className="site-footer-links">
            <li><Link to="/shop">Shop Football Products</Link></li>
            <li><Link to="/courts">Book Football Pitches</Link></li>
            <li><Link to="/match">Match Predictor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="site-footer-heading">Customer Support</h4>
          <ul className="site-footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="site-footer-heading">Newsletter</h4>
          <p className="site-footer-newsletter-text">
            Join the elite squad and get notified on new drops.
          </p>
          <div className="site-newsletter-form">
            <input type="email" placeholder="Your email" className="site-newsletter-input" />
            <button type="button" className="site-newsletter-btn">JOIN</button>
          </div>
        </div>
      </div>
      <div className="site-footer-bottom">
        <p>© 2024 SPORTZONE. ALL RIGHTS RESERVED. PRECISION PERFORMANCE.</p>
        <div className="site-footer-bottom-tags">
          <span>SOCCER SPECIALISTS</span>
          <span>|</span>
          <span>ELITE PERFORMANCE</span>
        </div>
      </div>
    </footer>
  );
}
