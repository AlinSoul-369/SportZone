import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

export default function Layout({ children, className = '' }) {
  return (
    <div className={`site-layout ${className}`.trim()}>
      <Navbar />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
