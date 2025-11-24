import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sistema ERP de Manutenção</h1>
        <p>Selecione uma das funcionalidades abaixo</p>
      </div>
      <div className="dashboard-cards">
        
        {/* 1. EQUIPAMENTOS */}
        <Link to="/equipamentos" className="card">
          <div className="card-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <h3>Cadastro de Equipamentos</h3>
          <p>Gerenciar equipamentos e máquinas</p>
          <button className="btn btn-primary">Acessar</button>
        </Link>
        
        {/* 2. ESTOQUE */}
        <Link to="/estoque" className="card">
          <div className="card-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h3>Itens em Estoque</h3>
          <p>Controlar peças e materiais</p>
          <button className="btn btn-primary">Acessar</button>
        </Link>
        
        {/* 3. ORDENS DE SERVIÇO */}
        <Link to="/ordens-de-servico" className="card">
          <div className="card-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3>Consulta de Ordem de Serviço</h3>
          <p>Consultar e gerenciar O.S.</p>
          <button className="btn btn-primary">Acessar</button>
        </Link>
        
        {/* 4. MARCAS */}
        <Link to="/marcas" className="card">
          <div className="card-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </div>
          <h3>Cadastro de Marcas</h3>
          <p>Gerenciar marcas</p>
          <button className="btn btn-primary">Acessar</button>
        </Link>

        {/* 5. TÉCNICOS (MOVIDO PARA O FINAL) */}
        <Link to="/tecnicos" className="card">
          <div className="card-icon teal">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3>Gestão de Técnicos</h3>
          <p>Gerenciar técnicos e especialidades</p>
          <button className="btn btn-primary">Acessar</button>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;
