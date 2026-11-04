import { useState, useEffect } from 'react';
import API from '../../api/axios';
import UserTable from './components/UserTable';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userIdInput, setUserIdInput] = useState('');
  const [ordersResult, setOrdersResult] = useState([]);
  const [reservationsResult, setReservationsResult] = useState([]);
  const [amount, setAmount] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users');
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([
        { _id: '1', fullname: 'Ahmed Player', email: 'ahmed@example.com', phone: '987654321', balance: 500, role: 'user' },
        { _id: '2', fullname: 'Test User', email: 'test@example.com', phone: '123456789', balance: 0, role: 'user' },
        { _id: '3', fullname: 'Sara Player', email: 'sara@example.com', phone: '050222222', balance: 3000, role: 'user' },
        { _id: '4', fullname: 'Admin System', email: 'admin@sportzone.com', phone: '050333333', balance: 10000, role: 'admin' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ إضافة رصيد
  const handleAddBalance = async (email, amount) => {
    try {
      setLoadingAction(true);
      await API.post('/users/add-balance', { email, amount: parseFloat(amount) });
      await fetchUsers();
      setShowBalanceModal(false);
      setAmount('');
      setSelectedUser(null);
      // alert('✅ Balance added successfully!');
    } catch (error) {
      console.error('Error adding balance:', error);
      alert('❌ Failed to add balance');
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ جلب الطلبات (Orders)
  const handleFetchOrders = async () => {
    if (!userIdInput) {
      alert('Please enter a User ID');
      return;
    }
    try {
      setLoadingAction(true);
      const res = await API.get(`/carts?userId=${userIdInput}`);
      setOrdersResult(res.data.carts || []);
      setShowOrdersModal(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // بيانات وهمية للاختبار
      setOrdersResult([
        { _id: '1', totalPrice: 299.00, items: [{ productId: { name: 'Football Shoes' }, quantity: 2 }], createdAt: '2024-10-12T10:00:00' },
        { _id: '2', totalPrice: 150.00, items: [{ productId: { name: 'Sports Jersey' }, quantity: 1 }], createdAt: '2024-10-10T14:30:00' },
      ]);
      setShowOrdersModal(true);
    } finally {
      setLoadingAction(false);
    }
  };

 // ✅ جلب الحجوزات (Reservations)
const handleFetchReservations = async () => {
  if (!userIdInput) {
    alert('Please enter a User ID');
    return;
  }
  try {
    setLoadingAction(true);
    console.log('🔍 Fetching reservations for user:', userIdInput);
    
    // ✅ استخدم الرابط الصحيح
    const res = await API.get(`/reserves/user/${userIdInput}`);
    console.log('📊 Reservations Response:', res.data);
    
    setReservationsResult(res.data.reserves || []);
    setShowReservationsModal(true);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    alert('Failed to fetch reservations');
  } finally {
    setLoadingAction(false);
  }
};

  // ✅ فتح نافذة Add Balance
  const handleOpenBalanceModal = (user) => {
    setSelectedUser(user);
    setAmount('');
    setShowBalanceModal(true);
  };

  // ✅ فتح نافذة View Bookings
  const handleOpenBookingModal = (user) => {
    setSelectedUser(user);
    setUserIdInput(user._id);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedUser(null);
    setUserIdInput('');
  };

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
    <div className="users-page">
      {/* Header */}
      <div className="mb-4">
        <h2 className="display-6 fw-bold text-primary">User Management</h2>
        <p className="text-secondary">Manage user-related operations including orders, field reservations, and account balances.</p>
      </div>

      {/* Action Cards */}
      <div className="row g-3 mb-4">
        {/* Fetch Orders */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 action-card">
            <div className="bg-primary bg-opacity-10 rounded-4 p-3 mb-3" style={{ width: '65px' }}>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>📊</span>
            </div>
            <h5 className="fw-bold text-primary">Fetch Orders</h5>
            <p className="text-secondary small">Retrieve all orders placed by a specific user.</p>
            <div className="mt-auto">
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control rounded-5 rounded-end-0 border-2"
                  placeholder="Enter User ID"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                />
                <button 
                  className="btn btn-primary rounded-5 rounded-start-0 px-3"
                  onClick={handleFetchOrders}
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fetch Reservations */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 action-card">
            <div className="bg-success bg-opacity-10 rounded-4 p-3 mb-3" style={{ width: '65px' }}>
              <span className="material-symbols-outlined text-success" style={{ fontSize: '28px' }}>📈</span>
            </div>
            <h5 className="fw-bold text-primary">Fetch Reservations</h5>
            <p className="text-secondary small">Retrieve all field reservations for a specific player.</p>
            <div className="mt-auto">
              <button 
                className="btn btn-success rounded-5 w-100"
                onClick={handleFetchReservations}
                disabled={loadingAction}
              >
                {loadingAction ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  'View Bookings'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Add Balance */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 action-card">
            <div className="bg-warning bg-opacity-10 rounded-4 p-3 mb-3" style={{ width: '56px' }}>
              <span className="material-symbols-outlined text-warning" style={{ fontSize: '28px' }}>account_balance_wallet</span>
            </div>
            <h5 className="fw-bold text-primary">Add Balance</h5>
            <p className="text-secondary small">Add wallet balance to a user's account.</p>
            <div className="mt-auto">
              <button 
                className="btn btn-warning rounded-5 w-100"
                onClick={() => {
                  if (users.length > 0) {
                    setSelectedUser(users[0]);
                    setAmount('');
                    setShowBalanceModal(true);
                  } else {
                    alert('No users available');
                  }
                }}
              >
                Manage Balance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        onAddBalance={handleOpenBalanceModal}
        onViewBookings={handleOpenBookingModal}
      />

      {/* ===== MODALS ===== */}

      {/* ✅ Add Balance Modal */}
      {showBalanceModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowBalanceModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-modern-header">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning bg-opacity-10 rounded-4 p-2">
                  <span className="material-symbols-outlined text-warning" style={{ fontSize: '32px' }}>account_balance_wallet</span>
                </div>
                <div>
                  <h4 className="fw-bold text-primary mb-0">Add Balance</h4>
                  <p className="text-secondary small mb-0">Adding balance to: <strong>{selectedUser.fullname}</strong></p>
                </div>
              </div>
              <button className="btn-close-custom" onClick={() => setShowBalanceModal(false)}>✕</button>
            </div>
            <div className="modal-modern-body">
              <div className="text-center mb-4">
                <div className="bg-light rounded-4 p-3 d-inline-block px-5">
                  <span className="text-secondary small">Current Balance</span>
                  <p className="display-6 fw-bold text-primary mb-0">${selectedUser.balance.toFixed(2)}</p>
                </div>
              </div>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-0 rounded-5 rounded-end-0 px-4 fw-bold">$</span>
                <input
                  type="number"
                  className="form-control rounded-5 rounded-start-0 border-2 py-3"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="modal-modern-footer">
              <button className="btn btn-light rounded-5 px-4" onClick={() => setShowBalanceModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-success rounded-5 px-4 d-flex align-items-center gap-2"
                onClick={() => handleAddBalance(selectedUser.email, amount)}
                disabled={!amount || loadingAction}
              >
                {loadingAction ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                    Add Balance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ View Bookings Modal */}
      {showBookingModal && selectedUser && (
        <div className="modal-overlay" onClick={handleCloseBookingModal}>
          <div className="modal-modern modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-modern-header">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success bg-opacity-10 rounded-4 p-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: '32px' }}>event_note</span>
                </div>
                <div>
                  <h4 className="fw-bold text-primary mb-0">Bookings</h4>
                  <p className="text-secondary small mb-0">Reservations for: <strong>{selectedUser.fullname}</strong></p>
                </div>
              </div>
              <button className="btn-close-custom" onClick={handleCloseBookingModal}>✕</button>
            </div>
            <div className="modal-modern-body">
              {reservationsResult.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th className="small text-uppercase text-secondary fw-bold">ID</th>
                        <th className="small text-uppercase text-secondary fw-bold">Facility</th>
                        <th className="small text-uppercase text-secondary fw-bold">Date & Time</th>
                        <th className="small text-uppercase text-secondary fw-bold text-end">Cost</th>
                        <th className="small text-uppercase text-secondary fw-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationsResult.map((res) => (
                        <tr key={res._id}>
                          <td className="fw-bold text-primary small">#{res._id.slice(-6)}</td>
                          <td>
                            <div>
                              <p className="fw-semibold mb-0 small">{res.facility || 'SportZone Stadium'}</p>
                              <p className="text-secondary small mb-0">{res.pitch || 'Main Pitch'}</p>
                            </div>
                          </td>
                          <td className="small">{res.date ? new Date(res.date).toLocaleString() : 'N/A'}</td>
                          <td className="text-end fw-bold text-success">${(res.totalPrice || 0).toFixed(2)}</td>
                          <td>
                            <span className={`badge rounded-5 px-3 py-2 small ${res.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}`}>
                              {res.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '64px' }}>event_available</span>
                  <p className="text-secondary mt-3">No bookings found for this user</p>
                </div>
              )}
            </div>
            <div className="modal-modern-footer">
              <button className="btn btn-primary rounded-5 px-4" onClick={handleCloseBookingModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Fetch Orders Modal */}
      {showOrdersModal && (
        <div className="modal-overlay" onClick={() => setShowOrdersModal(false)}>
          <div className="modal-modern modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-modern-header">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 rounded-4 p-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>shopping_bag</span>
                </div>
                <div>
                  <h4 className="fw-bold text-primary mb-0">Orders</h4>
                  <p className="text-secondary small mb-0">Orders for User ID: <strong>{userIdInput}</strong></p>
                </div>
              </div>
              <button className="btn-close-custom" onClick={() => setShowOrdersModal(false)}>✕</button>
            </div>
            <div className="modal-modern-body">
              {ordersResult.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th className="small text-uppercase text-secondary fw-bold">Order ID</th>
                        <th className="small text-uppercase text-secondary fw-bold">Items</th>
                        <th className="small text-uppercase text-secondary fw-bold text-end">Total</th>
                        <th className="small text-uppercase text-secondary fw-bold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersResult.map((order) => (
                        <tr key={order._id}>
                          <td className="fw-bold text-primary small">#{order._id.slice(-6)}</td>
                          <td className="small">
                            {order.items?.map(item => 
                              `${item.productId?.name || 'Product'} x${item.quantity}`
                            ).join(', ') || 'N/A'}
                          </td>
                          <td className="text-end fw-bold text-success">${(order.totalPrice || 0).toFixed(2)}</td>
                          <td className="small">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '64px' }}>shopping_bag</span>
                  <p className="text-secondary mt-3">No orders found for this user</p>
                </div>
              )}
            </div>
            <div className="modal-modern-footer">
              <button className="btn btn-primary rounded-5 px-4" onClick={() => setShowOrdersModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Fetch Reservations Modal */}
      {showReservationsModal && (
        <div className="modal-overlay" onClick={() => setShowReservationsModal(false)}>
          <div className="modal-modern modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-modern-header">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success bg-opacity-10 rounded-4 p-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: '32px' }}>sports_soccer</span>
                </div>
                <div>
                  <h4 className="fw-bold text-primary mb-0">Reservations</h4>
                  <p className="text-secondary small mb-0">Reservations for User ID: <strong>{userIdInput}</strong></p>
                </div>
              </div>
              <button className="btn-close-custom" onClick={() => setShowReservationsModal(false)}>✕</button>
            </div>
            <div className="modal-modern-body">
              {reservationsResult.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th className="small text-uppercase text-secondary fw-bold">ID</th>
                        <th className="small text-uppercase text-secondary fw-bold">Facility</th>
                        <th className="small text-uppercase text-secondary fw-bold">Date</th>
                        <th className="small text-uppercase text-secondary fw-bold text-end">Cost</th>
                        <th className="small text-uppercase text-secondary fw-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationsResult.map((res) => (
                        <tr key={res._id}>
                          <td className="fw-bold text-primary small">#{res._id.slice(-6)}</td>
                          <td className="small">{res.facility || 'SportZone Stadium'}</td>
                          <td className="small">{res.date ? new Date(res.date).toLocaleString() : 'N/A'}</td>
                          <td className="text-end fw-bold text-success">${(res.totalPrice || 0).toFixed(2)}</td>
                          <td>
                            <span className={`badge rounded-5 px-3 py-2 small ${res.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}`}>
                              {res.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '64px' }}>sports_soccer</span>
                  <p className="text-secondary mt-3">No reservations found for this user</p>
                </div>
              )}
            </div>
            <div className="modal-modern-footer">
              <button className="btn btn-primary rounded-5 px-4" onClick={() => setShowReservationsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;