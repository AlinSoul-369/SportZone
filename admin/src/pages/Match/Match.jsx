import { useState, useEffect } from 'react';
import API from '../../api/axios';
import MatchCard from './components/MatchCard';
import MatchStats from './components/MatchStats';
import AddMatchModal from './components/AddMatchModal';
import EditMatchModal from './components/EditMatchModal';
import './Match.css';

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, predictions: 0 });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await API.get('/matches');
      const matchesData = res.data.matches || [];
      setMatches(matchesData);

      const total = matchesData.length;
      const completed = matchesData.filter(m => m.status === 'completed').length;

      const expectsRes = await API.get('/expects');
      const predictions = expectsRes.data.expects?.length || 0;

      setStats({ total, completed, predictions });
    } catch (error) {
      console.error('Error fetching matches:', error);
      // بيانات وهمية
      setMatches([
        { _id: '1', team1: 'Brazil', team2: 'France', date: '2026-06-15T18:00:00', status: 'completed', winner: 'Brazil', result: '2-1' },
        { _id: '2', team1: 'Argentina', team2: 'Germany', date: '2026-06-16T18:00:00', status: 'completed', winner: 'Argentina', result: '3-0' },
        { _id: '3', team1: 'Portugal', team2: 'Morocco', date: '2026-06-17T18:00:00', status: 'completed', winner: 'Morocco', result: '0-1' },
        { _id: '4', team1: 'England', team2: 'Spain', date: '2026-06-25T18:00:00', status: 'upcoming', winner: null, result: null },
        { _id: '5', team1: 'Italy', team2: 'Netherlands', date: '2026-06-26T18:00:00', status: 'upcoming', winner: null, result: null },
        { _id: '6', team1: 'France', team2: 'Belgium', date: '2026-06-27T18:00:00', status: 'upcoming', winner: null, result: null },
      ]);
      setStats({ total: 6, completed: 3, predictions: 15 });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async (matchData) => {
    try {
      await API.post('/matches', matchData);
      setShowAddModal(false);
      fetchMatches();
    } catch (error) {
      console.error('Error adding match:', error);
      alert('Failed to add match');
    }
  };

  const handleEditMatch = async (id, matchData) => {
    try {
      await API.put(`/matches/${id}`, matchData);
      setShowEditModal(false);
      setSelectedMatch(null);
      fetchMatches();
    } catch (error) {
      console.error('Error editing match:', error);
      alert('Failed to update match');
    }
  };

  const handleApplyResult = async (id, winner, result) => {
    try {
      await API.put(`/matches/${id}/apply`, { winner, result });
      fetchMatches();
    } catch (error) {
      console.error('Error applying result:', error);
      alert('Failed to apply match result');
    }
  };

  const handleDeleteMatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await API.delete(`/matches/${id}`);
        fetchMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
        alert('Failed to delete match');
      }
    }
  };

  const handleEditClick = (match) => {
    setSelectedMatch(match);
    setShowEditModal(true);
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
    <div className="match-page">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-primary">Predictions Management</h2>
          <p className="text-secondary">Manage World Cup fixtures, results, and rewards.</p>
        </div>
        <button
          className="btn btn-primary rounded-5 px-4 py-2 d-flex align-items-center gap-2 fw-semibold"
          onClick={() => setShowAddModal(true)}
        >
          <span className="material-symbols-outlined">add</span>
          Add Match
        </button>
      </div>

      {/* Stats */}
      <MatchStats stats={stats} />

      {/* Matches List */}
      <div className="mt-4">
        <h5 className="fw-bold text-primary mb-3">Upcoming & Finished</h5>
        {matches.map((match) => (
          <MatchCard
            key={match._id}
            match={match}
            onApplyResult={handleApplyResult}
            onDelete={handleDeleteMatch}
            onEdit={handleEditClick}
            onRefresh={fetchMatches} 
          />
        ))}
      </div>

      {/* Add Match Modal */}
      <AddMatchModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMatch}
      />

      {/* Edit Match Modal */}
      <EditMatchModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMatch(null);
        }}
        onSave={handleEditMatch}
        match={selectedMatch}
      />
    </div>
  );
};

export default Match;