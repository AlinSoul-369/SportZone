import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import CountryFlag from './CountryFlag';

const AddMatchModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    date: '',
    status: 'upcoming'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    setFormData({ team1: '', team2: '', date: '', status: 'upcoming' });
  };

  const handleClose = () => {
    setFormData({ team1: '', team2: '', date: '', status: 'upcoming' });
    onClose();
  };

  const teamOptions = [
    'Brazil', 'Argentina', 'France', 'Germany', 'Portugal', 
    'Morocco', 'England', 'Spain', 'Italy', 'Netherlands', 'Belgium'
  ];

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="border-0" style={{ background: 'linear-gradient(135deg, #041E42 0%, #0B1120 100%)' }}>
        <Modal.Title className="fw-bold text-white">
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>sports_soccer</span>
          Add New Fixture
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <div className="row g-3">
            <div className="col-6">
              <Form.Label className="fw-semibold small text-primary">Team 1</Form.Label>
              <Form.Select
                name="team1"
                value={formData.team1}
                onChange={handleChange}
                className="rounded-4 border-2"
                required
              >
                <option value="">Select Team</option>
                {teamOptions.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </Form.Select>
              {formData.team1 && (
                <div className="mt-2">
                  <CountryFlag country={formData.team1} size="sm" className="shadow-sm" />
                  <span className="ms-2 small">{formData.team1}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <Form.Label className="fw-semibold small text-primary">Team 2</Form.Label>
              <Form.Select
                name="team2"
                value={formData.team2}
                onChange={handleChange}
                className="rounded-4 border-2"
                required
              >
                <option value="">Select Team</option>
                {teamOptions.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </Form.Select>
              {formData.team2 && (
                <div className="mt-2">
                  <CountryFlag country={formData.team2} size="sm" className="shadow-sm" />
                  <span className="ms-2 small">{formData.team2}</span>
                </div>
              )}
            </div>
            <div className="col-12">
              <Form.Label className="fw-semibold small text-primary">Match Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="rounded-4 border-2"
                required
              />
            </div>
            <div className="col-12">
              <Form.Label className="fw-semibold small text-primary">Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-4 border-2"
              >
                <option value="upcoming">⏳ Upcoming</option>
                <option value="completed">✅ Completed</option>
              </Form.Select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4">
          <Button variant="light" onClick={handleClose} className="rounded-5 px-4">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className="rounded-5 px-4 d-flex align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                Create Fixture
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddMatchModal;