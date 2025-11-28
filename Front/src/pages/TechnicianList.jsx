import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const TechnicianList = () => {
  const [technicians, setTechnicians] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  // Form states
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', idCategoria: '' });

  // Buscas
  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await api.get('/tecnicos/categorias');
      setCategories(cats.data);

      const tecs = await api.get('/tecnicos?size=100');
      setTechnicians(tecs.data.content);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setFormData({ nome: '', idCategoria: '' });
    setAddModalOpen(true);
  };

  const openEdit = (tec) => {
    setCurrentId(tec.id);
    setFormData({ nome: tec.nome, idCategoria: tec.idCategoria });
    setEditModalOpen(true);
  };

  // Ações API
  const handleSave = async (isEdit) => {
    if (!formData.nome || !formData.idCategoria) {
      alert("Preencha nome e escolha uma categoria.");
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/tecnicos/${currentId}`, formData);
        alert("Técnico atualizado!");
      } else {
        await api.post('/tecnicos', formData);
        alert("Técnico criado!");
      }
      setAddModalOpen(false);
      setEditModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar técnico.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Excluir técnico?")) {
      try {
        await api.delete(`/tecnicos/${id}`);
        setTechnicians(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Gestão de Técnicos</h1>
        </div>
        
        <div>
            <Link to="/tecnicos/categorias" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
                Gerenciar Categorias
            </Link>
            <button className="btn btn-primary" onClick={openAdd}>+ Novo Técnico</button>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? <p style={{padding: '1.5rem'}}>Carregando...</p> : (
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <thead>
              <tr>
                <th style={{width: '40%', textAlign: 'left', paddingLeft: '2rem'}}>Nome</th>
                <th style={{width: '40%', textAlign: 'left'}}>Categoria</th>
                <th style={{width: '20%', textAlign: 'center'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {technicians.length > 0 ? (
                technicians.map(t => (
                  <tr key={t.id}>
                    <td style={{paddingLeft: '2rem', fontWeight: 'bold'}}>{t.nome}</td>
                    <td>{t.especialidade}</td> 
                    <td style={{textAlign: 'center'}}>
                      <button className="btn btn-secondary" onClick={() => openEdit(t)}>Editar</button>
                      <button className="btn btn-danger" style={{marginLeft: 5}} onClick={() => handleDelete(t.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                    <td colSpan="3" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>Nenhum técnico cadastrado.</td>
                 </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal (reutilizado) */}
      {[isAddModalOpen, isEditModalOpen].map((isOpen, index) => {
        if (!isOpen) return null;
        const isEdit = index === 1;
        return (
          <Modal key={index} isOpen={true} onClose={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)} 
                 title={isEdit ? "Editar Técnico" : "Adicionar Técnico"}>
             
             <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
                {isEdit ? "Modifique os dados do técnico." : "Preencha os dados do novo técnico."}
             </p>

             <div className="form-group">
                <label>Nome</label>
                <input name="nome" value={formData.nome} onChange={handleInputChange} />
             </div>
             <div className="form-group">
                <label>Categoria</label>
                <select name="idCategoria" value={formData.idCategoria} onChange={handleInputChange} className="form-select">
                   <option value="">Selecione uma categoria</option>
                   {categories.map(c => (
                     <option key={c.id} value={c.id}>{c.nome}</option>
                   ))}
                </select>
                {categories.length === 0 && <small style={{color:'red'}}>Cadastre categorias primeiro.</small>}
             </div>
             <div className="modal-actions">
               <button className="btn btn-secondary" onClick={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)}>Cancelar</button>
               <button className="btn btn-primary" onClick={() => handleSave(isEdit)}>
                   {isEdit ? 'Salvar' : 'Adicionar'}
               </button>
             </div>
          </Modal>
        );
      })}
    </div>
  );
};

export default TechnicianList;
