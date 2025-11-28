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
  const [osImages, setOsImages] = useState([]);
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
      
      const resImgs = await api.get(`/ordens-servico/${id}/imagens`);
      setOsImages(resImgs.data);

      const resHist = await api.get(`/ordens-servico/${id}/historico`);
      setHistory(resHist.data);

      const resTechs = await api.get('/tecnicos?size=100');
      setAllTechnicians(resTechs.data.content);

      const resStock = await api.get('/itens-estoque?size=1000');
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
      
      const originalItem = stockItems.find(i => i.id === Number(itemForm.idItemEstoque));
      
      try {
          await api.post(`/ordens-servico/${id}/itens`, {
              idItemEstoque: itemForm.idItemEstoque,
              quantidade: itemForm.quantidade,
              valorPersonalizado: originalItem ? originalItem.valorUnitario : 0
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

  // --- AÇÕES: IMAGENS ---
  const handleUploadImage = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('foto', file);

      try {
          await api.post(`/ordens-servico/${id}/imagens`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          const resImgs = await api.get(`/ordens-servico/${id}/imagens`);
          setOsImages(resImgs.data);
      } catch (error) {
          alert("Erro ao enviar imagem.");
      }
  };

  const handleDeleteImage = async (imgId) => {
      if(window.confirm("Excluir imagem?")) {
          try {
              await api.delete(`/ordens-servico/imagens/${imgId}`);
              setOsImages(prev => prev.filter(img => img.id !== imgId));
          } catch (error) { alert("Erro ao excluir."); }
      }
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

  const formatMoney = (value) => `R$${Number(value).toFixed(2).replace('.', ',')}`;
  
  const formatDateDisplay = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString(); 
  };

  const headerInputStyle = {
      padding: '0.4rem',
      border: '1px solid #cbd5e1',
      borderRadius: '4px',
      fontSize: '0.95rem',
      width: '100%',
      color: '#334155'
  };

  const textAreaStyle = { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s' };
  const sectionTitleStyle = { marginTop: '0', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' };

  if (loading || !os) return <div className="container"><p>Carregando...</p></div>;

  return (
    <div className="container">
      <div className="page-header">
         <div className="page-header-left">
            <Link to="/ordens-de-servico" className="btn btn-secondary btn-back">&larr; Voltar</Link>
            <h1>Ordem de Serviço</h1>
         </div>
         <div className="status-badge" style={{backgroundColor: getStatusColor(os.status)}}>
             {formatStatus(os.status)}
         </div>
      </div>

      {/* CABEÇALHO EDITÁVEL */}
      <div className="os-detail-header">
         <div className="os-info-grid" style={{width: '100%', gridTemplateColumns: 'repeat(5, 1fr)'}}>
             <div>
                 <span className="info-label">N° da O. S.</span>
                 <span className="info-value">#{os.numeroOs}</span>
             </div>
             <div>
                 <span className="info-label">Data Abertura</span>
                 <span className="info-value">{formatDateDisplay(os.dataEmissao)}</span>
             </div>
             <div>
                 <span className="info-label">Data Início</span>
                 <input type="date" name="dataInicio" value={os.dataInicio ? os.dataInicio.split('T')[0] : ''} onChange={handleInputChange} style={headerInputStyle} />
             </div>
             <div>
                 <span className="info-label">Data Fim (Conclusão)</span>
                 <input type="date" name="dataFim" value={os.dataFim ? os.dataFim.split('T')[0] : ''} onChange={handleInputChange} style={headerInputStyle} />
             </div>
             <div>
                 <span className="info-label">Setor / Localização</span>
                 <input type="text" name="setorLocalizacao" value={os.setorLocalizacao || ''} onChange={handleInputChange} style={headerInputStyle} placeholder="Ex: Galpão 1" />
             </div>
         </div>
      </div>

      {/* TABS */}
      <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'principal' ? 'active' : ''}`} onClick={() => setActiveTab('principal')}>Principal</button>
          <button className={`tab-btn ${activeTab === 'adicionais' ? 'active' : ''}`} onClick={() => setActiveTab('adicionais')}>Informações Adicionais</button>
          <button className={`tab-btn ${activeTab === 'observacoes' ? 'active' : ''}`} onClick={() => setActiveTab('observacoes')}>Observações</button>
          <button className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setActiveTab('historico')}>Histórico de Status</button>
          {/* MUDANÇA: Imagens movida para o final */}
          <button className={`tab-btn ${activeTab === 'imagens' ? 'active' : ''}`} onClick={() => setActiveTab('imagens')}>Imagens</button>
      </div>

      <div className="tab-content">
          
          {/* ABA PRINCIPAL */}
          {activeTab === 'principal' && (
              <div>
                  
                  {/* EQUIPAMENTO */}
                  <div style={{display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                      {os.fotoEquipamento ? (
                          <img src={os.fotoEquipamento} alt="Equipamento" style={{width: 60, height: 60, objectFit: 'cover', borderRadius: '4px'}} />
                      ) : (
                          <div style={{width: 60, height: 60, background: '#cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📷</div>
                      )}
                      <div>
                          <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold'}}>EQUIPAMENTO</span>
                          <h3 style={{margin: '0', fontSize: '1.2rem'}}>{os.nomeEquipamento}</h3>
                      </div>
                  </div>

                  {/* 1. STATUS */}
                  <div className="form-group" style={{marginBottom: '2rem'}}>
                      <label>Status</label>
                      <select name="status" value={os.status} onChange={handleInputChange} className="form-select" style={{maxWidth: '300px'}}>
                          <option value="EM_ANDAMENTO">Em andamento</option>
                          <option value="CONCLUIDA">Concluída</option>
                          <option value="AGUARDANDO_PECAS">Aguardando peças</option>
                          <option value="EM_OBSERVACAO">Em observação</option>
                          <option value="PAUSADA">Pausada</option>
                          <option value="CANCELADA">Cancelada</option>
                      </select>
                  </div>

                  {/* 2. TÉCNICOS */}
                  <div className="form-group" style={{width: '100%', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem'}}>
                    <label>Técnicos Responsáveis</label>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                        <select 
                            value={selectedTechId} 
                            onChange={(e) => setSelectedTechId(e.target.value)} 
                            className="form-select"
                            style={{flex: 1}}
                        >
                            <option value="">Selecione os técnicos responsáveis</option>
                            {allTechnicians.map(t => (
                                <option key={t.id} value={t.id}>{t.nome}</option>
                            ))}
                        </select>
                        <button className="btn btn-secondary" onClick={handleAddTechnician}>Adicionar</button>
                    </div>
                    
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                        {os.tecnicos && os.tecnicos.length > 0 ? (
                            os.tecnicos.map(techId => {
                                const tech = allTechnicians.find(t => t.id === techId);
                                return tech ? (
                                    <span key={techId} style={{background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        {tech.nome}
                                        <button onClick={() => handleRemoveTechnician(techId)} style={{border: 'none', background: 'none', color: '#3730a3', cursor: 'pointer', fontWeight: 'bold'}}>✕</button>
                                    </span>
                                ) : null;
                            })
                        ) : <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>Nenhum técnico atribuído.</span>}
                    </div>
                 </div>

                  {/* 3. PROBLEMA */}
                  <div className="form-group">
                      <label>Descrição do Problema</label>
                      <textarea name="problema" rows="3" value={os.problema} onChange={handleInputChange} style={textAreaStyle} />
                  </div>

                  {/* 4. PEÇAS E SERVIÇOS */}
                  <div className="form-group" style={{width: '100%', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '2rem'}}>
                      <label style={{marginBottom: '1rem', display: 'block', fontWeight: 'bold'}}>Peças/Serviços</label>
                      
                      <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '1rem'}}>
                          <div style={{flex: 3}}>
                              <label style={{fontSize: '0.9rem', color: '#64748b'}}>Descrição</label>
                              <select className="form-select" value={itemForm.idItemEstoque} onChange={e => setItemForm({...itemForm, idItemEstoque: e.target.value})}>
                                  <option value="">Selecione um produto ou serviço</option>
                                  {stockItems.map(i => (
                                      <option key={i.id} value={i.id}>{i.nome} {i.codigoProduto.startsWith('SRV') ? '(Serviço)' : `(Estoque: ${i.quantidade})`}</option>
                                  ))}
                              </select>
                          </div>
                          <div style={{flex: 1}}>
                              <label style={{fontSize: '0.9rem', color: '#64748b'}}>Quantidade</label>
                              <input type="number" min="1" value={itemForm.quantidade} onChange={e => setItemForm({...itemForm, quantidade: e.target.value})} />
                          </div>
                          <button className="btn btn-primary" onClick={handleAddItem}>+ Adicionar</button>
                      </div>

                      <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '4px', overflow: 'hidden'}}>
                          <thead>
                              <tr style={{background: '#e2e8f0', fontSize: '0.85rem', color: '#475569'}}>
                                  <th style={{padding: '8px', textAlign: 'left'}}>Código Produto/Serviço</th>
                                  <th style={{padding: '8px', textAlign: 'left'}}>Descrição</th>
                                  <th style={{padding: '8px', textAlign: 'center'}}>Quantidade</th>
                                  <th style={{padding: '8px', textAlign: 'right'}}>Valor Unitário (R$)</th>
                                  <th style={{padding: '8px', textAlign: 'right'}}>Valor Total (R$)</th>
                                  <th style={{padding: '8px', textAlign: 'center'}}>Ações</th>
                              </tr>
                          </thead>
                          <tbody>
                              {osItems.length > 0 ? (
                                  osItems.map(item => {
                                      const originalStockItem = stockItems.find(s => s.id === item.idItemEstoque);
                                      const codigo = originalStockItem ? originalStockItem.codigoProduto : '-';

                                      return (
                                          <tr key={item.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                                              <td style={{padding: '8px', fontSize: '0.9rem'}}>{codigo}</td>
                                              <td style={{padding: '8px', fontSize: '0.9rem'}}>{item.nomeItem}</td>
                                              <td style={{padding: '8px', textAlign: 'center', fontSize: '0.9rem'}}>{item.quantidade}</td>
                                              <td style={{padding: '8px', textAlign: 'right', fontSize: '0.9rem'}}>{formatMoney(item.valorUnitario)}</td>
                                              <td style={{padding: '8px', textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold'}}>{formatMoney(item.valorTotal)}</td>
                                              <td style={{padding: '8px', textAlign: 'center'}}>
                                                  <button className="btn btn-danger" style={{padding: '2px 8px', fontSize: '0.8rem'}} onClick={() => handleRemoveItem(item.id)}>Excluir</button>
                                              </td>
                                          </tr>
                                      );
                                  })
                              ) : (
                                  <tr>
                                      <td colSpan="6" style={{textAlign: 'center', padding: '1.5rem', color: '#94a3b8'}}>Nenhuma peça ou serviço adicionado.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                      
                      {osItems.length > 0 && (
                          <div className="totals-row" style={{textAlign: 'right', marginTop: '10px', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b'}}>
                              Total Geral: {formatMoney(osItems.reduce((acc, i) => acc + i.valorTotal, 0))}
                          </div>
                      )}
                  </div>

                  <button className="btn btn-primary" style={{marginTop: '1rem'}} onClick={handleUpdateOs}>Salvar</button>
              </div>
          )}

          {/* --- ABA 2: INFORMAÇÕES ADICIONAIS --- */}
          {activeTab === 'adicionais' && (
              <div>
                  <h4 style={sectionTitleStyle}>Informações Adicionais</h4>
                  <div className="form-group">
                      <label>Defeito Constatado</label>
                      <textarea name="defeitoConstatado" rows="4" value={os.defeitoConstatado || ''} onChange={handleInputChange} placeholder="Diagnóstico técnico..." style={textAreaStyle} />
                  </div>
                  <div className="form-group">
                      <label>Ações Realizadas</label>
                      <textarea name="acoesARealizar" rows="4" value={os.acoesARealizar || ''} onChange={handleInputChange} placeholder="O que foi feito..." style={textAreaStyle} />
                  </div>
                  <button className="btn btn-primary" style={{marginTop: '1rem'}} onClick={handleUpdateOs}>Salvar</button>
              </div>
          )}

          {/* --- ABA 3: OBSERVAÇÕES --- */}
          {activeTab === 'observacoes' && (
              <div>
                  <h4 style={sectionTitleStyle}>Observações</h4>
                  <div className="form-group">
                      <textarea 
                          name="observacoes" 
                          rows="6" 
                          value={os.observacoes || ''} 
                          onChange={handleInputChange} 
                          placeholder="Observações gerais..." 
                          style={textAreaStyle}
                      />
                  </div>
                  <button className="btn btn-primary" style={{marginTop: '1rem'}} onClick={handleUpdateOs}>Salvar</button>
              </div>
          )}

          {/* --- ABA 4: HISTÓRICO --- */}
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

          {/* --- ABA 5: IMAGENS (MOVIDA PARA O FIM) --- */}
          {activeTab === 'imagens' && (
              <div>
                  <h4 style={sectionTitleStyle}>Anexos e Imagens</h4>
                  <div style={{marginBottom: '20px', padding: '15px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center'}}>
                      <label htmlFor="img-upload" className="btn btn-secondary" style={{cursor: 'pointer'}}>+ Adicionar Imagem</label>
                      <input id="img-upload" type="file" accept="image/*" onChange={handleUploadImage} style={{display: 'none'}} />
                      {/* MUDANÇA: Texto do formato */}
                      <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '10px'}}>Formatos suportados: .JPG, .PNG</p>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px'}}>
                      {osImages.map(img => (
                          <div key={img.id} style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                              <img src={img.caminho} alt="Anexo" style={{width: '100%', height: '150px', objectFit: 'cover'}} />
                              <button 
                                onClick={() => handleDeleteImage(img.id)}
                                style={{position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                              >✕</button>
                          </div>
                      ))}
                      {osImages.length === 0 && <p style={{color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center'}}>Nenhuma imagem anexada.</p>}
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default ServiceOrderDetail;
