import { Modal, Button } from 'react-bootstrap';

const ReservationModal = ({ show, onClose, user, reservations }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0" style={{ background: 'linear-gradient(135deg, #041E42 0%, #0B1120 100%)' }}>
        <Modal.Title className="fw-bold text-white">
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>event_note</span>
          Bookings - {user.fullname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {reservations && reservations.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="bg-light">
                <tr>
                  <th className="small text-uppercase text-secondary fw-bold">#</th>
                  <th className="small text-uppercase text-secondary fw-bold">Facility</th>
                  <th className="small text-uppercase text-secondary fw-bold">Date & Time</th>
                  <th className="small text-uppercase text-secondary fw-bold text-end">Cost</th>
                  <th className="small text-uppercase text-secondary fw-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res, index) => (
                  <tr key={res._id || index}>
                    <td className="fw-bold text-primary small">{index + 1}</td>
                    <td>
                      <div>
                        <p className="fw-semibold mb-0 small">SportZone Stadium</p>
                        <p className="text-secondary small mb-0">Pitch {res.time || 'Main'}</p>
                      </div>
                    </td>
                    <td className="small">
                      {res.startDate ? new Date(res.startDate).toLocaleString() : 'N/A'}
                      <br/>
                      <small className="text-secondary">to {res.endDate ? new Date(res.endDate).toLocaleString() : 'N/A'}</small>
                    </td>
                    <td className="text-end fw-bold text-success">${(res.totalPrice || 0).toFixed(2)}</td>
                    <td>
                      <span className="badge bg-success rounded-5 px-3 py-2 small">
                        ✅ Confirmed
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
      </Modal.Body>
      <Modal.Footer className="border-0 p-4">
        <Button variant="light" onClick={onClose} className="rounded-5 px-4">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationModal;