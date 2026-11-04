import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Match from './pages/Match/Match';
import Users from './pages/Users/Users';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/match" element={<Match />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;