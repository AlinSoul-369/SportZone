import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import API from '../../../api/axios';

// 🔗 روابط الأعلام
const getFlagUrl = (country) => {
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
  const code = flags[country] || '';
  return `https://flagcdn.com/w40/${code}.png`;
};

const MatchCard = ({ match, onApplyResult, onDelete, onEdit, onRefresh }) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [correctPlayers, setCorrectPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const isUpcoming = match.status === 'upcoming';
  const isCompleted = match.status === 'completed';
  const date = new Date(match.date);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const flag1 = getFlagUrl(match.team1);
  const flag2 = getFlagUrl(match.team2);

  // ✅ جلب اللاعبين الذين توقعوا النتيجة الصحيحة
  const fetchCorrectPredictors = async () => {
    try {
      setLoadingPlayers(true);
      const res = await API.get(`/matches/${match._id}/correct-predictors`);
      setCorrectPlayers(res.data.correctPredictors || []);
    } catch (error) {
      console.error('Error fetching correct predictors:', error);
      setCorrectPlayers([
        { fullname: 'Ahmed Player', email: 'ahmed@example.com', phone: '123456789' },
        { fullname: 'Sara Player', email: 'sara@example.com', phone: '987654321' },
      ]);
    } finally {
      setLoadingPlayers(false);
    }
  };

  // ✅ فتح نافذة النتائج مع جلب اللاعبين
  const handleOpenResultModal = () => {
    setShowResultModal(true);
    if (isCompleted) {
      fetchCorrectPredictors();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(match._id);
  };

  return (
    <>
      <div className={`card border-0 shadow-sm rounded-4 mb-3 overflow-hidden match-card ${isCompleted ? 'opacity-75' : ''}`}>
        {/* Status Bar */}
        <div className={`px-4 py-2 d-flex justify-content-between align-items-center ${isUpcoming ? 'bg-light' : 'bg-success bg-opacity-10'}`}>
          <span className={`fw-semibold small ${isUpcoming ? 'text-secondary' : 'text-success'}`}>
            {isUpcoming ? '⏳ UPCOMING' : '✅ FINISHED'}
          </span>
          <span className="small text-secondary">
            {isUpcoming ? `${formattedDate}, ${formattedTime}` : formattedDate}
          </span>
        </div>

        {/* Match Content */}
        <div className="p-4">
          <div className="row align-items-center text-center">
            <div className="col-5">
              <div className="d-flex flex-column align-items-center gap-2">
                <img 
                  src={flag1} 
                  alt={match.team1} 
                  className="rounded-3 shadow-sm" 
                  style={{ width: '64px', height: '48px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="fw-bold fs-1">🏳️</span>`;
                  }}
                />
                <span className={`fw-bold ${isCompleted && match.winner === match.team1 ? 'text-success' : ''}`}>
                  {match.team1}
                  {isCompleted && match.winner === match.team1 && ' 🏆'}
                </span>
              </div>
            </div>
            <div className="col-2">
              {isCompleted ? (
                <span className="display-6 fw-bold text-primary">{match.result || '0-0'}</span>
              ) : (
                <span className="text-secondary small fw-bold">VS</span>
              )}
            </div>
            <div className="col-5">
              <div className="d-flex flex-column align-items-center gap-2">
                <img 
                  src={flag2} 
                  alt={match.team2} 
                  className="rounded-3 shadow-sm" 
                  style={{ width: '64px', height: '48px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="fw-bold fs-1">🏳️</span>`;
                  }}
                />
                <span className={`fw-bold ${isCompleted && match.winner === match.team2 ? 'text-success' : ''}`}>
                  {match.team2}
                  {isCompleted && match.winner === match.team2 && ' 🏆'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-secondary">bar_chart</span>
              <span className="small text-secondary">4.5k Predictions</span>
            </div>
            <div className="d-flex gap-2">
              {/* ✅ زر Edit Match - يستدعي الـ Modal من الأعلى */}
              <button 
                className="btn btn-outline-primary rounded-5 px-4 py-1 small d-flex align-items-center gap-1"
                onClick={() => onEdit(match)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                Edit Match
              </button>
              
              {isCompleted && (
                <button 
                  className="btn btn-outline-success rounded-5 px-4 py-1 small d-flex align-items-center gap-1"
                  onClick={handleOpenResultModal}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                  View Results
                </button>
              )}
              
              <button 
                className="btn btn-outline-danger rounded-5 px-3 py-1 small d-flex align-items-center gap-1"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RESULT MODAL ===== */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0" style={{ background: 'linear-gradient(135deg, #041E42 0%, #0B1120 100%)' }}>
          <Modal.Title className="fw-bold text-white">
            <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>emoji_events</span>
            Match Results
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {/* نتيجة المباراة */}
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center align-items-center gap-4">
              <div>
                <img 
                  src={getFlagUrl(match.team1)} 
                  alt={match.team1} 
                  style={{ width: '48px', height: '36px', objectFit: 'cover' }}
                  className="rounded-2 shadow-sm"
                />
                <p className="fw-bold mt-1">{match.team1}</p>
              </div>
              <span className="display-6 fw-bold text-primary">{match.result || '?'}</span>
              <div>
                <img 
                  src={getFlagUrl(match.team2)} 
                  alt={match.team2} 
                  style={{ width: '48px', height: '36px', objectFit: 'cover' }}
                  className="rounded-2 shadow-sm"
                />
                <p className="fw-bold mt-1">{match.team2}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="badge bg-success rounded-5 px-4 py-2">
                Winner: {match.winner || 'Draw'} 🏆
              </span>
            </div>
          </div>

          {/* ✅ قائمة اللاعبين الذين توقعوا النتيجة الصحيحة */}
          <div className="bg-light rounded-4 p-3">
            <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>diversity_3</span>
              Correct Predictors ({correctPlayers.length})
            </h6>
            
            {loadingPlayers ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span className="ms-2 small text-secondary">Loading predictors...</span>
              </div>
            ) : correctPlayers.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm table-hover mb-0">
                  <thead>
                    <tr>
                      <th className="small text-uppercase text-secondary fw-bold">#</th>
                      <th className="small text-uppercase text-secondary fw-bold">Player Name</th>
                      <th className="small text-uppercase text-secondary fw-bold">Email</th>
                      <th className="small text-uppercase text-secondary fw-bold text-center">Prediction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {correctPlayers.map((player, index) => (
                      <tr key={index} className="table-row-enter">
                        <td className="fw-bold text-success">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                              {player.fullname?.charAt(0) || 'P'}
                            </div>
                            <span className="fw-semibold small">{player.fullname}</span>
                          </div>
                        </td>
                        <td className="small text-secondary">{player.email}</td>
                        <td className="text-center">
                          <span className="badge bg-success bg-opacity-10 text-success rounded-5 px-3 py-1 small">
                            ✅ {match.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '36px' }}>person_off</span>
                <p className="text-secondary small mb-0">No correct predictors found</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4">
          <Button variant="light" onClick={() => setShowResultModal(false)} className="rounded-5 px-4">
            Close
          </Button>
          <Button variant="primary" className="rounded-5 px-4 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
            Export Report
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== DELETE CONFIRM MODAL ===== */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-danger">
            <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>warning</span>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-center mb-0">
            Are you sure you want to delete the match between <br/>
            <strong>{match.team1}</strong> vs <strong>{match.team2}</strong>?
          </p>
          <p className="text-danger small text-center mt-2">This action cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4">
          <Button variant="light" onClick={() => setShowDeleteConfirm(false)} className="rounded-5 px-4">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} className="rounded-5 px-4 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete_forever</span>
            Delete Match
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MatchCard;