import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCC9jldtxy6jfZl-m-90c_aGjYxp3mbNIDfuhsVre6GtshxXEsFbDp6T6sPHJWSR15Yb4De3hSSADrYNBeiGcxp6Mno4iZ1NNu6hr4E37rIxbPTJkYHsYMaD9UwZsz00UUdIEGkPPkmgb7i1uDHYP9OVGenDhMHlQHftCTlmXkfoi6S99cSvmM9ciPd14gvKuls_zxV3yhuP291ThQ2SOZVjGIaqKbqPCl05md8VdEo4xhRI802NS-JiOc6HLWpi9tlNU0TXYdEFYM';

export default function Navbar() {
  const { user } = useAuth();
  const displayName = user?.fullname || 'Athlete';
  const balance = Number(user?.balance ?? 0).toLocaleString();

  return (
    <nav className="site-navbar">
      <div className="site-nav-container">
        <div className="site-nav-left">
          <Link to="/" className="site-logo">
            <img src={LOGO_URL} alt="SportZone Logo" className="site-logo-img" />
            <span className="site-logo-text">
              SPORT<span className="site-logo-highlight">ZONE</span>
            </span>
          </Link>
          <div className="site-nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Shopping
            </NavLink>
            <NavLink to="/courts" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Courts
            </NavLink>
            <NavLink to="/match" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Match
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Profile
            </NavLink>
          </div>
        </div>
        <div className="site-nav-right">
          <div className="site-wallet">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="site-wallet-amount">{balance} SYP</span>
          </div>
          <Link to="/profile" className="site-user-btn">
            <span className="site-user-label">{displayName}</span>
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
