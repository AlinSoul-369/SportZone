import { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios';
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [stats, setStats] = useState({ total: 0, inStock: 0, outOfStock: 0 });

  // ✅ جلب المنتجات مع الفلترة والبحث
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/products';
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('🔍 Fetching:', url);
      const res = await API.get(url);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // بيانات وهمية للاختبار
      const mockProducts = [
        { _id: '1', name: 'Football Shoes', description: 'Professional football shoes', price: 99.99, category: 'Shoes', countInStock: 10, images: [] },
        { _id: '2', name: 'Football Shoes Pro', description: 'Advanced professional shoes', price: 150.00, category: 'Shoes', countInStock: 20, images: [] },
        { _id: '3', name: 'Sports Jersey Elite', description: 'Official sports jersey', price: 80.00, category: 'Clothing', countInStock: 30, images: [] },
        { _id: '4', name: 'Training Ball Pro', description: 'Professional training ball', price: 45.00, category: 'Accessories', countInStock: 50, images: [] },
      ];
      
      // ✅ تطبيق الفلترة على البيانات الوهمية
      let filtered = mockProducts;
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ✅ جلب الإحصائيات
  const fetchStats = async () => {
    try {
      const res = await API.get('/products');
      const total = res.data.products?.length || 0;
      const outOfStock = res.data.products?.filter(p => p.countInStock === 0).length || 0;
      setStats({
        total,
        inStock: total - outOfStock,
        outOfStock
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // ✅ البحث الفوري (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // تأخير 500ms

    return () => clearTimeout(timer);
  }, [filters.search, filters.category, fetchProducts]);

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // ✅ إضافة منتج
  const handleAddProduct = async (productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images' && productData.images) {
          Array.from(productData.images).forEach(file => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAddModal(false);
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  // ✅ تعديل منتج
  const handleEditProduct = async (id, productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images' && productData.images) {
          Array.from(productData.images).forEach(file => {
            formData.append('images', file);
          });
        } else if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });

      await API.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  // ✅ حذف منتج
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
        fetchStats();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  // ✅ فتح نافذة التعديل
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // ✅ تحديث الفلتر (يتم التحديث تلقائياً عبر useEffect)
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: '📊', color: 'primary' },
    { label: 'In Stock', value: stats.inStock, icon: '✅', color: 'success' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: '❌', color: 'danger' },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '60px', height: '60px' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-primary">Products Inventory</h2>
          <p className="text-secondary">Review, adjust pricing, and track stock levels globally.</p>
        </div>
        <button
          className="btn btn-success rounded-5 px-4 py-2 d-flex align-items-center gap-2 fw-semibold"
          onClick={() => setShowAddModal(true)}
        >
          <span className="material-symbols-outlined">add</span>
          Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((stat, index) => (
          <div className="col-12 col-md-4" key={index}>
            <div className="card border-0 shadow-sm rounded-4 p-3 stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary small text-uppercase mb-1">{stat.label}</p>
                  <h3 className="display-6 fw-bold text-primary">{stat.value}</h3>
                </div>
                <div className={`bg-${stat.color} bg-opacity-10 rounded-4 p-3`}>
                  <span className={`material-symbols-outlined text-${stat.color}`}>{stat.icon}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <ProductFilters 
        filters={filters} 
        setFilters={handleFilterChange}
      />

      {/* Table */}
      <ProductTable
        products={products}
        onDelete={handleDeleteProduct}
        onEdit={handleEditClick}
        onRefresh={fetchProducts}
      />

      {/* Add Product Modal */}
      <AddProductModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleEditProduct}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;