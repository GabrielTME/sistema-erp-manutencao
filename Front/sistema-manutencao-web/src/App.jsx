import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

// --- PÁGINAS ---
import Dashboard from './pages/Dashboard';

// Fase 1: Equipamentos e Marcas
import EquipmentList from './pages/EquipmentList';
import BrandList from './pages/BrandList';

// Fase 2: Técnicos
import TechnicianList from './pages/TechnicianList';
import TechnicianCategoryList from './pages/TechnicianCategoryList';

// Fase 3: Estoque
import StockList from './pages/StockList';
import StockGroupList from './pages/StockGroupList'; // <--- Essa importação provavelmente estava faltando!

// Fase 4: Ordens de Serviço (ainda vamos mexer, mas mantemos as rotas antigas se existirem os arquivos)
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
          
          {/* FASE 1 */}
          <Route path="/equipamentos" element={<EquipmentList />} />
          <Route path="/marcas" element={<BrandList />} />
          
          {/* FASE 2 */}
          <Route path="/tecnicos" element={<TechnicianList />} />
          <Route path="/tecnicos/categorias" element={<TechnicianCategoryList />} />

          {/* FASE 3 (Estoque) */}
          <Route path="/estoque" element={<StockList />} />
          <Route path="/estoque/grupos" element={<StockGroupList />} />

          {/* FASE 4 (Ordens de Serviço - Estrutura) */}
          <Route path="/ordens-de-servico" element={<ServiceOrderList />} />
          <Route path="/ordens-de-servico/nova" element={<NewServiceOrder />} />
          <Route path="/ordens-de-servico/:id" element={<ServiceOrderDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
