import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

// Páginas
import Dashboard from './pages/Dashboard';

// Equipamentos e marcas
import EquipmentList from './pages/EquipmentList';
import BrandList from './pages/BrandList';

// Técnicos
import TechnicianList from './pages/TechnicianList';
import TechnicianCategoryList from './pages/TechnicianCategoryList';

// Estoque
import StockList from './pages/StockList';
import StockGroupList from './pages/StockGroupList';

// Ordens de serviço
import ServiceOrderList from './pages/ServiceOrderList';
import NewServiceOrder from './pages/NewServiceOrder';
import ServiceOrderDetail from './pages/ServiceOrderDetail';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/equipamentos" element={<EquipmentList />} />
          <Route path="/marcas" element={<BrandList />} />
          
          <Route path="/tecnicos" element={<TechnicianList />} />
          <Route path="/tecnicos/categorias" element={<TechnicianCategoryList />} />

          <Route path="/estoque" element={<StockList />} />
          <Route path="/estoque/grupos" element={<StockGroupList />} />

          <Route path="/ordens-de-servico" element={<ServiceOrderList />} />
          <Route path="/ordens-de-servico/nova" element={<NewServiceOrder />} />
          <Route path="/ordens-de-servico/:id" element={<ServiceOrderDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
