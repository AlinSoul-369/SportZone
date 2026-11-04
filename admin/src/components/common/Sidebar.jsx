import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
    { path: '/products', icon: 'inventory_2', label: 'Products Management' },
    { path: '/match', icon: 'query_stats', label: 'Match Predictions' },
    { path: '/users', icon: 'group', label: 'Users Management' },
  ];

  return (
    <aside className="position-fixed h-100 bg-dark text-white" style={{ width: '280px', zIndex: 50 }}>
      <div className="p-4">
        <h1 className="text-success fw-bold fs-2">SportZone</h1>
        <p className="text-white-50 small text-uppercase">Admin Terminal</p>
      </div>
      <nav className="px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 px-4 py-3 rounded-3 text-decoration-none mb-1 transition-all ${
                isActive
                  ? 'bg-success text-dark fw-bold'
                  : 'text-white-50 hover-bg-light hover-text-white'
              }`
            }
            style={{ transition: 'all 0.3s ease' }}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="fw-semibold small">{item.label}</span>
          </NavLink>
        ))}
        <div className="border-top border-white-10 pt-3 mt-3">
          <a href="#" className="d-flex align-items-center gap-3 px-4 py-3 text-danger text-decoration-none">
            <span className="material-symbols-outlined">logout</span>
            <span className="fw-semibold small">Logout</span>
          </a>
        </div>
      </nav>
      <div className="position-absolute bottom-0 w-100 p-4">
        <div className="d-flex align-items-center gap-3 p-2 bg-white-10 rounded-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUheCFB-wwyc2ejYGIpBTTxGmtmnh2XFHF-qCJQN_WX7ly4NAYATkJGqMkzCdHJ_FN_jkUYNlZErexrvBuv2UJ9-vyNGo_oDfOyil1jaJL-xvDD-ux600XNUPUl-lMDuNXjryOSHf0e6GMRRRxRLRJahN_hE7MlcDa5-jYS9WUzAKGt33mELxwbknbEdiHgU7a_Pn7PxfQclfvBFC1tElfcvHlJsJr5o4eY8Sz5dXvwjFrt3Z_gEfOMMu0TqYhWi3CSm17V2sru812"
            alt="Admin"
            className="rounded-circle"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
          <div className="overflow-hidden">
            <p className="fw-bold small mb-0 text-white">Admin Profile</p>
            <p className="text-white-50 small mb-0">Master Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;