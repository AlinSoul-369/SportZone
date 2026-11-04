import Sidebar from '../common/Sidebar';
import TopNavbar from '../common/TopNavbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '280px' }}>
        <TopNavbar />
        <main className="p-4" style={{ marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;