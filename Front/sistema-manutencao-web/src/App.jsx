import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

// Importação das Páginas
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import StockList from './pages/StockList';
import ServiceOrderList from './pages/ServiceOrderList';
import NewServiceOrder from './pages/NewServiceOrder';
import ServiceOrderDetail from './pages/ServiceOrderDetail.jsx';
import BrandList from './pages/BrandList';

// Novas importações (Fase 2 - Técnicos)
import TechnicianList from './pages/TechnicianList';
import TechnicianCategoryList from './pages/TechnicianCategoryList';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Equipamentos e Marcas */}
          <Route path="/equipamentos" element={<EquipmentList />} />
          <Route path="/marcas" element={<BrandList />} />
          
          {/* Técnicos e Categorias (Fase 2) */}
          <Route path="/tecnicos" element={<TechnicianList />} />
          <Route path="/tecnicos/categorias" element={<TechnicianCategoryList />} />

          {/* Estoque e Ordens de Serviço (Próximas fases) */}
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
