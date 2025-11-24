import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ServiceOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Aqui a URL é fixa, não depende de ID, então não vai dar "undefined"
      const response = await api.get('/ordens-servico?size=100'); 
      setOrders(response.data.content);
    } catch (error) {
      console.error("Erro ao buscar OS:", error);
      alert("Erro ao carregar ordens de serviço.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ABERTA': return '#3b82f6';
      case 'EM_ANDAMENTO': return '#eab308';
      case 'AGUARDANDO_PECAS': return '#f97316';
      case 'CONCLUIDA': return '#22c55e';
      case 'CANCELADA': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Ordens de Serviço</h1>
        </div>
        <Link to="/ordens-de-servico/nova" className="btn btn-primary">+ Abrir Nova OS</Link>
      </div>

      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Nº OS</th>
                <th>Equipamento</th>
                <th>Data Abertura</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(os => (
                  <tr key={os.id}>
                    <td style={{fontWeight: 'bold'}}>#{os.numeroOs}</td>
                    <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            {os.fotoEquipamento && (
                                <img src={os.fotoEquipamento} alt="" style={{width: 30, height: 30, borderRadius: '4px', objectFit: 'cover'}} />
                            )}
                            <span>{os.nomeEquipamento}</span>
                        </div>
                    </td>
                    <td>{new Date(os.dataEmissao).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        backgroundColor: getStatusColor(os.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {os.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/ordens-de-servico/${os.id}`} className="btn btn-secondary">
                        Gerenciar / Detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="5" style={{textAlign: 'center'}}>Nenhuma Ordem de Serviço encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServiceOrderList;
