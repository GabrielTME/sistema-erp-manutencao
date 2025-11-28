import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ServiceOrderList = () => {
  const [orders, setOrders] = useState([]); // Lista Original (Banco)
  const [filteredOrders, setFilteredOrders] = useState([]); // Lista Filtrada (Tela)
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [filters, setFilters] = useState({
    problema: '',
    equipamento: '',
    setor: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Traz 100 registros para filtrar no front
      const response = await api.get('/ordens-servico?size=100'); 
      setOrders(response.data.content);
      setFilteredOrders(response.data.content); // Inicialmente mostra tudo
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

  // --- LÓGICA DE FILTRAGEM ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const results = orders.filter(os => {
        // 1. Filtro de Problema
        const matchProblema = filters.problema 
            ? (os.problema && os.problema.toLowerCase().includes(filters.problema.toLowerCase())) 
            : true;

        // 2. Filtro de Equipamento
        const matchEquipamento = filters.equipamento
            ? (os.nomeEquipamento && os.nomeEquipamento.toLowerCase().includes(filters.equipamento.toLowerCase()))
            : true;

        // 3. Filtro de Setor
        const matchSetor = filters.setor
            ? (os.setorLocalizacao && os.setorLocalizacao.toLowerCase().includes(filters.setor.toLowerCase()))
            : true;

        // 4. Filtro de Status
        const matchStatus = filters.status
            ? os.status === filters.status
            : true;

        // 5. Filtro de Data
        let matchData = true;
        if (filters.dataInicio || filters.dataFim) {
            const dataOS = new Date(os.dataEmissao).setHours(0,0,0,0);
            const dataInicio = filters.dataInicio ? new Date(filters.dataInicio).setHours(0,0,0,0) : null;
            const dataFim = filters.dataFim ? new Date(filters.dataFim).setHours(0,0,0,0) : null;

            if (dataInicio && dataOS < dataInicio) matchData = false;
            if (dataFim && dataOS > dataFim) matchData = false;
        }

        return matchProblema && matchEquipamento && matchSetor && matchStatus && matchData;
    });

    setFilteredOrders(results);
  };

  const handleClearFilters = () => {
      setFilters({ problema: '', equipamento: '', setor: '', status: '', dataInicio: '', dataFim: '' });
      setFilteredOrders(orders); // Restaura lista original
  };

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'EM_ANDAMENTO': return '#eab308';
      case 'CONCLUIDA': return '#22c55e';
      case 'AGUARDANDO_PECAS': return '#f97316';
      case 'EM_OBSERVACAO': return '#3b82f6';
      case 'PAUSADA': return '#64748b';
      case 'CANCELADA': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Consulta de Ordens de Serviço</h1>
        </div>
        <Link to="/ordens-de-servico/nova" className="btn btn-primary">+ Nova O. S.</Link>
      </div>

      {/* ÁREA DE FILTROS */}
      <div style={{
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
      }}>
          <h4 style={{marginTop: 0, marginBottom: '1rem', color: '#64748b'}}>Filtros de Pesquisa</h4>
          
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <div className="form-group" style={{flex: '1 1 200px'}}>
                  <label style={{fontSize: '0.85rem'}}>Problema</label>
                  <input 
                    name="problema" 
                    value={filters.problema} 
                    onChange={handleFilterChange} 
                    placeholder="Buscar por palavra-chave" 
                    style={{padding: '8px', width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                  />
              </div>
              
              <div className="form-group" style={{flex: '1 1 200px'}}>
                  <label style={{fontSize: '0.85rem'}}>Equipamento</label>
                  <input 
                    name="equipamento" 
                    value={filters.equipamento} 
                    onChange={handleFilterChange} 
                    // Placeholder removido
                    style={{padding: '8px', width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                  />
              </div>

              <div className="form-group" style={{flex: '1 1 150px'}}>
                  <label style={{fontSize: '0.85rem'}}>Setor / Local</label>
                  <input 
                    name="setor" 
                    value={filters.setor} 
                    onChange={handleFilterChange} 
                    // Placeholder removido
                    style={{padding: '8px', width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                  />
              </div>

              <div className="form-group" style={{flex: '1 1 150px'}}>
                  <label style={{fontSize: '0.85rem'}}>Status</label>
                  <select 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange} 
                    style={{padding: '8px', width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                  >
                      <option value="">Todos</option>
                      <option value="EM_ANDAMENTO">Em andamento</option>
                      <option value="CONCLUIDA">Concluída</option>
                      <option value="AGUARDANDO_PECAS">Aguardando peças</option>
                      <option value="EM_OBSERVACAO">Em observação</option>
                      <option value="PAUSADA">Pausada</option>
                      <option value="CANCELADA">Cancelada</option>
                  </select>
              </div>

              {/* DATAS RENOMEADAS */}
              <div className="form-group" style={{flex: '1 1 130px'}}>
                  <label style={{fontSize: '0.85rem'}}>Data Abertura (Início)</label>
                  <input 
                    type="date" 
                    name="dataInicio" 
                    value={filters.dataInicio} 
                    onChange={handleFilterChange} 
                    style={{padding: '8px', width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                  />
              </div>

              <div className="form-group" style={{flex: '1 1 130px'}}>
                  <label style={{fontSize: '0.85rem'}}>Data Abertura (Fim)</label>
                  <input 
                    type="date" 
                    name="dataFim" 
                    value={filters.dataFim} 
                    onChange={handleFilterChange} 
                    style={{padding: '8px', width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                  />
              </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem'}}>
              <button className="btn btn-secondary" onClick={handleClearFilters}>Limpar</button>
              <button className="btn btn-primary" onClick={handleSearch}>Pesquisar</button>
          </div>
      </div>

      {/* TABELA DE RESULTADOS */}
      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Data Abertura</th>
                  <th>Status</th>
                  <th>N° da O. S.</th>
                  <th>Equipamento</th>
                  <th>Setor / Localização da máquina</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(os => (
                    <tr key={os.id}>
                      <td>{new Date(os.dataEmissao).toLocaleDateString()}</td>
                      <td>
                        <span style={{
                          backgroundColor: getStatusColor(os.status),
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          {formatStatus(os.status)}
                        </span>
                      </td>
                      <td style={{fontWeight: 'bold'}}>#{os.numeroOs}</td>
                      <td>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                              {os.fotoEquipamento && (
                                  <img src={os.fotoEquipamento} alt="" style={{width: 30, height: 30, borderRadius: '4px', objectFit: 'cover'}} />
                              )}
                              <span>{os.nomeEquipamento}</span>
                          </div>
                      </td>
                      <td>{os.setorLocalizacao || '-'}</td>
                      <td>
                        <Link to={`/ordens-de-servico/${os.id}`} className="btn btn-secondary">
                          Ver Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                     <td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
                       Nenhum registro encontrado com os filtros selecionados.
                     </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{
                padding: '1rem 1.5rem', 
                borderTop: '1px solid #e2e8f0', 
                textAlign: 'right', 
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.9rem',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px'
            }}>
                <strong>{filteredOrders.length}</strong> registros encontrados
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceOrderList;
