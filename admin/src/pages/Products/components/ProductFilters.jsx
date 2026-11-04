import { useState } from 'react';

const ProductFilters = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    // ✅ تحديث الفلتر فوراً (البحث الفوري)
    setFilters(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = { search: '', category: '' };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
      <div className="row g-3 align-items-center">
        <div className="col-12 col-md-5">
          <div className="position-relative">
            <span className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y text-secondary ms-3" style={{ fontSize: '20px' }}>search</span>
            <input
              type="text"
              className="form-control rounded-5 ps-5"
              placeholder="Search SKU or name..."
              name="search"
              value={localFilters.search || ''}
              onChange={handleChange}
            />
            {localFilters.search && (
              <button 
                className="position-absolute top-50 end-0 translate-middle-y btn btn-link text-secondary me-2 p-0"
                onClick={() => {
                  const cleared = { ...localFilters, search: '' };
                  setLocalFilters(cleared);
                  setFilters(cleared);
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            )}
          </div>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select rounded-5"
            name="category"
            value={localFilters.category || ''}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            <option value="Shoes">👟 Shoes</option>
            <option value="Clothing">👕 Clothing</option>
            <option value="Accessories">🎒 Accessories</option>
          </select>
        </div>
        <div className="col-6 col-md-2">
          <button 
            className="btn btn-outline-secondary rounded-5 w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleClear}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>clear</span>
            Clear
          </button>
        </div>
        <div className="col-12 col-md-2">
          <button className="btn btn-outline-secondary rounded-5 w-100 d-flex align-items-center justify-content-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>file_download</span>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;