import { useState } from 'react';

const UserTable = ({ users, onAddBalance, onViewBookings }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">User</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Email</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Phone</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold text-end">Balance</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="table-row-enter">
                <td className="px-4 py-3">
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        backgroundColor: user.role === 'admin' ? '#041E42' : '#66D10F'
                      }}
                    >
                      {user.fullname.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-semibold">{user.fullname}</span>
                  </div>
                </td>
                <td className="px-4 py-3 small">{user.email}</td>
                <td className="px-4 py-3 small">{user.phone}</td>
                <td className="px-4 py-3 text-end fw-bold text-success">${user.balance.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-success btn-sm rounded-5 px-3 py-1 d-flex align-items-center gap-1"
                      onClick={() => onAddBalance(user)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                      Add Balance
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm rounded-5 px-3 py-1 d-flex align-items-center gap-1"
                      onClick={() => onViewBookings(user)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                      View Bookings
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;