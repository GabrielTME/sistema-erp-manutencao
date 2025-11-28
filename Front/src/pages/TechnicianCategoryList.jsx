import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';

const TechnicianCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tecnicos/categorias');
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!name) return alert('Nome é obrigatório');
    try {
      // O Backend espera { "nome": "..." }
      await api.post('/tecnicos/categorias', { nome: name });
      alert('Categoria criada!');
      setName('');
      setAddModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert('Erro ao criar categoria.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Excluir categoria?")) {
      try {
        await api.delete(`/tecnicos/categorias/${id}`);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        alert('Erro: Pode haver técnicos vinculados a esta categoria.');
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-left">
           <Link to="/" className="btn btn-secondary btn-back">&larr; Voltar</Link>
           <h1>Categorias de Técnicos</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>+ Nova Categoria</button>
      </div>

      <div className="table-wrapper">
        {loading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td><span className="id-tag">{cat.id}</span></td>
                  <td>{cat.nome}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(cat.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Nova Categoria">
        <div className="form-group">
          <label>Nome da Categoria</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Eletricista" />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleAddCategory}>Salvar</button>
        </div>
      </Modal>
    </div>
  );
};

export default TechnicianCategoryList;
