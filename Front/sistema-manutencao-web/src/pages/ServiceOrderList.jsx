import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceOrdersData } from '../data/serviceOrders';

const ServiceOrderList = () => {
  const [orders, setOrders] = useState(serviceOrdersData);
  
  const getStatusTag = (status) => {
    switch (status) {
      case 'Em Andamento':
        return <span className="status-tag in-progress">{status}</span>;
      case 'Concluído':
        return <span className="status-tag completed">{status}</span>;
      case 'Aguardando Peças':
        return <span className="status-tag pending-parts">{status}</span>;
      default:
        return <span className="status-tag">{status}</span>;
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
          <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
          <h1>Consulta de Ordens de Serviço</h1>
        </div>
        <div>
          <Link to="/ordens-de-servico/nova" className="btn btn-primary">+ Nova O.S.</Link>
          <button className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>Imprimir</button>
        </div>
      </div>
      
      <div className="filter-box">
        <h4>Filtros de Pesquisa</h4>
        <div className="filter-grid">
          <div className="form-group">
            <label>Problema</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Localização Física da Máquina</label>
            <input type="text" placeholder="Ex: Setor A - Bloco C"/>
          </div>
          <div className="form-group">
            <label>Situação</label>
            <select className="form-select">
              <option>Todas</option>
              <option>Em Andamento</option>
              <option>Concluído</option>
              <option>Aguardando Peças</option>
            </select>
          </div>
          <div className="form-group">
            <label>Data O.S. (Início)</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Data O.S. (Fim)</label>
            <input type="date" />
          </div>
        </div>
        <button className="btn btn-primary" style={{marginTop: '1rem'}}>Pesquisar</button>
      </div>

      <div className="table-wrapper">
        <h4>Resultados da Pesquisa</h4>
        <table>
          <thead>
            <tr>
              <th>Data Emissão</th>
              <th>Situação</th>
              <th>Nº O.S.</th>
              <th>Modelo</th>
              <th>Localização Física da Máquina</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((os) => (
              <tr key={os.id}>
                <td>{os.emissionDate}</td>
                <td>{getStatusTag(os.status)}</td>
                <td><span className="id-tag">{os.id}</span></td>
                <td>{os.model}</td>
                <td>{os.location}</td>
                <td>
                  <Link to={`/ordens-de-servico/${os.id}`} className="btn btn-secondary btn-sm">Ver Detalhes</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceOrderList;
