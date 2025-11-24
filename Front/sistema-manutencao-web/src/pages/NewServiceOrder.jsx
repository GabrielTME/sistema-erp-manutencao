import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewServiceOrder = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  
  // Gera um número de OS aleatório inicial (pode ser editado)
  const [formData, setFormData] = useState({
    numeroOs: 'OS-' + Math.floor(Math.random() * 100000),
    idEquipamento: '',
    problema: '',
    setorLocalizacao: '',
    status: 'ABERTA', // Status inicial padrão
    observacoes: ''
  });

  // Carrega equipamentos para o Select
  useEffect(() => {
    api.get('/equipamentos?size=100').then(res => {
        setEquipments(res.data.content);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.idEquipamento || !formData.numeroOs || !formData.problema) {
      alert("Preencha o Número, o Equipamento e o Problema.");
      return;
    }

    try {
      await api.post('/ordens-servico', formData);
      alert("Ordem de Serviço aberta com sucesso!");
      navigate('/ordens-de-servico'); // Redireciona para a lista
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

      <div className="card" style={{width: '100%', maxWidth: '800px', margin: '0 auto', alignItems: 'flex-start'}}>
         <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
             <div className="form-group" style={{flex: 1}}>
                <label>Número da OS *</label>
                <input name="numeroOs" value={formData.numeroOs} onChange={handleInputChange} />
             </div>
             <div className="form-group" style={{flex: 1}}>
                <label>Status Inicial</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-select">
                    <option value="ABERTA">ABERTA</option>
                    <option value="EM_ANALISE">EM ANÁLISE</option>
                    <option value="URGENTE">URGENTE</option>
                </select>
             </div>
         </div>

         <div className="form-group" style={{width: '100%'}}>
            <label>Equipamento *</label>
            <select name="idEquipamento" value={formData.idEquipamento} onChange={handleInputChange} className="form-select">
                <option value="">Selecione o equipamento...</option>
                {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nome} ({eq.marca ? eq.marca.nome : ''})</option>
                ))}
            </select>
         </div>

         <div className="form-group" style={{width: '100%'}}>
            <label>Descrição do Problema *</label>
            <textarea name="problema" rows="4" value={formData.problema} onChange={handleInputChange} placeholder="Descreva o que está acontecendo com o equipamento..." />
         </div>

         <div className="form-group" style={{width: '100%'}}>
            <label>Setor / Localização</label>
            <input name="setorLocalizacao" value={formData.setorLocalizacao} onChange={handleInputChange} placeholder="Ex: Galpão 2, Linha de Produção..." />
         </div>

         <div className="form-group" style={{width: '100%'}}>
            <label>Observações Iniciais</label>
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
