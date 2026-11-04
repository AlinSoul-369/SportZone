import { useState } from 'react';
// import LanguageToggle from './LanguageToggle';

const TopNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="position-fixed top-0 end-0 bg-white border-bottom shadow-sm d-flex align-items-center px-4" style={{ left: '280px', height: '64px', zIndex: 40 }}>
      <div className="d-flex align-items-center gap-4 w-100">
        <div className="bg-light d-flex align-items-center px-3 py-1 rounded-5 w-50">
          <span className="material-symbols-outlined text-secondary me-2" style={{ fontSize: '20px' }}>search</span>
          <input
            type="text"
            placeholder="Search orders, predictions..."
            className="border-0 bg-transparent w-100 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="d-flex align-items-center gap-4 ms-auto">
          {/* <LanguageToggle /> */}
          <button className="btn btn-light rounded-circle p-2 position-relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="position-absolute top-0 end-0 bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span>
          </button>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr0VX2SbfEp7IL7P2PXyZBore0rbbsq4Fypg60eLgDPZnxn516wNgxH4Q4vXxC2_3242frzu9kwrwB2ofWY13oivR3NXOFYCdAhwXdDoSAbkvv55PKroK03FAoQr3Ulicyp61_NKgugFlNg7CtGiAHT_ADH-qcHKPDGGlkQvrNHB5mscwE87X_LFZD9_g9nuziQ7l_T-zm7IB8QKZ3jHwYupQ-Eo2UpfnZaFyoGkTp_J-be9ir8FoxkbHdi2uelvTX8mLzALM0gm1N"
            alt="Avatar"
            className="rounded-circle"
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;