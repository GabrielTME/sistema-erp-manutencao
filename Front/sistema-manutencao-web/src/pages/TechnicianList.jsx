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
  
  // Form States
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', idCategoria: '' });

  // --- BUSCAS ---
  const loadData = async () => {
    setLoading(true);
    try {
      // Busca categorias para o Select
      const cats = await api.get('/tecnicos/categorias');
      setCategories(cats.data);

      // Busca técnicos
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

  // --- HANDLERS ---
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

  // --- AÇÕES API ---
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
        
        {/* Agrupamento de Botões de Ação */}
        <div>
            <Link to="/tecnicos/categorias" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
                Gerenciar Categorias
            </Link>
            <button className="btn btn-primary" onClick={openAdd}>+ Novo Técnico</button>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Especialidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {technicians.length > 0 ? (
                technicians.map(t => (
                  <tr key={t.id}>
                    <td>{t.nome}</td>
                    <td>{t.especialidade}</td> 
                    <td>
                      <button className="btn btn-secondary" onClick={() => openEdit(t)}>Editar</button>
                      <button className="btn btn-danger" style={{marginLeft: 5}} onClick={() => handleDelete(t.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                    <td colSpan="3" style={{textAlign: 'center'}}>Nenhum técnico cadastrado.</td>
                 </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL (Reutilizei estrutura para evitar duplicidade de código visual) */}
      {[isAddModalOpen, isEditModalOpen].map((isOpen, index) => {
        if (!isOpen) return null;
        const isEdit = index === 1;
        return (
          <Modal key={index} isOpen={true} onClose={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)} 
                 title={isEdit ? "Editar Técnico" : "Novo Técnico"}>
             <div className="form-group">
                <label>Nome</label>
                <input name="nome" value={formData.nome} onChange={handleInputChange} />
             </div>
             <div className="form-group">
                <label>Categoria / Especialidade</label>
                <select name="idCategoria" value={formData.idCategoria} onChange={handleInputChange} className="form-select">
                   <option value="">Selecione...</option>
                   {categories.map(c => (
                     <option key={c.id} value={c.id}>{c.nome}</option>
                   ))}
                </select>
                {categories.length === 0 && <small style={{color:'red'}}>Cadastre categorias primeiro.</small>}
             </div>
             <div className="modal-actions">
               <button className="btn btn-secondary" onClick={() => isEdit ? setEditModalOpen(false) : setAddModalOpen(false)}>Cancelar</button>
               <button className="btn btn-primary" onClick={() => handleSave(isEdit)}>Salvar</button>
             </div>
          </Modal>
        );
      })}
    </div>
  );
};

export default TechnicianList;
