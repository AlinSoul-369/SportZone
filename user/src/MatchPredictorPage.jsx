import React, { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import CountryFlag from "./components/CountryFlag";
import "./MatchPredictorPage.css";
import API from "./api/axios";
import { useAuth } from "./context/AuthContext";

const MatchPredictorPage = () => {
  // ----- STATE للمودال -----
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState({ _id: null, team1: "", team2: "" });
  const [selectedWinner, setSelectedWinner] = useState(null); // 'team1', 'draw', 'team2'
  const [scoreTeam1, setScoreTeam1] = useState(0);
  const [scoreTeam2, setScoreTeam2] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const openFeedback = (status, message) => {
    setFeedbackStatus(status);
    setFeedbackMessage(message);
    setFeedbackOpen(true);
  };

  // ----- دوال المودال -----
  const openModal = (match) => {
    setCurrentMatch({ _id: match._id || match.id || null, team1: match.team1, team2: match.team2 });
    setSelectedWinner(null);
    setScoreTeam1(0);
    setScoreTeam2(0);
    setSubmitLoading(false);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleWinnerSelect = (selection) => {
    setSelectedWinner(selection);
  };

  const handleSubmit = async () => {
    if (!selectedWinner) {
      alert("Please select a winner!");
      return;
    }

    if (!user) {
      alert("Please log in to submit a prediction.");
      return;
    }

    if (!currentMatch._id) {
      console.error("Missing match id for prediction submission", currentMatch);
      alert("Unable to submit prediction. Please try again.");
      return;
    }

    const expectedWinner =
      selectedWinner === "team1"
        ? currentMatch.team1
        : selectedWinner === "team2"
        ? currentMatch.team2
        : "draw";
    const expectedResult = `${scoreTeam1}-${scoreTeam2}`;
    const userId = user._id || user.id || user.userId;

    if (!userId) {
      alert("Unable to identify your account. Please log in again.");
      return;
    }

    const payload = {
      userId,
      matchId: currentMatch._id,
      expectedWinner,
      expectedResult,
    };

    try {
      setSubmitLoading(true);
      await API.post('/expects', payload);
      closeModal();
      openFeedback('success', 'Prediction submitted successfully. Your forecast has been recorded.');
    } catch (error) {
      console.error('Failed to submit prediction', error?.response?.data || error?.message || error);
      openFeedback(
        'error',
        error?.response?.data?.message ||
          error?.message ||
          'Failed to submit prediction. Please try again.',
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // state for matches fetched from backend
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const res = await API.get('/matches');
        if (res?.data?.matches) {
          setMatches(res.data.matches);
        }
      } catch (err) {
        console.error('Failed to load matches', err?.message || err);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <Layout>
      <div className="match-predictor-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-predictor">
        <div className="hero-content">
          <h1 className="hero-title">MATCH PREDICTOR</h1>
          <p className="hero-subtitle">
            Predict upcoming match scores and win points! Rank against top
            enthusiasts and dominate the SportZone leaderboard.
          </p>
        </div>
      </section>

      {/* ===== 3. FILTER BAR ===== */}
      <div className="filter-bar">
        <div className="filter-buttons">
          <button className="filter-btn active">All MATSH</button>
          <button className="filter-btn">My Predictions</button>
        </div>
        <div className="search-box">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Search matches..." />
        </div>
      </div>

      {/* ===== 4. MATCHES GRID ===== */}
      <section className="matches-grid">
        {matches.map((match) => (
          <div
            key={match._id || match.id}
            className={`match-card ${match.status === "completed" ? "completed" : ""}`}
          >
            <div className="card-header">
              <span className={`status-badge ${match.status}`}>
                {match.status === "upcoming" ? "UPCOMING" : "COMPLETED"}
              </span>
              <span className="match-date">{formatDate(match.date)}</span>
            </div>
            <div className="match-teams">
              <div className="team">
                <CountryFlag country={match.team1} size="lg" />
                <span className="team-name">{match.team1}</span>
              </div>
              {match.status === "upcoming" ? (
                <div className="vs-divider">VS</div>
              ) : (
                <div className="result-box">
                  <span className="result-score">{match.result}</span>
                  <span className="result-ft">FT</span>
                </div>
              )}
              <div className="team">
                <CountryFlag country={match.team2} size="lg" />
                <span className="team-name">{match.team2}</span>
              </div>
            </div>
            {match.status === "upcoming" ? (
              <button
                className="predict-btn"
                onClick={() => openModal(match)}
              >
                PREDICT NOW
              </button>
            ) : (
              <div className="match-ended">Match Ended</div>
            )}
          </div>
        ))}
      </section>

      {/* ===== 5. PREDICTION MODAL ===== */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="modal-title">Submit Prediction</h2>
            <p className="modal-match-info">
              {currentMatch.team1} vs {currentMatch.team2}
            </p>
            <div className="modal-winner">
              <label>Select Winner</label>
              <div className="winner-options">
                <button
                  className={`winner-btn ${selectedWinner === "team1" ? "selected" : ""}`}
                  onClick={() => handleWinnerSelect("team1")}
                >
                  {currentMatch.team1}
                </button>
                <button
                  className={`winner-btn ${selectedWinner === "draw" ? "selected" : ""}`}
                  onClick={() => handleWinnerSelect("draw")}
                >
                  Draw
                </button>
                <button
                  className={`winner-btn ${selectedWinner === "team2" ? "selected" : ""}`}
                  onClick={() => handleWinnerSelect("team2")}
                >
                  {currentMatch.team2}
                </button>
              </div>
            </div>
            <div className="modal-score">
              <label>Predicted Score</label>
              <div className="score-inputs">
                <div>
                  <input
                    type="number"
                    min="0"
                    value={scoreTeam1}
                    onChange={(e) => setScoreTeam1(Number(e.target.value))}
                  />
                  <span>Team A</span>
                </div>
                <span className="score-colon">:</span>
                <div>
                  <input
                    type="number"
                    min="0"
                    value={scoreTeam2}
                    onChange={(e) => setScoreTeam2(Number(e.target.value))}
                  />
                  <span>Team B</span>
                </div>
              </div>
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? 'Submitting...' : 'SUBMIT PREDICTION'}
            </button>
          </div>
        </div>
      )}

      {feedbackOpen && (
        <div className="feedback-overlay" onClick={() => setFeedbackOpen(false)}>
          <div className={`feedback-dialog ${feedbackStatus}`} onClick={(e) => e.stopPropagation()}>
            <button className="feedback-close" onClick={() => setFeedbackOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="feedback-icon">
              {feedbackStatus === 'success' ? '✅' : '⚠️'}
            </div>
            <h3 className="feedback-title">
              {feedbackStatus === 'success' ? 'Prediction Sent' : 'Submission Failed'}
            </h3>
            <p className="feedback-message">{feedbackMessage}</p>
            <button className="feedback-action" onClick={() => setFeedbackOpen(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      </div>
    </Layout>
  );
};

export default MatchPredictorPage;
