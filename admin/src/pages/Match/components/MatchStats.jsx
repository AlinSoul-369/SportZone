const MatchStats = ({ stats }) => {
  const items = [
    { 
      label: 'Total Matches', 
      value: stats.total, 
      color: '#041E42',
      borderColor: '#041E42',
      icon: 'sports_soccer'
    },
    { 
      label: 'Completed', 
      value: stats.completed, 
      color: '#66D10F',
      borderColor: '#66D10F',
      icon: 'check_circle'
    },
    { 
      label: 'Total Predictions', 
      value: stats.predictions.toLocaleString(), 
      color: '#0dcaf0',
      borderColor: '#0dcaf0',
      icon: 'bar_chart'
    },
  ];

  return (
    <div className="row g-3">
      {items.map((item, index) => (
        <div className="col-12 col-md-4" key={index}>
          <div 
            className="card border-0 shadow-sm rounded-4 p-3 text-center stat-card"
            style={{ 
              borderLeft: `4px solid ${item.borderColor}`,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-start">
                <p className="text-secondary small text-uppercase mb-1">{item.label}</p>
                <span className="display-6 fw-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
              <div 
                className="rounded-4 p-3"
                style={{ 
                  backgroundColor: `${item.borderColor}15`,
                  color: item.borderColor
                }}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchStats;