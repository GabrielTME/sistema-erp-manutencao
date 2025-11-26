import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewServiceOrder = () => {
  const navigate = useNavigate();
  const priceInputRef = useRef(null); 
  
  // Listas de Dados
  const [equipments, setEquipments] = useState([]);
  const [allTechnicians, setAllTechnicians] = useState([]); 
  const [stockItems, setStockItems] = useState([]); 

  // Estados de Seleção Temporária
  const [selectedTechId, setSelectedTechId] = useState(''); 
  const [assignedTechnicians, setAssignedTechnicians] = useState([]); 
  
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQuantity, setPartQuantity] = useState(1);
  const [partUnitPrice, setPartUnitPrice] = useState(''); 
  const [assignedParts, setAssignedParts] = useState([]); 

  // Estado do Formulário
  const [formData, setFormData] = useState({
    numeroOs: '', 
    idEquipamento: '',
    problema: '',           
    defeitoConstatado: '',  
    acoesARealizar: '',     
    setorLocalizacao: '',
    status: 'EM_ANDAMENTO', 
    observacoes: ''
  });

  // Carrega Listas
  const loadLists = async () => {
    try {
      const resEq = await api.get('/equipamentos?size=100');
      setEquipments(resEq.data.content);

      const resTec = await api.get('/tecnicos?size=100');
      setAllTechnicians(resTec.data.content);

      const resStock = await api.get('/itens-estoque?size=1000'); 
      setStockItems(resStock.data.content);
    } catch (error) {
      console.error("Erro ao carregar listas", error);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE TÉCNICOS ---
  const handleAddTechnician = () => {
    if (!selectedTechId) return;
    if (assignedTechnicians.some(t => t.id === Number(selectedTechId))) {
        alert("Técnico já adicionado.");
        return;
    }
    const techObj = allTechnicians.find(t => t.id === Number(selectedTechId));
    if (techObj) {
        setAssignedTechnicians([...assignedTechnicians, techObj]);
        setSelectedTechId(''); 
    }
  };

  const handleRemoveTechnician = (idToRemove) => {
      setAssignedTechnicians(assignedTechnicians.filter(t => t.id !== idToRemove));
  };

  // --- LÓGICA DE PEÇAS E SERVIÇOS ---

  const handlePartSelection = (e) => {
      const id = e.target.value;
      setSelectedPartId(id);
      
      if (id) {
          const item = stockItems.find(i => i.id === Number(id));
          if (item) {
              setPartUnitPrice(item.valorUnitario); 
          }
      } else {
          setPartUnitPrice('');
      }
  };

  // Lógica Automática de Horas Técnicas
  const handleSelectHorasTecnicas = async () => {
      const SERVICE_NAME = "Horas Técnicas de Manutenção";
      
      let serviceItem = stockItems.find(i => i.nome === SERVICE_NAME);

      // Se não existir, cria no backend
      if (!serviceItem) {
          try {
              const res = await api.post('/servicos', { nome: SERVICE_NAME });
              serviceItem = res.data;
              // Adiciona na lista local imediatamente
              setStockItems(prev => [...prev, serviceItem]);
          } catch (error) {
              console.error("Erro ao criar serviço:", error);
              alert("Erro ao gerar item de serviço. Verifique se o backend foi reiniciado.");
              return;
          }
      }

      if (serviceItem) {
          setSelectedPartId(serviceItem.id);
          setPartQuantity(1);
          setPartUnitPrice(''); // Limpa para digitar
          
          setTimeout(() => {
              if (priceInputRef.current) {
                  priceInputRef.current.focus();
              }
          }, 100);
      }
  };

  const handleAddPart = () => {
      if (!selectedPartId || partQuantity <= 0 || partUnitPrice === '') {
          alert("Preencha o item, a quantidade e o valor.");
          return;
      }
      
      if (assignedParts.some(p => p.id === Number(selectedPartId))) {
          alert("Item já adicionado na lista.");
          return;
      }

      const partObj = stockItems.find(i => i.id === Number(selectedPartId));
      if (partObj) {
          const isService = partObj.codigoProduto && partObj.codigoProduto.startsWith('SRV');
          
          if (!isService && partQuantity > partObj.quantidade) {
              alert(`Estoque insuficiente! Disponível: ${partObj.quantidade}`);
              return;
          }

          setAssignedParts([...assignedParts, { 
              ...partObj, 
              qtdSolicitada: parseFloat(partQuantity),
              precoPraticado: parseFloat(partUnitPrice) 
          }]);
          
          setSelectedPartId('');
          setPartQuantity(1);
          setPartUnitPrice('');
      }
  };

  const handleRemovePart = (idToRemove) => {
      setAssignedParts(assignedParts.filter(p => p.id !== idToRemove));
  };

  const formatMoney = (value) => `R$${Number(value).toFixed(2).replace('.', ',')}`;
  const totalGeralPecas = assignedParts.reduce((acc, item) => acc + (item.precoPraticado * item.qtdSolicitada), 0);

  // --- SALVAR TUDO ---
  const handleSubmit = async () => {
    if (!formData.idEquipamento) {
      alert("Selecione o Equipamento.");
      return;
    }

    const payload = { ...formData, numeroOs: 'GERADO_AUTO' };

    try {
      const response = await api.post('/ordens-servico', payload);
      const newOsId = response.data.id;

      if (assignedTechnicians.length > 0) {
        const techIds = assignedTechnicians.map(t => t.id);
        await api.post(`/ordens-servico/${newOsId}/tecnicos`, techIds);
      }

      if (assignedParts.length > 0) {
          for (const part of assignedParts) {
              await api.post(`/ordens-servico/${newOsId}/itens`, {
                  idItemEstoque: part.id,
                  quantidade: part.qtdSolicitada,
                  valorPersonalizado: part.precoPraticado
              });
          }
      }

      alert(`Ordem de Serviço ${response.data.numeroOs} aberta com sucesso!`);
      navigate('/ordens-de-servico'); 
    } catch (error) {
      console.error(error);
      alert("Erro ao abrir OS. Verifique os dados.");
    }
  };

  const inputStyle = {
      width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0',
      borderRadius: '6px', fontSize: '1rem', fontFamily: 'inherit',
      resize: 'vertical', outline: 'none', transition: 'border-color 0.2s'
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/ordens-de-servico" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Cadastro de Ordem de Serviço</h1>
        </div>
      </div>

      <div style={{
          width: '100%', maxWidth: '900px', margin: '0 auto', 
          backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
         
         {/* 1. N° OS e STATUS */}
         <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
             <div className="form-group" style={{flex: 1}}>
                <label>N° da O. S.</label>
                <input name="numeroOs" value="Gerado automaticamente" readOnly disabled
                    style={{...inputStyle, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed'}} 
                />
             </div>
             <div className="form-group" style={{flex: 1}}>
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-select">
                    <option value="EM_ANDAMENTO">Em andamento</option>
                    <option value="CONCLUIDA">Concluída</option>
                    <option value="AGUARDANDO_PECAS">Aguardando peças</option>
                    <option value="EM_OBSERVACAO">Em observação</option>
                    <option value="PAUSADA">Pausada</option>
                    <option value="CANCELADA">Cancelada</option>
                </select>
             </div>
         </div>

         {/* 2. EQUIPAMENTO */}
         <div className="form-group" style={{width: '100%'}}>
            <label>Equipamento</label> 
            <select name="idEquipamento" value={formData.idEquipamento} onChange={handleInputChange} className="form-select">
                <option value="">Selecione o equipamento</option>
                {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nome} ({eq.marca ? eq.marca.name : ''})</option>
                ))}
            </select>
         </div>

         {/* 3. SETOR */}
         <div className="form-group" style={{width: '100%'}}>
            <label>Setor / Localização da máquina</label>
            <input name="setorLocalizacao" value={formData.setorLocalizacao} onChange={handleInputChange} style={inputStyle} />
         </div>

         {/* 4. PROBLEMA */}
         <div className="form-group" style={{width: '100%'}}>
            <label>Problema</label>
            <input name="problema" value={formData.problema} onChange={handleInputChange} placeholder="Descreva o problema relatado" style={inputStyle} />
         </div>

         {/* 5. DEFEITO e AÇÕES */}
         <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
             <div className="form-group" style={{flex: 1}}>
                <label>Defeito Constatado</label>
                <textarea name="defeitoConstatado" rows="2" value={formData.defeitoConstatado} onChange={handleInputChange} style={inputStyle} placeholder="Descreva o defeito constatado" />
             </div>
             <div className="form-group" style={{flex: 1}}>
                <label>Ações a Realizar</label>
                <textarea name="acoesARealizar" rows="2" value={formData.acoesARealizar} onChange={handleInputChange} style={inputStyle} placeholder="Descreva as ações que devem ser realizadas" />
             </div>
         </div>

         {/* 6. TÉCNICOS */}
         <div className="form-group" style={{width: '100%', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <label>Técnicos Responsáveis</label>
            <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                <select value={selectedTechId} onChange={(e) => setSelectedTechId(e.target.value)} className="form-select" style={{flex: 1}}>
                    <option value="">Selecione os técnicos responsáveis</option>
                    {allTechnicians.map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}
                </select>
                <button className="btn btn-secondary" onClick={handleAddTechnician}>Adicionar</button>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {assignedTechnicians.map(tech => (
                    <span key={tech.id} style={{background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {tech.nome}
                        <button onClick={() => handleRemoveTechnician(tech.id)} style={{border: 'none', background: 'none', color: '#3730a3', cursor: 'pointer', fontWeight: 'bold'}}>✕</button>
                    </span>
                ))}
            </div>
         </div>

         {/* 7. OBSERVAÇÕES */}
         <div className="form-group" style={{width: '100%'}}>
            <label>Observações</label>
            <textarea name="observacoes" rows="2" value={formData.observacoes} onChange={handleInputChange} style={inputStyle} placeholder="Digite observações gerais sobre a ordem de serviço" />
         </div>

         {/* 8. PEÇAS E SERVIÇOS */}
         <div className="form-group" style={{width: '100%', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <label>Peças/Serviços</label>
            
            <div style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                <div style={{flex: 4, minWidth: '200px'}}>
                    <label style={{fontSize: '0.8rem', color: '#64748b'}}>Item (Estoque)</label>
                    <select value={selectedPartId} onChange={handlePartSelection} className="form-select" style={{width: '100%'}}>
                        <option value="">Selecione...</option>
                        {stockItems.map(i => (
                            <option key={i.id} value={i.id}>{i.nome} {i.codigoProduto.startsWith('SRV') ? '(Serviço)' : `(Est: ${i.quantidade})`}</option>
                        ))}
                    </select>
                </div>
                <div style={{flex: 1, minWidth: '80px'}}>
                    <label style={{fontSize: '0.8rem', color: '#64748b'}}>Qtd.</label>
                    <input type="number" min="1" value={partQuantity} onChange={(e) => setPartQuantity(e.target.value)} style={{...inputStyle, padding: '0.5rem'}} />
                </div>
                <div style={{flex: 2, minWidth: '100px'}}>
                    <label style={{fontSize: '0.8rem', color: '#64748b'}}>Valor Unit. (R$)</label>
                    <input 
                        ref={priceInputRef}
                        type="number" step="0.01" 
                        value={partUnitPrice} 
                        onChange={(e) => setPartUnitPrice(e.target.value)} 
                        style={{...inputStyle, padding: '0.5rem'}} 
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px'}}>
                <button className="btn btn-secondary" onClick={handleSelectHorasTecnicas} title="Preencher automático">Horas Técnicas</button>
                <button className="btn btn-primary" onClick={handleAddPart}>+ Adicionar Item</button>
            </div>
            
            {/* TABELA COM AS COLUNAS CORRIGIDAS */}
            {assignedParts.length > 0 ? (
                <>
                <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '4px', overflow: 'hidden'}}>
                    <thead>
                        <tr style={{background: '#e2e8f0', fontSize: '0.85rem', color: '#475569'}}>
                            <th style={{padding: '8px', textAlign: 'left'}}>Código Produto</th>
                            <th style={{padding: '8px', textAlign: 'left'}}>Descrição</th>
                            <th style={{padding: '8px', textAlign: 'center'}}>Quantidade</th>
                            <th style={{padding: '8px', textAlign: 'right'}}>Valor Unitário</th>
                            <th style={{padding: '8px', textAlign: 'right'}}>Valor Total</th>
                            <th style={{padding: '8px', textAlign: 'center'}}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedParts.map((part) => (
                            <tr key={part.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                                <td style={{padding: '8px', fontSize: '0.9rem'}}>{part.codigoProduto}</td>
                                <td style={{padding: '8px', fontSize: '0.9rem'}}>{part.nome}</td>
                                <td style={{padding: '8px', textAlign: 'center', fontSize: '0.9rem'}}>{part.qtdSolicitada}</td>
                                <td style={{padding: '8px', textAlign: 'right', fontSize: '0.9rem'}}>{formatMoney(part.precoPraticado)}</td>
                                <td style={{padding: '8px', textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold'}}>
                                    {formatMoney(part.precoPraticado * part.qtdSolicitada)}
                                </td>
                                <td style={{padding: '8px', textAlign: 'center'}}>
                                    <button onClick={() => handleRemovePart(part.id)} style={{border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold'}}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{textAlign: 'right', marginTop: '10px', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b'}}>
                    Total: {formatMoney(totalGeralPecas)}
                </div>
                </>
            ) : (
                <div style={{textAlign: 'center', padding: '1.5rem', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '4px'}}>
                    Nenhuma peça ou serviço adicionado.
                </div>
            )}
         </div>

         <div className="modal-actions" style={{justifyContent: 'flex-end', width: '100%', marginTop: '1rem'}}>
             <button className="btn btn-primary" onClick={handleSubmit}>Abrir Ordem de Serviço</button>
         </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
