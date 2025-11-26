import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './ServiceOrderDetail.css';

const ServiceOrderDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('principal');
  const [loading, setLoading] = useState(true);

  // DADOS DA OS
  const [os, setOs] = useState(null);
  const [osItems, setOsItems] = useState([]);
  const [history, setHistory] = useState([]);
  
  // DADOS AUXILIARES
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [stockItems, setStockItems] = useState([]);

  // ESTADOS DE FORMULÁRIO
  const [selectedTechId, setSelectedTechId] = useState('');
  const [itemForm, setItemForm] = useState({ idItemEstoque: '', quantidade: 1 });

  // --- CARREGAMENTO ---
  const loadData = async () => {
    try {
      setLoading(true);
      
      const resOs = await api.get(`/ordens-servico/${id}`);
      setOs(resOs.data);

      const resItems = await api.get(`/ordens-servico/${id}/itens`);
      setOsItems(resItems.data);

      const resHist = await api.get(`/ordens-servico/${id}/historico`);
      setHistory(resHist.data);

      const resTechs = await api.get('/tecnicos?size=100');
      setAllTechnicians(resTechs.data.content);

      const resStock = await api.get('/itens-estoque?size=100');
      setStockItems(resStock.data.content);

    } catch (error) {
      console.error("Erro ao carregar detalhes", error);
      alert("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // --- AÇÕES: PRINCIPAL ---
  const handleUpdateOs = async () => {
    try {
      await api.put(`/ordens-servico/${id}`, os);
      alert("Dados atualizados!");
      loadData(); 
    } catch (error) {
      alert("Erro ao atualizar.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOs(prev => ({ ...prev, [name]: value }));
  };

  // --- AÇÕES: TÉCNICOS ---
  const handleAddTechnician = async () => {
    if (!selectedTechId) return;
    const currentIds = os.tecnicos || [];
    if (currentIds.includes(Number(selectedTechId))) {
        return alert("Técnico já adicionado.");
    }
    const newIds = [...currentIds, Number(selectedTechId)];

    try {
        await api.post(`/ordens-servico/${id}/tecnicos`, newIds);
        setSelectedTechId('');
        loadData(); 
    } catch (error) {
        alert("Erro ao atribuir técnico.");
    }
  };

  const handleRemoveTechnician = async (techId) => {
      const newIds = os.tecnicos.filter(id => id !== techId);
      try {
          await api.post(`/ordens-servico/${id}/tecnicos`, newIds);
          loadData();
      } catch (error) {
          alert("Erro ao remover técnico.");
      }
  };

  // --- AÇÕES: ITENS ---
  const handleAddItem = async () => {
      if (!itemForm.idItemEstoque || itemForm.quantidade <= 0) return alert("Selecione item e quantidade.");
      
      try {
          await api.post(`/ordens-servico/${id}/itens`, {
              idItemEstoque: itemForm.idItemEstoque,
              quantidade: itemForm.quantidade
          });
          setItemForm({ idItemEstoque: '', quantidade: 1 });
          const resItems = await api.get(`/ordens-servico/${id}/itens`);
          setOsItems(resItems.data);
      } catch (error) {
          console.error(error);
          alert("Erro ao adicionar item. Verifique se há estoque suficiente.");
      }
  };

  const handleRemoveItem = async (itemId) => {
      if(window.confirm("Remover peça e devolver ao estoque?")) {
          try {
              await api.delete(`/ordens-servico/itens/${itemId}`);
              const resItems = await api.get(`/ordens-servico/${id}/itens`);
              setOsItems(resItems.data);
          } catch (error) {
              alert("Erro ao remover item.");
          }
      }
  };

  // --- HELPER DE COR (Mesmas cores da Lista) ---
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

  if (loading || !os) return <div className="container"><p>Carregando...</p></div>;

  return (
    <div className="container">
      <div className="page-header">
         <div className="page-header-left">
            <Link to="/ordens-de-servico" className="btn btn-secondary btn-back">&larr; Voltar</Link>
            <h1>Ordem de Serviço #{os.numeroOs}</h1>
         </div>
         <div className="status-badge" style={{backgroundColor: getStatusColor(os.status)}}>
             {formatStatus(os.status)}
         </div>
      </div>

      {/* CABEÇALHO */}
      <div className="os-detail-header">
         <div className="os-info-grid" style={{width: '100%'}}>
             <div>
                 <span className="info-label">Equipamento</span>
                 <span className="info-value">{os.nomeEquipamento}</span>
             </div>
             <div>
                 <span className="info-label">Data Abertura</span>
                 <span className="info-value">{new Date(os.dataEmissao).toLocaleDateString()}</span>
             </div>
             <div>
                 <span className="info-label">Setor</span>
                 <span className="info-value">{os.setorLocalizacao || '-'}</span>
             </div>
         </div>
         {os.fotoEquipamento && (
             <img src={os.fotoEquipamento} alt="Equipamento" style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginLeft: 20}} />
         )}
      </div>

      {/* TABS */}
      <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'principal' ? 'active' : ''}`} onClick={() => setActiveTab('principal')}>Principal</button>
          <button className={`tab-btn ${activeTab === 'pecas' ? 'active' : ''}`} onClick={() => setActiveTab('pecas')}>Peças e Materiais</button>
          <button className={`tab-btn ${activeTab === 'tecnicos' ? 'active' : ''}`} onClick={() => setActiveTab('tecnicos')}>Técnicos</button>
          <button className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setActiveTab('historico')}>Histórico</button>
      </div>

      <div className="tab-content">
          
          {/* ABA PRINCIPAL */}
          {activeTab === 'principal' && (
              <div>
                  <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                      <div className="form-group" style={{flex: 1}}>
                          <label>Status Atual</label>
                          {/* OPÇÕES DE STATUS ATUALIZADAS */}
                          <select name="status" value={os.status} onChange={handleInputChange} className="form-select">
                              <option value="EM_ANDAMENTO">Em andamento</option>
                              <option value="CONCLUIDA">Concluída</option>
                              <option value="AGUARDANDO_PECAS">Aguardando peças</option>
                              <option value="EM_OBSERVACAO">Em observação</option>
                              <option value="PAUSADA">Pausada</option>
                              <option value="CANCELADA">Cancelada</option>
                          </select>
                      </div>
                      <div className="form-group" style={{flex: 1}}>
                          <label>Data Início</label>
                          <input type="date" name="dataInicio" value={os.dataInicio ? os.dataInicio.split('T')[0] : ''} onChange={handleInputChange} />
                      </div>
                      <div className="form-group" style={{flex: 1}}>
                          <label>Data Fim (Conclusão)</label>
                          <input type="date" name="dataFim" value={os.dataFim ? os.dataFim.split('T')[0] : ''} onChange={handleInputChange} />
                      </div>
                  </div>

                  <div className="form-group">
                      <label>Descrição do Problema</label>
                      <textarea name="problema" rows="3" value={os.problema} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                      <label>Defeito Constatado</label>
                      <textarea name="defeitoConstatado" rows="3" value={os.defeitoConstatado || ''} onChange={handleInputChange} placeholder="Diagnóstico técnico..." />
                  </div>
                  <div className="form-group">
                      <label>Ações Realizadas</label>
                      <textarea name="acoesARealizar" rows="3" value={os.acoesARealizar || ''} onChange={handleInputChange} placeholder="O que foi feito..." />
                  </div>

                  <button className="btn btn-primary" onClick={handleUpdateOs}>Salvar Alterações</button>
              </div>
          )}

          {/* ABA PEÇAS */}
          {activeTab === 'pecas' && (
              <div>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '2rem', background: '#f8fafc', padding: '1rem', borderRadius: 8}}>
                      <div style={{flex: 2}}>
                          <label style={{fontSize: '0.9rem'}}>Adicionar Peça do Estoque</label>
                          <select className="form-select" value={itemForm.idItemEstoque} onChange={e => setItemForm({...itemForm, idItemEstoque: e.target.value})}>
                              <option value="">Selecione...</option>
                              {stockItems.map(i => (
                                  <option key={i.id} value={i.id}>{i.nome} (Estoque: {i.quantidade}) - R$ {i.valorUnitario.toFixed(2)}</option>
                              ))}
                          </select>
                      </div>
                      <div style={{flex: 1}}>
                          <label style={{fontSize: '0.9rem'}}>Qtd.</label>
                          <input type="number" min="1" value={itemForm.quantidade} onChange={e => setItemForm({...itemForm, quantidade: e.target.value})} />
                      </div>
                      <button className="btn btn-primary" onClick={handleAddItem}>+ Adicionar</button>
                  </div>

                  <table>
                      <thead>
                          <tr>
                              <th>Item</th>
                              <th>Qtd</th>
                              <th>Valor Un.</th>
                              <th>Total</th>
                              <th>Ações</th>
                          </tr>
                      </thead>
                      <tbody>
                          {osItems.map(item => (
                              <tr key={item.id}>
                                  <td>{item.nomeItem}</td>
                                  <td>{item.quantidade}</td>
                                  <td>R$ {item.valorUnitario.toFixed(2)}</td>
                                  <td>R$ {item.valorTotal.toFixed(2)}</td>
                                  <td>
                                      <button className="btn btn-danger" style={{fontSize: '0.8rem'}} onClick={() => handleRemoveItem(item.id)}>Remover</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="totals-row">
                      Total Peças: R$ {osItems.reduce((acc, i) => acc + i.valorTotal, 0).toFixed(2)}
                  </div>
              </div>
          )}

          {/* ABA TÉCNICOS */}
          {activeTab === 'tecnicos' && (
              <div>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '2rem'}}>
                      <div style={{flex: 1}}>
                          <label>Atribuir Técnico</label>
                          <select className="form-select" value={selectedTechId} onChange={e => setSelectedTechId(e.target.value)}>
                              <option value="">Selecione...</option>
                              {allTechnicians.map(t => (
                                  <option key={t.id} value={t.id}>{t.nome} ({t.especialidade})</option>
                              ))}
                          </select>
                      </div>
                      <button className="btn btn-primary" onClick={handleAddTechnician}>+ Adicionar à Equipe</button>
                  </div>

                  <h4>Equipe Alocada:</h4>
                  <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                      {os.tecnicos && os.tecnicos.length > 0 ? (
                          os.tecnicos.map(techId => {
                              const tech = allTechnicians.find(t => t.id === techId);
                              return tech ? (
                                  <li key={techId} style={{padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                                      <span><strong>{tech.nome}</strong> - {tech.especialidade}</span>
                                      <button className="btn btn-danger" style={{padding: '2px 8px', fontSize: '0.8rem'}} onClick={() => handleRemoveTechnician(techId)}>Remover</button>
                                  </li>
                              ) : null;
                          })
                      ) : <p>Nenhum técnico atribuído.</p>}
                  </ul>
              </div>
          )}

          {/* ABA HISTÓRICO */}
          {activeTab === 'historico' && (
              <div>
                  <ul style={{borderLeft: '2px solid #e2e8f0', paddingLeft: '20px', listStyle: 'none'}}>
                      {history.map(h => (
                          <li key={h.id} style={{marginBottom: '20px', position: 'relative'}}>
                              <div style={{position: 'absolute', left: '-29px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: '#3b82f6'}}></div>
                              <p style={{margin: 0, fontSize: '0.85rem', color: '#64748b'}}>{new Date(h.dataEvento).toLocaleString()}</p>
                              <p style={{margin: '5px 0 0 0', fontWeight: 'bold'}}>{formatStatus(h.status)}</p>
                              <p style={{margin: 0}}>{h.descricao}</p>
                          </li>
                      ))}
                  </ul>
              </div>
          )}

      </div>
    </div>
  );
};

export default ServiceOrderDetail;
