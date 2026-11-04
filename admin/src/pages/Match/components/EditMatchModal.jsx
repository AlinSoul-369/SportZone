import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const flags = {
  'Brazil': 'br',
  'Argentina': 'ar',
  'France': 'fr',
  'Germany': 'de',
  'Portugal': 'pt',
  'Morocco': 'ma',
  'England': 'gb-eng',
  'Spain': 'es',
  'Italy': 'it',
  'Netherlands': 'nl',
  'Belgium': 'be'
};

const getFlagUrl = (country) => `https://flagcdn.com/w40/${flags[country] || ''}.png`;

const EditMatchModal = ({ show, onClose, onSave, match }) => {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    team1Score: '',
    team2Score: '',
    winner: '',
    status: 'upcoming'
  });
  const [loading, setLoading] = useState(false);

  // ✅ تعبئة البيانات عند فتح النافذة
  useEffect(() => {
    if (match) {
      const scores = match.result ? match.result.split('-') : ['', ''];
      setFormData({
        team1: match.team1 || '',
        team2: match.team2 || '',
        team1Score: scores[0] || '',
        team2Score: scores[1] || '',
        winner: match.winner || '',
        status: match.status || 'upcoming'
      });
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // ✅ بناء البيانات للإرسال
    const result = `${formData.team1Score}-${formData.team2Score}`;
    const winner = formData.winner || 
      (parseInt(formData.team1Score) > parseInt(formData.team2Score) ? formData.team1 : 
       parseInt(formData.team2Score) > parseInt(formData.team1Score) ? formData.team2 : 
       'Draw');
    
    const updateData = {
      result,
      winner,
      status: formData.status
    };
    
    await onSave(match._id, updateData);
    setLoading(false);
  };

  const handleClose = () => {
    setFormData({
      team1: '',
      team2: '',
      team1Score: '',
      team2Score: '',
      winner: '',
      status: 'upcoming'
    });
    onClose();
  };

  if (!match) return null;

  const teamOptions = [
    'Brazil', 'Argentina', 'France', 'Germany', 'Portugal', 
    'Morocco', 'England', 'Spain', 'Italy', 'Netherlands', 'Belgium'
  ];

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="border-0" style={{ background: 'linear-gradient(135deg, #041E42 0%, #0B1120 100%)' }}>
        <Modal.Title className="fw-bold text-white">
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>edit</span>
          Edit Match
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <div className="row g-4">
            {/* عرض الفرق */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-center">
                  <img 
                    src={getFlagUrl(formData.team1)} 
                    alt={formData.team1} 
                    style={{ width: '48px', height: '36px', objectFit: 'cover' }}
                    className="rounded-2 shadow-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <p className="fw-bold mt-1 small">{formData.team1}</p>
                </div>
                <span className="fw-bold text-secondary">VS</span>
                <div className="text-center">
                  <img 
                    src={getFlagUrl(formData.team2)} 
                    alt={formData.team2} 
                    style={{ width: '48px', height: '36px', objectFit: 'cover' }}
                    className="rounded-2 shadow-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <p className="fw-bold mt-1 small">{formData.team2}</p>
                </div>
              </div>
            </div>

            {/* ⚽ تسجيل الأهداف */}
            <div className="col-12">
              <div className="bg-light rounded-4 p-3">
                <h6 className="fw-bold text-primary mb-3">⚽ Enter Score</h6>
                <div className="row g-3 align-items-center">
                  <div className="col-5">
                    <Form.Control
                      type="number"
                      className="text-center rounded-5 py-3 border-2"
                      placeholder="0"
                      name="team1Score"
                      value={formData.team1Score}
                      onChange={handleChange}
                      min="0"
                    />
                    <small className="text-secondary d-block text-center mt-1">{formData.team1}</small>
                  </div>
                  <div className="col-2 text-center">
                    <span className="fw-bold text-primary fs-3">-</span>
                  </div>
                  <div className="col-5">
                    <Form.Control
                      type="number"
                      className="text-center rounded-5 py-3 border-2"
                      placeholder="0"
                      name="team2Score"
                      value={formData.team2Score}
                      onChange={handleChange}
                      min="0"
                    />
                    <small className="text-secondary d-block text-center mt-1">{formData.team2}</small>
                  </div>
                </div>
              </div>
            </div>

            {/* 🏆 الفائز */}
            <div className="col-12">
              <Form.Label className="fw-semibold small text-primary">🏆 Winner</Form.Label>
              <Form.Select
                name="winner"
                value={formData.winner}
                onChange={handleChange}
                className="rounded-5 border-2"
              >
                <option value="">Select Winner</option>
                <option value={formData.team1}>{formData.team1}</option>
                <option value={formData.team2}>{formData.team2}</option>
                <option value="Draw">Draw</option>
              </Form.Select>
            </div>

            {/* 📌 الحالة */}
            <div className="col-12">
              <Form.Label className="fw-semibold small text-primary">📌 Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-5 border-2"
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
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
                Save Changes
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditMatchModal;