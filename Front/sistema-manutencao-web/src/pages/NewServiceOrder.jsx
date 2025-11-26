import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewServiceOrder = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  
  // Estados para Técnicos (Múltipla Seleção)
  const [allTechnicians, setAllTechnicians] = useState([]); 
  const [selectedTechId, setSelectedTechId] = useState(''); 
  const [assignedTechnicians, setAssignedTechnicians] = useState([]); 

  // Estado do Formulário
  const [formData, setFormData] = useState({
    numeroOs: 'OS-' + Math.floor(Math.random() * 100000),
    idEquipamento: '',
    problema: '',           
    defeitoConstatado: '',  
    acoesARealizar: '',     
    setorLocalizacao: '',
    status: 'EM_ANDAMENTO', // NOVO STATUS PADRÃO
    observacoes: ''
  });

  // Carrega Listas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEq = await api.get('/equipamentos?size=100');
        setEquipments(resEq.data.content);

        const resTec = await api.get('/tecnicos?size=100');
        setAllTechnicians(resTec.data.content);
      } catch (error) {
        console.error("Erro ao carregar listas", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE MÚLTIPLOS TÉCNICOS ---
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

  // --- SALVAR ---
  const handleSubmit = async () => {
    if (!formData.idEquipamento || !formData.numeroOs) {
      alert("O Número da OS e o Equipamento são obrigatórios.");
      return;
    }

    try {
      // 1. Cria a OS
      const response = await api.post('/ordens-servico', formData);
      const newOsId = response.data.id;

      // 2. Atribui os técnicos selecionados
      if (assignedTechnicians.length > 0) {
        const techIds = assignedTechnicians.map(t => t.id);
        await api.post(`/ordens-servico/${newOsId}/tecnicos`, techIds);
      }

      alert("Ordem de Serviço aberta com sucesso!");
      navigate('/ordens-de-servico'); 
    } catch (error) {
      console.error(error);
      alert("Erro ao abrir OS. Verifique se o número da OS já existe.");
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/ordens-de-servico" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Abrir Nova Ordem de Serviço</h1>
        </div>
      </div>

      <div className="card" style={{width: '100%', maxWidth: '900px', margin: '0 auto', alignItems: 'flex-start'}}>
         
         {/* LINHA 1: Dados Básicos */}
         <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
             <div className="form-group" style={{flex: 1}}>
                <label>N° da O. S.</label>
                <input name="numeroOs" value={formData.numeroOs} onChange={handleInputChange} />
             </div>
             
             <div className="form-group" style={{flex: 1}}>
                <label>Status</label>
                {/* SELECT ATUALIZADO COM OS NOVOS STATUS */}
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

         {/* SELEÇÃO DE TÉCNICOS (MÚLTIPLOS) */}
         <div className="form-group" style={{width: '100%', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <label>Técnicos Responsáveis</label>
            <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                <select 
                    value={selectedTechId} 
                    onChange={(e) => setSelectedTechId(e.target.value)} 
                    className="form-select"
                    style={{flex: 1}}
                >
                    <option value="">Selecione para adicionar...</option>
                    {allTechnicians.map(t => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                </select>
                <button className="btn btn-secondary" onClick={handleAddTechnician}>Adicionar</button>
            </div>
            
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {assignedTechnicians.map(tech => (
                    <span key={tech.id} style={{
                        background: '#e0e7ff', 
                        color: '#3730a3', 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {tech.nome}
                        <button 
                            onClick={() => handleRemoveTechnician(tech.id)}
                            style={{border: 'none', background: 'none', color: '#3730a3', cursor: 'pointer', fontWeight: 'bold'}}
                        >
                            ✕
                        </button>
                    </span>
                ))}
                {assignedTechnicians.length === 0 && <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>Nenhum técnico atribuído ainda.</span>}
            </div>
         </div>

         {/* LINHA 2: Equipamento */}
         <div className="form-group" style={{width: '100%'}}>
            <label>Equipamento</label> 
            <select name="idEquipamento" value={formData.idEquipamento} onChange={handleInputChange} className="form-select">
                <option value="">Selecione o equipamento...</option>
                {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nome} ({eq.marca ? eq.marca.name : ''})</option>
                ))}
            </select>
         </div>

         {/* LINHA 3: Problema */}
         <div className="form-group" style={{width: '100%'}}>
            <label>Problema</label>
            <input 
                name="problema" 
                value={formData.problema} 
                onChange={handleInputChange} 
                placeholder="Detalhes do problema..." 
            />
         </div>

         {/* LINHA 4: Defeito e Ações */}
         <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
             <div className="form-group" style={{flex: 1}}>
                <label>Defeito Constatado</label>
                <textarea 
                    name="defeitoConstatado" 
                    rows="2" 
                    value={formData.defeitoConstatado} 
                    onChange={handleInputChange} 
                    placeholder="Diagnóstico técnico..." 
                />
             </div>
             <div className="form-group" style={{flex: 1}}>
                <label>Ações a Realizar</label>
                <textarea 
                    name="acoesARealizar" 
                    rows="2" 
                    value={formData.acoesARealizar} 
                    onChange={handleInputChange} 
                    placeholder="Planejamento da manutenção..." 
                />
             </div>
         </div>

         <div className="form-group" style={{width: '100%'}}>
            <label>Setor / Localização da máquina</label>
            <input name="setorLocalizacao" value={formData.setorLocalizacao} onChange={handleInputChange} />
         </div>

         <div className="form-group" style={{width: '100%'}}>
            <label>Observações</label>
            <textarea name="observacoes" rows="2" value={formData.observacoes} onChange={handleInputChange} />
         </div>

         <div className="modal-actions" style={{justifyContent: 'flex-end', width: '100%', marginTop: '1rem'}}>
             <button className="btn btn-primary" onClick={handleSubmit}>Abrir Ordem de Serviço</button>
         </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
