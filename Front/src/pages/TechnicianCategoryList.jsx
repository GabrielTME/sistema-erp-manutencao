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
           <Link to="/tecnicos" className="btn btn-secondary btn-back">&larr; Voltar para Técnicos</Link>
           <h1>Categorias de Técnicos</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>+ Nova Categoria</button>
      </div>

      <div className="table-wrapper">
        {loading ? <p style={{padding: '1.5rem'}}>Carregando...</p> : (
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <thead>
              <tr>
                <th style={{width: '15%', textAlign: 'left', paddingLeft: '2rem'}}>ID</th>
                <th style={{width: '60%', textAlign: 'left'}}>Nome da Categoria</th>
                <th style={{width: '25%', textAlign: 'center'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{paddingLeft: '2rem'}}>
                        <span style={{
                            backgroundColor: '#e2e8f0', color: '#475569', padding: '4px 8px',
                            borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem',
                            fontFamily: 'monospace', display: 'inline-block'
                        }}>
                            {cat.id}
                        </span>
                    </td>
                    <td><strong>{cat.nome}</strong></td>
                    <td style={{textAlign: 'center'}}>
                      <button className="btn btn-danger" onClick={() => handleDelete(cat.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>Nenhuma categoria cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Adicionar Categoria">
        <p style={{color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '-0.5rem'}}>
            Preencha o nome da nova categoria de especialidade.
        </p>
        <div className="form-group">
          <label>Nome da Categoria</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
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
