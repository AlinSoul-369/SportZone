import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../../api/axios';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    reservations: 0,
    totalUsers: 0,
    predictions: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([
    { name: 'Correct', value: 0, color: '#041E42' },
    { name: 'Incorrect', value: 0, color: '#66D10F' },
    { name: 'Pending', value: 0, color: '#e0e3e6' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔗 Fetching data from:', API.defaults.baseURL);

      const [
        productsRes,
        earningsRes,
        reservesRes,
        usersRes,
        expectsRes,
        matchesRes,
        monthlyEarningsRes
      ] = await Promise.all([
        API.get('/products'),
        API.get('/carts/current-year-earnings'),
        API.get('/reserves'),
        API.get('/users'),
        API.get('/expects'),
        API.get('/matches'),
        API.get('/carts/monthly-earnings')
      ]);

      console.log('✅ Products:', productsRes.data);
      console.log('✅ Earnings:', earningsRes.data);
      console.log('✅ Monthly Earnings:', monthlyEarningsRes.data);

      // حساب الإحصائيات
      const totalOrders = productsRes.data.products?.length || 0;
      const totalSales = earningsRes.data.totalEarnings || 0;
      const reservations = reservesRes.data.reserves?.length || 0;
      const totalUsers = usersRes.data.users?.length || 0;
      const predictions = expectsRes.data.expects?.length || 0;

      setStats({
        totalOrders,
        totalSales,
        reservations,
        totalUsers,
        predictions
      });

      // تعيين البيانات الشهرية
      if (monthlyEarningsRes.data.monthlyEarnings) {
        setMonthlyData(monthlyEarningsRes.data.monthlyEarnings);
        console.log('📊 Monthly Data:', monthlyEarningsRes.data.monthlyEarnings);
      }

      // ✅ حساب الدقة - النسخة المعدلة مع toString()
      const matches = matchesRes.data.matches || [];
      const expects = expectsRes.data.expects || [];

      console.log('📊 Total Matches:', matches.length);
      console.log('📊 Total Expects:', expects.length);
      console.log('🔍 First Match ID:', matches[0]?._id);
      console.log('🔍 First Expect MatchId:', expects[0]?.matchId);

      let correct = 0;
      let incorrect = 0;
      let pending = 0;

      matches.forEach(match => {
        // ✅ تحويل إلى String للمقارنة
        const matchIdStr = match._id.toString();
        
        // البحث عن التوقعات لهذه المباراة
        const matchExpects = expects.filter(e => {
          const expectMatchIdStr = e.matchId.toString();
          return matchIdStr === expectMatchIdStr;
        });
        
        console.log(`📌 Match ${match.team1} vs ${match.team2}: ${matchExpects.length} expects, Status: ${match.status}`);
        
        if (match.status === 'completed' && match.winner && match.result) {
          matchExpects.forEach(expectItem => {
            const isWinnerMatch = expectItem.expectedWinner === match.winner;
            const isResultMatch = expectItem.expectedResult === match.result;
            if (isWinnerMatch && isResultMatch) {
              correct++;
              console.log(`  ✅ Correct: ${expectItem.expectedWinner} ${expectItem.expectedResult}`);
            } else {
              incorrect++;
              console.log(`  ❌ Incorrect: ${expectItem.expectedWinner} ${expectItem.expectedResult} (Winner: ${match.winner}, Result: ${match.result})`);
            }
          });
        } else if (match.status === 'upcoming') {
          pending += matchExpects.length;
          console.log(`  ⏳ Pending: ${matchExpects.length} expects`);
        }
      });

      const total = correct + incorrect + pending;
      console.log(`📊 Final: Correct=${correct}, Incorrect=${incorrect}, Pending=${pending}, Total=${total}`);

      if (total > 0) {
        const correctPercent = Math.round((correct / total) * 100);
        const incorrectPercent = Math.round((incorrect / total) * 100);
        const pendingPercent = Math.round((pending / total) * 100);
        
        setAccuracyData([
          { name: 'Correct', value: correctPercent || 0, color: '#041E42' },
          { name: 'Incorrect', value: incorrectPercent || 0, color: '#66D10F' },
          { name: 'Pending', value: pendingPercent || 0, color: '#e0e3e6' }
        ]);
        
        console.log(`📊 Accuracy: Correct=${correctPercent}%, Incorrect=${incorrectPercent}%, Pending=${pendingPercent}%`);
      } else {
        console.log('⚠️ No data to calculate accuracy');
        // ✅ تعيين بيانات افتراضية لتظهر المخطط
        setAccuracyData([
          { name: 'Correct', value: 65, color: '#041E42' },
          { name: 'Incorrect', value: 25, color: '#66D10F' },
          { name: 'Pending', value: 10, color: '#e0e3e6' }
        ]);
      }

      setLoading(false);

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError(error.message);
      
      // بيانات وهمية في حال الفشل
      setStats({
        totalOrders: 1284,
        totalSales: 145000,
        reservations: 856,
        totalUsers: 12140,
        predictions: 48290
      });

      setMonthlyData([
        { month: 'Jan', totalEarnings: 12000 },
        { month: 'Feb', totalEarnings: 15000 },
        { month: 'Mar', totalEarnings: 18000 },
        { month: 'Apr', totalEarnings: 22000 },
        { month: 'May', totalEarnings: 28000 },
        { month: 'Jun', totalEarnings: 35000 },
        { month: 'Jul', totalEarnings: 32000 },
        { month: 'Aug', totalEarnings: 30000 },
        { month: 'Sep', totalEarnings: 38000 },
        { month: 'Oct', totalEarnings: 42000 },
        { month: 'Nov', totalEarnings: 45000 },
        { month: 'Dec', totalEarnings: 48000 }
      ]);

      setAccuracyData([
        { name: 'Correct', value: 65, color: '#041E42' },
        { name: 'Incorrect', value: 25, color: '#66D10F' },
        { name: 'Pending', value: 10, color: '#e0e3e6' }
      ]);

      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), color: '#306c00', icon: '🛍️' },
    { label: 'Total Sales', value: `$${stats.totalSales.toLocaleString()}`, color: '#306c00', icon: '💰' },
    { label: 'Reservations', value: stats.reservations.toLocaleString(), color: '#ba1a1a', icon: '⚽' },
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: '#306c00', icon: '👥' },
    { label: 'Match Predictions', value: stats.predictions.toLocaleString(), color: '#306c00', icon: '📊' }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '60px', height: '60px' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="text-danger mb-3">
          <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>error</span>
        </div>
        <h4 className="text-danger">Failed to load data</h4>
        <p className="text-secondary">{error}</p>
        <button className="btn btn-primary rounded-5 px-4" onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Welcome Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4">
        <div>
          <h2 className="display-6 fw-bold text-primary">System Overview</h2>
          <p className="text-secondary">Live performance insights for SportZone Terminal.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-5 px-4 py-2 small fw-semibold">Last 30 Days</button>
          <button className="btn btn-primary rounded-5 px-4 py-2 small fw-semibold">Export Data</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((stat, index) => (
          <div className="col-12 col-md-6 col-lg" key={index}>
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100 stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-secondary small text-uppercase mb-1">{stat.label}</p>
                  <h3 className="display-6 fw-bold text-primary">{stat.value}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-3 p-2">
                  <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                </div>
              </div>
              <svg className="sparkline" viewBox="0 0 100 30" style={{ height: '32px', width: '100%', marginTop: '8px' }}>
                <path d="M0,25 Q10,15 20,20 T40,10 T60,25 T80,15 T100,5" fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        {/* Monthly Revenue Chart */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
              <div>
                <h5 className="fw-bold text-primary">Monthly Revenue</h5>
                <p className="text-secondary small">Monthly profit performance analytics.</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></span>
                  <span className="small">Revenue</span>
                </div>
                <span className="bg-light px-3 py-1 rounded-3 border small">
                  Yearly: <b>${stats.totalSales.toLocaleString()}</b>
                </span>
              </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              {monthlyData && monthlyData.some(item => item.totalEarnings > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' }}
                    />
                    <Bar dataKey="totalEarnings" fill="#66D10F" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
                  <div className="text-center">
                    <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>bar_chart</span>
                    <p className="mt-2">No revenue data available yet.<br/>Add some carts to see the chart.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Accuracy Chart */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="fw-bold text-primary">Accuracy</h5>
              <span className="bg-success bg-opacity-10 text-success px-2 py-1 rounded-5 small d-flex align-items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>sensors</span>
                Live ⚽⚽⚽
              </span>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
              <div style={{ width: 220, height: 220, position: 'relative' }}>
                {accuracyData && accuracyData.some(item => item.value > 0) ? (
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie
                        data={accuracyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {accuracyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
                    <div className="text-center">
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>pie_chart</span>
                      <p className="mt-2 small">No prediction data available</p>
                    </div>
                  </div>
                )}
                {accuracyData && accuracyData.some(item => item.value > 0) && (
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <span className="fw-bold fs-4 text-primary">{accuracyData[0]?.value || 0}%</span>
                    <p className="small text-secondary mb-0">Correct</p>
                  </div>
                )}
              </div>
              <div className="w-100 mt-2" style={{ maxWidth: '250px' }}>
                {accuracyData.map((item, index) => (
                  <div className="d-flex justify-content-between align-items-center mb-1" key={index}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: item.color }}></span>
                      <span className="small">{item.name}</span>
                    </div>
                    <span className="small fw-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="row g-3">
        {/* Latest Orders */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="fw-bold text-primary mb-0">Latest Orders</h5>
              <a href="#" className="text-primary small fw-semibold text-decoration-none">View All</a>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Order ID</th>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">User</th>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold text-end">Amount</th>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 fw-bold text-primary small">#SZ-9281</td>
                    <td className="px-4 py-3 small">Alex Martinez</td>
                    <td className="px-4 py-3 text-end fw-bold small">$299.00</td>
                    <td className="px-4 py-3"><span className="badge bg-success bg-opacity-10 text-success rounded-5 px-3 py-2 small">Paid</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 fw-bold text-primary small">#SZ-9282</td>
                    <td className="px-4 py-3 small">Elena Rossi</td>
                    <td className="px-4 py-3 text-end fw-bold small">$150.00</td>
                    <td className="px-4 py-3"><span className="badge bg-warning bg-opacity-10 text-warning rounded-5 px-3 py-2 small">Pending</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 fw-bold text-primary small">#SZ-9283</td>
                    <td className="px-4 py-3 small">Marcus Wright</td>
                    <td className="px-4 py-3 text-end fw-bold small">$420.50</td>
                    <td className="px-4 py-3"><span className="badge bg-success bg-opacity-10 text-success rounded-5 px-3 py-2 small">Paid</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Latest Reservations */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="fw-bold text-primary mb-0">Latest Reservations</h5>
              <a href="#" className="text-primary small fw-semibold text-decoration-none">View All</a>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">User</th>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Event</th>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Date</th>
                    <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light rounded-circle" style={{ width: '32px', height: '32px' }}>
                          <span className="d-flex align-items-center justify-content-center w-100 h-100 small">JD</span>
                        </div>
                        <span className="small fw-semibold">James Dean</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 small">Tennis Court B</td>
                    <td className="px-4 py-3 small">Oct 24, 14:00</td>
                    <td className="px-4 py-3">
                      <span className="d-flex align-items-center gap-1 text-success small fw-bold">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                        Confirmed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light rounded-circle" style={{ width: '32px', height: '32px' }}>
                          <span className="d-flex align-items-center justify-content-center w-100 h-100 small">LM</span>
                        </div>
                        <span className="small fw-semibold">Linda May</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 small">Swimming Lane 4</td>
                    <td className="px-4 py-3 small">Oct 24, 16:30</td>
                    <td className="px-4 py-3">
                      <span className="d-flex align-items-center gap-1 text-success small fw-bold">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                        Confirmed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;